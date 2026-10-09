import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateInvoiceId } from "@/lib/id-generator";
import { apiHandler, checkPermission } from "@/lib/api";

const VALID_METHODS = ["CASH", "CARD", "BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER"];

/**
 * POST /api/memberships/[id]/pay
 * Record a manual payment against a membership and activate it.
 *
 * Body: { amount, method, transactionId?, note? }
 */
export const POST = apiHandler(async (req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "memberships", "edit");
  if (denied) return denied;

  const { id } = await params!;
  const { amount, method, transactionId, note } = await req.json();

  if (!amount || Number(amount) <= 0)
    return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });

  if (!method || !VALID_METHODS.includes(method))
    return NextResponse.json({ error: `Method must be one of: ${VALID_METHODS.join(", ")}` }, { status: 400 });

  const membership = await prisma.membership.findUnique({
    where:   { id },
    include: { plan: true },
  });
  if (!membership) return NextResponse.json({ error: "Membership not found." }, { status: 404 });

  if (membership.status === "CANCELLED")
    return NextResponse.json({ error: "Cannot record payment for a cancelled membership." }, { status: 409 });

  const invoiceNumber = await generateInvoiceId();
  const actor = session.user.email ?? "staff";

  const [payment] = await prisma.$transaction([
    // 1. Create payment record
    prisma.payment.create({
      data: {
        invoiceNumber,
        memberId:      membership.memberId,
        membershipId:  membership.id,
        amount:        Number(amount),
        discount:      0,
        tax:           0,
        totalAmount:   Number(amount),
        method,
        status:        "PAID",
        paymentDate:   new Date(),
        transactionId: transactionId || null,
        createdBy:     actor,
      },
    }),

    // 2. Activate membership if it was PENDING
    ...(membership.status === "PENDING"
      ? [prisma.membership.update({
          where: { id },
          data:  { status: "ACTIVE" },
        })]
      : []),

    // 3. Timeline entry
    prisma.membershipTimeline.create({
      data: {
        membershipId: id,
        event:        "PAYMENT_RECORDED",
        note:         note
          ? `Manual payment via ${method} — ৳${Number(amount).toLocaleString()}. ${note}`
          : `Manual payment via ${method} — ৳${Number(amount).toLocaleString()}.`,
        createdBy: actor,
      },
    }),
  ]);

  return NextResponse.json(payment, { status: 201 });
});
