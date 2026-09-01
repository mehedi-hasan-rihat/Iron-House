import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateStaffId } from "@/lib/id-generator";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    include: { user: { include: { role: true } } },
  });
  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, email, address, designation, roleName,
          salary, joiningDate, password = "staff123" } = body;

  if (!name || !phone || !designation || !roleName) {
    return NextResponse.json({ error: "name, phone, designation and roleName are required" }, { status: 400 });
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

  const staffId    = await generateStaffId();
  const hashedPass = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email:    email ?? `${staffId.toLowerCase()}@fitgymcenter.local`,
      password: hashedPass,
      roleId:   role.id,
      staff: {
        create: {
          staffId,
          name,
          phone,
          email:       email       ?? null,
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
}
