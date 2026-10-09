import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateStaffId } from "@/lib/id-generator";
import { apiHandler, checkPermission } from "@/lib/api";
import bcrypt from "bcryptjs";

export const GET = apiHandler(async () => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "staff", "view");
  if (denied) return denied;
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    include: { user: { include: { role: true } } },
  });
  return NextResponse.json(staff);
});

export const POST = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "staff", "create");
  if (denied) return denied;

  const body = await req.json();
  const { name, phone, email, address, designation, roleName,
          salary, joiningDate, password = "staff123" } = body;

  if (!name || !phone || !designation || !roleName || !email) {
    return NextResponse.json({ error: "name, phone, email, designation and roleName are required" }, { status: 400 });
  }

  if (roleName === "owner") {
    return NextResponse.json({ error: "Cannot assign the owner role to new staff." }, { status: 403 });
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

  const staffId    = await generateStaffId();
  const hashedPass = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPass, roleId: role.id,
      staff: {
        create: {
          staffId, name, phone,
          address:     address     ?? null,
          designation,
          salary:      salary ? Number(salary) : null,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
          status:      "ACTIVE",
        },
      },
    },
    include: { staff: true },
  });

  return NextResponse.json(user.staff, { status: 201 });
});
