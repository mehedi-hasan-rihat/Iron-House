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
      isActive:     body.isActive     !== undefined ? body.isActive     : undefined,
      isPopular:    body.isPopular    !== undefined ? body.isPopular    : undefined,
    },
  });
  return NextResponse.json(plan);
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params!;

  // Block delete if any active memberships reference this plan
  const activeCount = await prisma.membership.count({
    where: { planId: id, status: { in: ["ACTIVE", "FROZEN", "PENDING"] } },
  });

  if (activeCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${activeCount} active membership(s) use this plan. Deactivate it instead.` },
      { status: 409 }
    );
  }

  await prisma.membershipPlan.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
