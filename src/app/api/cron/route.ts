import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async (req: NextRequest) => {
  const token = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
  if (token !== (process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now  = new Date();
  const day1 = new Date(now); day1.setDate(now.getDate() + 1);
  const day3 = new Date(now); day3.setDate(now.getDate() + 3);
  const day7 = new Date(now); day7.setDate(now.getDate() + 7);

  const expired = await prisma.membership.updateMany({
    where: { status: "ACTIVE", endDate: { lt: now } },
    data:  { status: "EXPIRED" },
  });

  const remind = async (daysAhead: number, boundary: Date) => {
    const start = new Date(boundary); start.setHours(0, 0, 0, 0);
    const end   = new Date(boundary); end.setHours(23, 59, 59, 999);
    const expiring = await prisma.membership.findMany({
      where: { status: "ACTIVE", endDate: { gte: start, lte: end } },
      include: { member: true },
    });
    for (const ms of expiring) {
      const msg = `Your membership expires in ${daysAhead} day${daysAhead === 1 ? "" : "s"} on ${ms.endDate.toLocaleDateString("en-BD")}.`;
      await prisma.notification.upsert({
        where:  { id: `${ms.id}-reminder-${daysAhead}d` },
        update: {},
        create: { id: `${ms.id}-reminder-${daysAhead}d`, userId: ms.member.userId, type: "EXPIRY_REMINDER", message: msg, isRead: false },
      });
    }
    return expiring.length;
  };

  const [r1, r3, r7] = await Promise.all([remind(1, day1), remind(3, day3), remind(7, day7)]);
  const result = { expiredMemberships: expired.count, reminders: { day1: r1, day3: r3, day7: r7 }, runAt: now.toISOString() };
  console.log("[cron]", result);
  return NextResponse.json(result);
});
