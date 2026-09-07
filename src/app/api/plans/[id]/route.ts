import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const body = await req.json();
  const plan = await prisma.membershipPlan.update({
    where: { id },
    data: {
      name:         body.name         ?? undefined,
      description:  body.description  ?? undefined,
      durationDays: body.durationDays ? Number(body.durationDays) : undefined,
      price:        body.price !== undefined ? Number(body.price) : undefined,
      type:         body.type         ?? undefined,
      features:     body.features     ?? undefined,
      isActive:     body.isActive     ?? undefined,
      trialEnabled: body.trialEnabled ?? undefined,
      autoRenewal:  body.autoRenewal  ?? undefined,
    },
  });
  return NextResponse.json(plan);
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const plan = await prisma.membershipPlan.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json(plan);
});
