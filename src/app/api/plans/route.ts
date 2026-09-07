import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async () => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const plans = await prisma.membershipPlan.findMany({
    orderBy: [{ isActive: "desc" }, { price: "asc" }],
    include: { _count: { select: { memberships: true } } },
  });
  return NextResponse.json(plans);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, durationDays, price, type, features,
          isActive, trialEnabled, autoRenewal } = body;

  if (!name || !durationDays || price === undefined || !type) {
    return NextResponse.json({ error: "name, durationDays, price and type are required" }, { status: 400 });
  }

  const plan = await prisma.membershipPlan.create({
    data: {
      name, description: description ?? null,
      durationDays: Number(durationDays), price: Number(price), type,
      features:     features     ?? {},
      isActive:     isActive     ?? true,
      trialEnabled: trialEnabled ?? false,
      autoRenewal:  autoRenewal  ?? false,
    },
  });
  return NextResponse.json(plan, { status: 201 });
});
