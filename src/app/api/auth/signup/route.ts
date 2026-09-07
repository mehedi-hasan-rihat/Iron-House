import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateMemberId } from "@/lib/id-generator";
import { apiHandler } from "@/lib/api";
import bcrypt from "bcryptjs";

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { fullName, phone, email, password } = body as {
    fullName?: string; phone?: string; email?: string; password?: string;
  };

  if (!fullName?.trim() || !phone?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Full name, phone, email and password are required." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const memberRole = await prisma.role.findUnique({ where: { name: "member" } });
  if (!memberRole) {
    return NextResponse.json({ error: "System error — member role not found." }, { status: 500 });
  }

  const memberId   = await generateMemberId();
  const hashedPass = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPass,
      roleId:   memberRole.id,
      member: {
        create: {
          memberId,
          fullName: fullName.trim(),
          phone:    phone.trim(),
          email,
          status:   "ACTIVE",
        },
      },
    },
  });

  return NextResponse.json({ ok: true, email });
});
