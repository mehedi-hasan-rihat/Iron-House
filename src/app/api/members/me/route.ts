import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const member = await prisma.member.findUnique({ where: { userId: session.user.id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      fullName:        body.fullName        || undefined,
      phone:           body.phone           || undefined,
      email:           body.email           || undefined,
      address:         body.address         || undefined,
      emergencyContact: body.emergencyContact || undefined,
    },
  });
  return NextResponse.json(updated);
}
