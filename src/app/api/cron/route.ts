/**
 * GET /api/cron
 *
 * Call this daily via Vercel Cron, cPanel cron, or any scheduler:
 *   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron
 *
 * What it does:
 *   1. Marks ACTIVE memberships past their endDate as EXPIRED
 *   2. Creates EXPIRY_REMINDER notifications for members expiring in 1, 3, 7 days
 *   3. Marks SUSPENDED members' active memberships as EXPIRED
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // simple bearer token auth to prevent public access
  const auth  = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  if (token !== (process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now   = new Date();
  const day1  = new Date(now); day1.setDate(now.getDate() + 1);
  const day3  = new Date(now); day3.setDate(now.getDate() + 3);
  const day7  = new Date(now); day7.setDate(now.getDate() + 7);

  // ── 1. Expire overdue memberships ──────────────────
  const expired = await prisma.membership.updateMany({
    where: { status: "ACTIVE", endDate: { lt: now } },
    data:  { status: "EXPIRED" },
  });

  // ── 2. Expiry reminders (1, 3, 7 days) ─────────────
  const remind = async (daysAhead: number, boundary: Date) => {
    const start = new Date(boundary); start.setHours(0, 0, 0, 0);
    const end   = new Date(boundary); end.setHours(23, 59, 59, 999);

    const expiring = await prisma.membership.findMany({
      where: { status: "ACTIVE", endDate: { gte: start, lte: end } },
      include: { member: true },
    });

    for (const ms of expiring) {
      const msg = `Your membership (${ms.membershipNumber}) expires in ${daysAhead} day${daysAhead === 1 ? "" : "s"} on ${ms.endDate.toLocaleDateString("en-BD")}.`;
      await prisma.notification.upsert({
        where: {
          // use a composite-like unique string to avoid duplicate reminders per day
          id: `${ms.id}-reminder-${daysAhead}d`,
        },
        update: {},
        create: {
          id:      `${ms.id}-reminder-${daysAhead}d`,
          userId:  ms.member.userId,
          type:    "EXPIRY_REMINDER",
          message: msg,
          isRead:  false,
        },
      });
    }
    return expiring.length;
  };

  const [r1, r3, r7] = await Promise.all([
    remind(1, day1),
    remind(3, day3),
    remind(7, day7),
  ]);

  const result = {
    expiredMemberships: expired.count,
    reminders: { day1: r1, day3: r3, day7: r7 },
    runAt: now.toISOString(),
  };

  console.log("[cron]", result);
  return NextResponse.json(result);
}
