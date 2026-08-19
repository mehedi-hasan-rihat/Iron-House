import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle, DollarSign, Calendar, UserPlus, Clock } from "lucide-react";
import Stagger from "@/components/motion/Stagger";
import CountUp from "@/components/motion/CountUp";
import MagneticBox from "@/components/motion/MagneticBox";

const ACC = "#BFE01D";

async function getStats() {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week  = new Date(today); week.setDate(today.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalMembers,
    activeMembers,
    inactiveMembers,
    expiredMemberships,
    expiringToday,
    expiringThisWeek,
    newThisMonth,
    totalStaff,
    todayRevenue,
    monthRevenue,
    pendingPayments,
    failedPayments,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.member.count({ where: { status: { in: ["SUSPENDED", "FROZEN"] } } }),
    prisma.membership.count({ where: { status: "EXPIRED" } }),
    prisma.membership.count({
      where: { status: "ACTIVE", endDate: { gte: today, lt: new Date(today.getTime() + 86400000) } },
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endDate: { gte: today, lte: week } },
    }),
    prisma.member.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.staff.count({ where: { status: "ACTIVE" } }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: today } },
      _sum: { totalAmount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: monthStart } },
      _sum: { totalAmount: true },
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
  ]);

  return {
    totalMembers, activeMembers, inactiveMembers, expiredMemberships,
    expiringToday, expiringThisWeek, newThisMonth, totalStaff,
    todayRevenue:   Number(todayRevenue._sum.totalAmount   ?? 0),
    monthRevenue:   Number(monthRevenue._sum.totalAmount   ?? 0),
    pendingPayments, failedPayments,
  };
}

function StatCard({
  label, value, icon: Icon, accent = false, warning = false, prefix = "",
}: {
  label: string; value: number; prefix?: string;
  icon: React.ElementType; accent?: boolean; warning?: boolean;
}) {
  return (
    <div className={`
      panel group border p-5 flex items-start justify-between
      transition-[transform,border-color] duration-300 hover:-translate-y-0.5
      ${accent  ? "border-[#BFE01D]"        : ""}
      ${warning ? "border-orange-500/40"    : ""}
      ${!accent && !warning ? "border-[#BFE01D]/15 hover:border-[#BFE01D]/40" : ""}
    `}>
      <div>
        <p className="label mb-2">{label}</p>
        <p className="font-display text-3xl md:text-4xl text-[#f2f4e8] leading-none">
          <CountUp value={value} prefix={prefix} />
        </p>
      </div>
      <div className={`
        h-9 w-9 rounded-sm flex items-center justify-center
        transition-transform duration-300 group-hover:scale-110
        ${accent  ? "bg-[#BFE01D]/10"     : ""}
        ${warning ? "bg-orange-500/10"     : ""}
        ${!accent && !warning ? "bg-[#BFE01D]/[0.06]" : ""}
      `}>
        <Icon
          size={18}
          style={{ color: accent ? ACC : warning ? "#f97316" : "#9aa87a" }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  await requireStaff();
  const s = await getStats();

  return (
    <div className="space-y-8">

      {/* heading */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-[#f2f4e8] uppercase tracking-wide">Dashboard</h1>
        <p className="label text-[#9aa87a] mt-1">Welcome back · {new Date().toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Members */}
      <section>
        <p className="label text-[#9aa87a] mb-4">Members</p>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total Members"      value={s.totalMembers}       icon={Users}      accent />
          <StatCard label="Active"             value={s.activeMembers}      icon={TrendingUp} />
          <StatCard label="Inactive / Frozen"  value={s.inactiveMembers}    icon={AlertCircle} warning={s.inactiveMembers > 0} />
          <StatCard label="Expired Memberships" value={s.expiredMemberships} icon={Clock}      warning={s.expiredMemberships > 0} />
        </Stagger>
      </section>

      {/* Expiring */}
      <section>
        <p className="label text-[#9aa87a] mb-4">Expiring</p>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Expiring Today"     value={s.expiringToday}     icon={AlertCircle} warning={s.expiringToday > 0} />
          <StatCard label="Expiring This Week" value={s.expiringThisWeek}  icon={Calendar}    warning={s.expiringThisWeek > 0} />
          <StatCard label="New This Month"     value={s.newThisMonth}      icon={UserPlus}    accent={s.newThisMonth > 0} />
        </Stagger>
      </section>

      {/* Revenue */}
      <section>
        <p className="label text-[#9aa87a] mb-4">Revenue</p>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Today's Revenue"  value={s.todayRevenue} prefix="৳"  icon={DollarSign} accent />
          <StatCard label="Monthly Revenue"  value={s.monthRevenue} prefix="৳"  icon={TrendingUp} />
          <StatCard label="Pending Payments" value={s.pendingPayments} icon={Clock}      warning={s.pendingPayments > 0} />
          <StatCard label="Failed Payments"  value={s.failedPayments}  icon={AlertCircle} warning={s.failedPayments > 0} />
        </Stagger>
      </section>

      {/* Staff */}
      <section>
        <p className="label text-[#9aa87a] mb-4">Staff</p>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Active Staff" value={s.totalStaff} icon={UserPlus} />
        </Stagger>
      </section>

      {/* Quick actions */}
      <section>
        <p className="label text-[#9aa87a] mb-4">Quick Actions</p>
        <Stagger className="flex flex-wrap gap-3" stagger={0.05}>
          {[
            { label: "Add Member",          href: "/admin/members/new"     },
            { label: "Record Payment",       href: "/admin/payments/new"    },
            { label: "Create Membership",    href: "/admin/memberships/new" },
            { label: "Add Staff",            href: "/admin/staff/new"       },
            { label: "Create Plan",          href: "/admin/plans/new"       },
          ].map((a) => (
            <MagneticBox key={a.href}>
              <a
                href={a.href}
                className="inline-flex items-center gap-2 border border-[#BFE01D]/15 panel hover:border-[#BFE01D] hover:text-[#BFE01D] text-[#9aa87a] text-xs uppercase tracking-[0.2em] px-5 py-3 transition-colors"
              >
                {a.label}
              </a>
            </MagneticBox>
          ))}
        </Stagger>
      </section>

    </div>
  );
}
