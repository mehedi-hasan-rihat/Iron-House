import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
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
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // soft delete — just deactivate
  const plan = await prisma.membershipPlan.update({
    where: { id },
    data:  { isActive: false },
  });
  return NextResponse.json(plan);
}
