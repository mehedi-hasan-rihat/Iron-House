import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

/** DELETE /api/memberships/[id]/comments/[commentId] */
export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId } = await params!;

  const exists = await prisma.membershipComment.findUnique({ where: { id: commentId }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Comment not found." }, { status: 404 });

  await prisma.membershipComment.delete({ where: { id: commentId } });
  return NextResponse.json({ success: true });
});
