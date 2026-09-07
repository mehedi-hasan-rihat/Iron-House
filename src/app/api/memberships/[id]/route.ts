import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateMembershipId, generateInvoiceId } from "@/lib/id-generator";
import { apiHandler } from "@/lib/api";

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params!;
  const body = await req.json();
  const { action } = body;

  const existing = await prisma.membership.findUnique({ where: { id }, include: { plan: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "renew") {
    const newStart = new Date(existing.endDate);
    const newEnd   = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + existing.plan.durationDays);
    const newNumber = await generateMembershipId();

    const renewed = await prisma.membership.create({
      data: {
        membershipNumber: newNumber,
        memberId:   existing.memberId, planId: existing.planId,
        trainerId:  existing.trainerId,
        startDate:  newStart, endDate: newEnd,
        amount:     existing.amount, discount: existing.discount,
        tax:        existing.tax, finalAmount: existing.finalAmount,
        status:     "ACTIVE",
        timeline: { create: { event: "RENEWED", note: `Renewed from ${existing.membershipNumber}`, createdBy: session.user.id } },
      },
    });

    if (body.paymentMethod) {
      const invoiceNumber = await generateInvoiceId();
      await prisma.payment.create({
        data: {
          invoiceNumber, memberId: existing.memberId, membershipId: renewed.id,
          amount: Number(existing.amount), discount: Number(existing.discount),
          tax: Number(existing.tax), totalAmount: Number(existing.finalAmount),
          method: body.paymentMethod, status: "PAID", paymentDate: new Date(),
          createdBy: session.user.id,
        },
      });
    }
    return NextResponse.json(renewed);
  }

  const statusMap: Record<string, "ACTIVE" | "FROZEN" | "CANCELLED"> = {
    freeze: "FROZEN", resume: "ACTIVE", cancel: "CANCELLED",
  };
  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const updated = await prisma.membership.update({
    where: { id },
    data: {
      status: newStatus,
      timeline: { create: { event: action.toUpperCase(), createdBy: session.user.id } },
    },
  });
  return NextResponse.json(updated);
});
