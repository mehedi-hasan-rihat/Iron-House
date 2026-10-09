import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler, checkPermission } from "@/lib/api";

export const GET = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "payments", "view");
  if (denied) return denied;
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
  // Refund action needs refund permission; generic edit needs edit permission
  const body = await req.json();
  const action = body.status === "REFUNDED" ? "refund" : "edit";
  const denied = await checkPermission(session, "payments", action);
  if (denied) return denied;
  const { id } = await params!;
  const updated = await prisma.payment.update({ where: { id }, data: { status: body.status } });
  return NextResponse.json(updated);
});
