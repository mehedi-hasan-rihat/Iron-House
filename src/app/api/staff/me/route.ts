import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";
import bcrypt from "bcryptjs";

export const GET = apiHandler(async () => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staff = await prisma.staff.findUnique({
    where:   { userId: session.user.id },
    include: { user: { include: { role: true } } },
  });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id:          staff.id,
    staffId:     staff.staffId,
    name:        staff.name,
    phone:       staff.phone,
    email:       staff.user.email,
    address:     staff.address     ?? "",
    designation: staff.designation,
    role:        staff.user.role.name,
    salary:      staff.salary ? Number(staff.salary) : null,
    joiningDate: staff.joiningDate.toISOString().split("T")[0],
    status:      staff.status,
  });
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // ── Profile update (phone / address) ────────────────────────────────────
  if (body.type === "profile") {
    const { phone, address } = body;
    if (!phone) {
      return NextResponse.json({ error: "Phone is required." }, { status: 400 });
    }
    const updated = await prisma.staff.update({
      where: { userId: session.user.id },
      data: {
        phone,
        address: address || null,
      },
    });
    return NextResponse.json({ success: true, phone: updated.phone, address: updated.address });
  }

  // ── Password change ──────────────────────────────────────────────────────
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "currentPassword and newPassword are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data:  { password: hashed },
  });

  return NextResponse.json({ success: true });
});
