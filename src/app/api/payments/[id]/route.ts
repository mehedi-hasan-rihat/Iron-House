import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      member:     { select: { fullName: true, memberId: true, phone: true } },
      membership: { include: { plan: true } },
      attempts:   { orderBy: { attemptAt: "desc" } },
    },
  });
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(payment);
});

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const { status } = await req.json();
  const updated = await prisma.payment.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
});
