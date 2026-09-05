/**
 * POST /api/moneybag/webhook
 *
 * Moneybag IPN (Instant Payment Notification).
 * Moneybag posts here when a payment reaches a terminal state.
 * We verify independently and update our records idempotently.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayment } from "@/lib/payments/moneybag";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const transactionId = body?.transaction_id as string | undefined;
  const orderId       = body?.order_id       as string | undefined; // = invoiceNumber

  if (!transactionId || !orderId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Always verify independently — do not trust the webhook body alone
  let verified;
  try {
    verified = await verifyPayment(transactionId);
  } catch (err) {
    console.error("[moneybag/webhook] verification error", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 502 });
  }

  await fulfillPayment(verified.order_id, transactionId, verified.status);

  return NextResponse.json({ received: true });
}

/**
 * Shared fulfillment logic — called by both webhook and success-page verify.
 * Idempotent: safe to call multiple times for the same invoice.
 */
export async function fulfillPayment(
  invoiceNumber: string,
  transactionId: string,
  gatewayStatus: string
) {
  const payment = await prisma.payment.findUnique({
    where:   { invoiceNumber },
    include: { membership: true },
  });

  if (!payment) return;
  // Already in a terminal state — skip
  if (payment.status === "PAID" || payment.status === "REFUNDED") return;

  const isPaid      = gatewayStatus === "SUCCESS";
  const isCancelled = gatewayStatus === "CANCELLED";

  const paymentStatus = isPaid      ? "PAID"
                      : isCancelled ? "CANCELLED"
                      :               "FAILED";

  const membershipStatus = isPaid      ? "ACTIVE"
                         : isCancelled ? "CANCELLED"
                         :               "CANCELLED";

  await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status:        paymentStatus,
        transactionId,
        paymentDate:   isPaid ? new Date() : null,
      },
    });

    // Log attempt
    await tx.paymentAttempt.create({
      data: {
        paymentId:       payment.id,
        status:          gatewayStatus,
        gatewayResponse: { transaction_id: transactionId, status: gatewayStatus },
      },
    });

    // Update membership if linked
    if (payment.membershipId) {
      await tx.membership.update({
        where: { id: payment.membershipId },
        data:  { status: membershipStatus },
      });

      if (isPaid) {
        await tx.membershipTimeline.create({
          data: {
            membershipId: payment.membershipId,
            event:        "ACTIVATED",
            note:         `Paid via Moneybag. Transaction: ${transactionId}`,
          },
        });
      }
    }
  });
}
