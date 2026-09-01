import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET /api/members/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const member = await prisma.member.findUnique({
    where:   { id },
    include: {
      memberships: { include: { plan: true, trainer: true }, orderBy: { createdAt: "desc" } },
      payments:    { orderBy: { createdAt: "desc" }, take: 10 },
      documents:   true,
      notes:       { orderBy: { createdAt: "desc" } },
    },
  });

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

// PATCH /api/members/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const member = await prisma.member.update({
    where: { id },
    data: {
      fullName:        body.fullName        ?? undefined,
      phone:           body.phone           ?? undefined,
      email:           body.email           ?? undefined,
      gender:          body.gender          ?? undefined,
      dob:             body.dob ? new Date(body.dob) : undefined,
      address:         body.address         ?? undefined,
      bloodGroup:      body.bloodGroup      ?? undefined,
      medicalInfo:     body.medicalInfo     ?? undefined,
      emergencyContact: body.emergencyContact ?? undefined,
      status:          body.status          ?? undefined,
    },
  });

  return NextResponse.json(member);
}

// DELETE /api/members/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
