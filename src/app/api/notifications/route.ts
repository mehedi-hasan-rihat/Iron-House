import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, ...(unreadOnly ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });
  return NextResponse.json({ notifications, unreadCount });
});

export const PATCH = apiHandler(async () => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data:  { isRead: true },
  });
  return NextResponse.json({ success: true });
});
