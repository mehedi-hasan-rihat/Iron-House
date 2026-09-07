import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateMembershipId, generateInvoiceId } from "@/lib/id-generator";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const memberId = searchParams.get("memberId") ?? "";
  const status   = searchParams.get("status")   ?? "";
  const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit    = 20;

  const where = {
    ...(memberId ? { memberId } : {}),
    ...(status   ? { status: status as "PENDING" | "ACTIVE" | "FROZEN" | "EXPIRED" | "CANCELLED" } : {}),
  };

  const [memberships, total] = await Promise.all([
    prisma.membership.findMany({
      where, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: "desc" },
      include: { member: true, plan: true, trainer: true },
    }),
    prisma.membership.count({ where }),
  ]);

  return NextResponse.json({ memberships, total, page, limit });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { memberId, planId, trainerId, startDate, amount,
          discount = 0, tax = 0, paymentMethod } = body;

  if (!memberId || !planId || !startDate || amount === undefined) {
    return NextResponse.json({ error: "memberId, planId, startDate and amount are required" }, { status: 400 });
  }

  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const start = new Date(startDate);
  const end   = new Date(start);
  end.setDate(end.getDate() + plan.durationDays);

  const discountNum = Number(discount);
  const taxNum      = Number(tax);
  const amountNum   = Number(amount);
  const final       = amountNum - discountNum + taxNum;
  const membershipNumber = await generateMembershipId();

  const membership = await prisma.membership.create({
    data: {
      membershipNumber, memberId, planId,
      trainerId:   trainerId || null,
      startDate:   start, endDate: end,
      amount:      amountNum, discount: discountNum, tax: taxNum, finalAmount: final,
      status:      "ACTIVE",
      timeline: { create: { event: "CREATED", note: "Created via admin", createdBy: session.user.id } },
    },
    include: { member: true, plan: true },
  });

  if (paymentMethod) {
    const invoiceNumber = await generateInvoiceId();
    await prisma.payment.create({
      data: {
        invoiceNumber, memberId, membershipId: membership.id,
        amount: amountNum, discount: discountNum, tax: taxNum, totalAmount: final,
        method: paymentMethod, status: "PAID", paymentDate: new Date(),
        createdBy: session.user.id,
      },
    });
  }

  return NextResponse.json(membership, { status: 201 });
});
