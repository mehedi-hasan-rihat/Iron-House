/**
 * POST /api/moneybag/checkout
 *
 * Creates a Moneybag hosted-checkout session for an authenticated member
 * wanting to purchase a membership plan.
 *
 * Body: { planId: string }
 *
 * Returns: { checkoutUrl: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateInvoiceId, generateMembershipId } from "@/lib/id-generator";
import { createCheckout } from "@/lib/payments/moneybag";

const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body    = await req.json();
  const planId  = body?.planId as string | undefined;

  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  // Load plan
  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    return NextResponse.json({ error: "Plan not found or inactive" }, { status: 404 });
  }

  // Load member
  const member = await prisma.member.findUnique({ where: { userId: session.user.id } });
  if (!member) {
    return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
  }

  // Generate a stable order / invoice ID for this checkout attempt
  const invoiceNumber = await generateInvoiceId();

  // Persist a PENDING payment so we can look it up on the callback
  const startDate = new Date();
  const endDate   = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const membershipNumber = await generateMembershipId();

  // Create a PENDING membership + PENDING payment atomically
  const { payment } = await prisma.$transaction(async (tx) => {
    const membership = await tx.membership.create({
      data: {
        membershipNumber,
        memberId:    member.id,
        planId:      plan.id,
        startDate,
        endDate,
        amount:      plan.price,
        finalAmount: plan.price,
        status:      "PENDING",
      },
    });

    const payment = await tx.payment.create({
      data: {
        invoiceNumber,
        memberId:     member.id,
        membershipId: membership.id,
        amount:       plan.price,
        totalAmount:  plan.price,
        method:       "MONEYBAG",
        status:       "PENDING",
        createdBy:    session.user.id,
      },
    });

    return { membership, payment };
  });

  // Create Moneybag hosted-checkout session
  let checkout;
  try {
    checkout = await createCheckout({
      orderId:     invoiceNumber,
      amount:      Number(plan.price),
      description: `${plan.name} Membership — Iron House`,
      successUrl:  `${APP_URL}/payments/success?invoice=${invoiceNumber}`,
      cancelUrl:   `${APP_URL}/payments/cancelled?invoice=${invoiceNumber}`,
      failUrl:     `${APP_URL}/payments/failed?invoice=${invoiceNumber}`,
      ipnUrl:      `${APP_URL}/api/moneybag/webhook`,
      customer: {
        name:  member.fullName,
        email: member.email ?? `${member.memberId.toLowerCase()}@ironhouse.local`,
        phone: member.phone,
      },
    });
  } catch (err) {
    console.error("[moneybag/checkout] createCheckout error:", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }

  console.log("[moneybag/checkout] raw response:", JSON.stringify(checkout));

  // Store the Moneybag session_id on the payment row for reconciliation
  await prisma.payment.update({
    where: { id: payment.id },
    data:  { transactionId: checkout.session_id },
  });

  return NextResponse.json({ checkoutUrl: checkout.checkout_url });
}
