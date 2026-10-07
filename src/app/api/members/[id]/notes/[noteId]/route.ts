import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

/** DELETE /api/members/[id]/notes/[noteId] */
export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params!;

  const note = await prisma.memberNote.findUnique({ where: { id: noteId }, select: { id: true } });
  if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  await prisma.memberNote.delete({ where: { id: noteId } });

  return NextResponse.json({ success: true });
});
