/**
 * POST /api/auth/signup
 * Public endpoint — no session required.
 * Creates a member account and returns the new user's email so the
 * caller can immediately sign them in with NextAuth credentials.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateMemberId } from "@/lib/id-generator";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, phone, email, password } = body as {
    fullName?: string;
    phone?:    string;
    email?:    string;
    password?: string;
  };

  if (!fullName?.trim() || !phone?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: "Full name, phone, email and password are required." },
      { status: 400 }
    );
  }

  // Check email not already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const memberRole = await prisma.role.findUnique({ where: { name: "member" } });
  if (!memberRole) {
    return NextResponse.json({ error: "System error. Please try again." }, { status: 500 });
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
}
