import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateInvoiceId } from "@/lib/id-generator";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const memberId = searchParams.get("memberId") ?? "";
  const status   = searchParams.get("status")   ?? "";
  const method   = searchParams.get("method")   ?? "";
  const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit    = 20;
  const skip     = (page - 1) * limit;

  const where = {
    ...(memberId ? { memberId } : {}),
    ...(status   ? { status: status as "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED" } : {}),
    ...(method   ? { method: method as "CASH" | "CARD" | "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" } : {}),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: { member: { select: { fullName: true, memberId: true } } },
    }),
    prisma.payment.count({ where }),
  ]);

  return NextResponse.json({ payments, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { memberId, membershipId, amount, discount = 0, tax = 0,
          method, transactionId, paymentDate } = body;

  if (!memberId || !amount || !method) {
    return NextResponse.json({ error: "memberId, amount and method are required" }, { status: 400 });
  }

  const invoiceNumber = await generateInvoiceId();
  const total = Number(amount) - Number(discount) + Number(tax);

  const payment = await prisma.payment.create({
    data: {
      invoiceNumber,
      transactionId: transactionId || null,
      memberId,
      membershipId:  membershipId || null,
      amount:        Number(amount),
      discount:      Number(discount),
      tax:           Number(tax),
      totalAmount:   total,
      method,
      status:        "PAID",
      paymentDate:   paymentDate ? new Date(paymentDate) : new Date(),
      createdBy:     session.user.id,
    },
    include: { member: { select: { fullName: true, memberId: true } } },
  });

  return NextResponse.json(payment, { status: 201 });
}
