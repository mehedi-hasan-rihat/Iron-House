import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

/** POST /api/members/[id]/notes — add a note */
export const POST = apiHandler(async (req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params!;
  const { note } = await req.json();

  if (!note || typeof note !== "string" || !note.trim()) {
    return NextResponse.json({ error: "Note text is required." }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { id }, select: { id: true } });
  if (!member) return NextResponse.json({ error: "Member not found." }, { status: 404 });

  const created = await prisma.memberNote.create({
    data: {
      memberId:  id,
      note:      note.trim(),
      createdBy: session.user.email ?? "staff",
    },
  });

  return NextResponse.json(created, { status: 201 });
});

/** GET /api/members/[id]/notes — list notes */
export const GET = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params!;

  const notes = await prisma.memberNote.findMany({
    where:   { memberId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
});
