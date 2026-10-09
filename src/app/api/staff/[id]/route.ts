import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler, checkPermission } from "@/lib/api";

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "staff", "edit");
  if (denied) return denied;
  const { id } = await params!;
  const body = await req.json();

  // Guard: cannot assign owner role
  if (body.roleName === "owner") {
    return NextResponse.json(
      { error: "Cannot assign the owner role." },
      { status: 403 }
    );
  }

  // Guard: owner account can only be edited by the owner themselves
  const target = await prisma.staff.findUnique({
    where:   { id },
    include: { user: { include: { role: true } } },
  });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (target.user.role.name === "owner" && target.userId !== session.user.id) {
    return NextResponse.json(
      { error: "The owner account can only be edited by the owner themselves." },
      { status: 403 }
    );
  }

  // Guard: owner cannot be suspended or resigned
  if (
    (body.status === "SUSPENDED" || body.status === "RESIGNED") &&
    target.user.role.name === "owner"
  ) {
    return NextResponse.json(
      { error: "The owner account cannot be suspended or resigned." },
      { status: 403 }
    );
  }

  const staff = await prisma.staff.update({
    where: { id },
    data: {
      name:        body.name        ?? undefined,
      phone:       body.phone       ?? undefined,
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
  const denied = await checkPermission(session, "staff", "delete");
  if (denied) return denied;
  const { id } = await params!;
  const staff = await prisma.staff.findUnique({
    where:   { id },
    include: { user: { include: { role: true } } },
  });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Owner account can never be deleted
  if (staff.user.role.name === "owner") {
    return NextResponse.json({ error: "The owner account cannot be deleted." }, { status: 403 });
  }
  await prisma.user.delete({ where: { id: staff.userId } });
  return NextResponse.json({ success: true });
});
