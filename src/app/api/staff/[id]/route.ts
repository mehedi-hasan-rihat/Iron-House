import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const body = await req.json();
  const staff = await prisma.staff.update({
    where: { id },
    data: {
      name:        body.name        ?? undefined,
      phone:       body.phone       ?? undefined,
      email:       body.email       ?? undefined,
      address:     body.address     ?? undefined,
      designation: body.designation ?? undefined,
      salary:      body.salary ? Number(body.salary) : undefined,
      status:      body.status      ?? undefined,
    },
  });
  return NextResponse.json(staff);
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.user.delete({ where: { id: staff.userId } });
  return NextResponse.json({ success: true });
});
