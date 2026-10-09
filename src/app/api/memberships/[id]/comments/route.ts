import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler, checkPermission } from "@/lib/api";

/** POST /api/memberships/[id]/comments — add a staff comment */
export const POST = apiHandler(async (req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "memberships", "edit");
  if (denied) return denied;

  const { id } = await params!;
  const { comment } = await req.json();

  if (!comment || typeof comment !== "string" || !comment.trim())
    return NextResponse.json({ error: "Comment text is required." }, { status: 400 });

  const exists = await prisma.membership.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Membership not found." }, { status: 404 });

  const entry = await prisma.membershipComment.create({
    data: {
      membershipId: id,
      comment:      comment.trim(),
      createdBy:    session.user.email ?? "staff",
    },
  });

  return NextResponse.json(entry, { status: 201 });
});

/** GET /api/memberships/[id]/comments — list comments */
export const GET = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "memberships", "view");
  if (denied) return denied;

  const { id } = await params!;

  const comments = await prisma.membershipComment.findMany({
    where:   { membershipId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
});

/** DELETE /api/memberships/[id]/comments/[commentId] — delete a comment */
export const DELETE = apiHandler(async (req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "memberships", "edit");
  if (denied) return denied;

  const { id } = await params!;
  const url = new URL(req.url);
  const commentId = url.pathname.split("/").pop();

  if (!commentId || commentId === id)
    return NextResponse.json({ error: "Comment ID required." }, { status: 400 });

  await prisma.membershipComment.delete({ where: { id: commentId } });
  return NextResponse.json({ success: true });
});
