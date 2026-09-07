import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayment } from "@/lib/payments/moneybag";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async (req: NextRequest) => {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const transactionId = body?.transaction_id as string | undefined;
  const orderId       = body?.order_id       as string | undefined;

  if (!transactionId || !orderId) {
    return NextResponse.json({ error: "Missing transaction_id or order_id" }, { status: 400 });
  }

  const verified = await verifyPayment(transactionId);
  await fulfillPayment(orderId, transactionId, verified.status);
  return NextResponse.json({ received: true });
});

export async function fulfillPayment(
  invoiceNumber: string,
  transactionId: string,
  gatewayStatus: string,
) {
  const payment = await prisma.payment.findUnique({
    where:   { invoiceNumber },
    include: { membership: true },
  });

  if (!payment) {
    console.warn(`[fulfillPayment] no payment found for invoice ${invoiceNumber}`);
    return;
  }
  if (payment.status === "PAID" || payment.status === "REFUNDED") return;

  const isPaid      = gatewayStatus === "SUCCESS";
  const isCancelled = gatewayStatus === "CANCELLED";
  const paymentStatus    = isPaid ? "PAID" : isCancelled ? "CANCELLED" : "FAILED";
  const membershipStatus = isPaid ? "ACTIVE" : "CANCELLED";

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: paymentStatus, transactionId, paymentDate: isPaid ? new Date() : null },
    });

    await tx.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        status:    gatewayStatus,
        gatewayResponse: { transaction_id: transactionId, status: gatewayStatus },
      },
    });

    if (payment.membershipId) {
      await tx.membership.update({ where: { id: payment.membershipId }, data: { status: membershipStatus } });
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
