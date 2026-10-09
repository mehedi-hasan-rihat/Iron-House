import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  Users, TrendingUp, AlertCircle, DollarSign,
  Calendar, UserPlus, Clock,
} from "lucide-react";
import Stagger from "@/components/motion/Stagger";
import CountUp from "@/components/motion/CountUp";
import MagneticBox from "@/components/motion/MagneticBox";
import RevenueChart from "@/components/admin/RevenueChart";

const ACC = "#BFE01D";

async function getData() {
  const now          = new Date();
  const today        = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart   = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);
  const weekEnd        = new Date(today.getTime() + 7 * 86400000);

  // Last 6 months for revenue chart
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleString("en-BD", { month: "short", year: "2-digit" }),
      start: d,
      end:   new Date(d.getFullYear(), d.getMonth() + 1, 0),
    };
  });

  const [
    totalMembers, activeMembers, inactiveMembers,
    newThisMonth, expiringToday, expiringThisWeek,
    totalStaff,
    todayRevenue, monthRevenue, lastMonthRevenue,
    pendingPayments, failedPayments,
    planDist, paymentMethodDist,
    revenueByMonth,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.member.count({ where: { status: { in: ["SUSPENDED", "FROZEN"] } } }),
    prisma.member.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.membership.count({
      where: { status: "ACTIVE", endDate: { gte: today, lt: new Date(today.getTime() + 86400000) } },
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endDate: { gte: today, lte: weekEnd } },
    }),
    prisma.staff.count({ where: { status: "ACTIVE" } }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: today } },
      _sum:  { totalAmount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: monthStart } },
      _sum:  { totalAmount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum:  { totalAmount: true },
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
    prisma.membership.groupBy({
      by: ["planId"], _count: { id: true },
      where: { status: "ACTIVE" }, orderBy: { _count: { id: "desc" } }, take: 6,
    }),
    prisma.payment.groupBy({
      by: ["method"], _count: { id: true }, where: { status: "PAID" },
    }),
    Promise.all(months.map((m) =>
      prisma.payment.aggregate({
        where: { status: "PAID", paymentDate: { gte: m.start, lte: m.end } },
        _sum:  { totalAmount: true },
      }).then((r) => ({ label: m.label, revenue: Number(r._sum.totalAmount ?? 0) }))
    )),
  ]);

  const planIds = planDist.map((p) => p.planId);
  const plans   = await prisma.membershipPlan.findMany({ where: { id: { in: planIds } } });
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.name]));

  const thisMonthRev = Number(monthRevenue._sum.totalAmount   ?? 0);
  const lastMonthRev = Number(lastMonthRevenue._sum.totalAmount ?? 0);
  const revGrowth    = lastMonthRev > 0
    ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1)
    : null;

  return {
    totalMembers, activeMembers, inactiveMembers,
    newThisMonth, expiringToday, expiringThisWeek,
    totalStaff,
    todayRevenue: Number(todayRevenue._sum.totalAmount ?? 0),
    thisMonthRev, lastMonthRev, revGrowth,
    pendingPayments, failedPayments,
    planDist, planMap, paymentMethodDist,
    revenueByMonth,
  };
}

/* ── Stat card ── */
function KPI({
  label, value, sub, icon: Icon, accent = false, warning = false, prefix = "",
}: {
  label: string; value: number | string; sub?: string; prefix?: string;
  icon: React.ElementType; accent?: boolean; warning?: boolean;
}) {
  const isNum = typeof value === "number";
  return (
    <div className={`panel border p-5 flex items-start justify-between transition-[border-color] duration-200
      ${accent  ? "border-[#BFE01D]"      : ""}
      ${warning ? "border-orange-500/40"  : ""}
      ${!accent && !warning ? "border-[#BFE01D]/15 hover:border-[#BFE01D]/30" : ""}
    `}>
      <div>
        <p className="label text-[#9aa87a] mb-2">{label}</p>
        <p className="font-display text-3xl text-[#f2f4e8] leading-none">
          {isNum ? <CountUp value={value as number} prefix={prefix} /> : value}
        </p>
        {sub && <p className="label text-[#9aa87a] mt-1">{sub}</p>}
      </div>
      <div className={`h-9 w-9 rounded-sm flex items-center justify-center shrink-0
        ${accent  ? "bg-[#BFE01D]/10"    : ""}
        ${warning ? "bg-orange-500/10"   : ""}
        ${!accent && !warning ? "bg-[#BFE01D]/6" : ""}
      `}>
        <Icon size={17} style={{ color: accent ? ACC : warning ? "#f97316" : "#9aa87a" }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const d = await getData();
  const perms = session!.user.permissions ?? [];

  const quickActions = [
    { label: "Add Member",     href: "/admin/members/new",     perm: "members:create"     },
    { label: "New Membership", href: "/admin/memberships/new", perm: "memberships:create" },
    { label: "Add Staff",      href: "/admin/staff/new",       perm: "staff:create"       },
    { label: "Create Plan",    href: "/admin/plans/new",       perm: "plans:create"       },
  ].filter((a) => perms.includes(a.perm as Parameters<typeof perms.includes>[0]));

  return (
    <div className="space-y-7">

      {/* Heading */}
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Overview</h1>
        <p className="label text-[#9aa87a] mt-1">
          {new Date().toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Row 1 — primary KPIs */}
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Monthly Revenue"  value={d.thisMonthRev} prefix="৳" icon={DollarSign} accent
          sub={d.revGrowth ? `${Number(d.revGrowth) >= 0 ? "+" : ""}${d.revGrowth}% vs last month` : undefined} />
        <KPI label="Today's Revenue"  value={d.todayRevenue} prefix="৳" icon={TrendingUp} />
        <KPI label="Total Members"    value={d.totalMembers}              icon={Users} />
        <KPI label="Active Members"   value={d.activeMembers}             icon={UserPlus}
          sub={`${d.newThisMonth} new this month`} />
      </Stagger>

      {/* Row 2 — alerts */}
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Expiring Today"    value={d.expiringToday}   icon={AlertCircle} warning={d.expiringToday > 0} />
        <KPI label="Expiring 7 Days"   value={d.expiringThisWeek} icon={Calendar}    warning={d.expiringThisWeek > 0} />
        <KPI label="Pending Payments"  value={d.pendingPayments}  icon={Clock}       warning={d.pendingPayments > 0} />
        <KPI label="Failed Payments"   value={d.failedPayments}   icon={AlertCircle} warning={d.failedPayments > 0} />
      </Stagger>

      {/* Row 3 — revenue chart + member stats */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Revenue area chart — 2/3 width */}
        <div className="md:col-span-2 border border-[#BFE01D]/15 panel p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="label text-[#9aa87a]">Revenue — Last 6 Months</h2>
            <span className="label text-[#9aa87a]">৳{(d.thisMonthRev / 1000).toFixed(0)}k this month</span>
          </div>
          <RevenueChart data={d.revenueByMonth} />
        </div>

        {/* Member + staff snapshot — 1/3 width */}
        <div className="border border-[#BFE01D]/15 panel p-6 space-y-4">
          <h2 className="label text-[#9aa87a]">Snapshot</h2>
          {[
            { label: "Active Members",     value: d.activeMembers },
            { label: "Inactive / Frozen",  value: d.inactiveMembers },
            { label: "New This Month",      value: d.newThisMonth },
            { label: "Active Staff",        value: d.totalStaff },
            { label: "Last Month Revenue",  value: `৳${d.lastMonthRev.toLocaleString()}` },
          ].map((r) => (
            <div key={r.label} className="flex justify-between py-1.5 border-b border-[#BFE01D]/15 last:border-0">
              <span className="text-[#9aa87a] text-xs uppercase tracking-[0.12em]">{r.label}</span>
              <span className="text-[#f2f4e8] text-xs font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4 — distributions */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Plan distribution */}
        <div className="border border-[#BFE01D]/15 panel p-6">
          <h2 className="label text-[#9aa87a] mb-5">Active Plan Distribution</h2>
          {d.planDist.length === 0 ? (
            <p className="text-[#9aa87a] text-xs">No active memberships.</p>
          ) : (
            <div className="space-y-3">
              {(() => {
                const total = d.planDist.reduce((s, x) => s + x._count.id, 0);
                return d.planDist.map((p) => {
                  const pct = total > 0 ? Math.round((p._count.id / total) * 100) : 0;
                  return (
                    <div key={p.planId}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#f2f4e8] text-xs">{d.planMap[p.planId] ?? "Unknown"}</span>
                        <span className="label text-[#9aa87a]">{p._count.id} · {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#BFE01D]/6 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACC }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* Payment methods */}
        <div className="border border-[#BFE01D]/15 panel p-6">
          <h2 className="label text-[#9aa87a] mb-5">Payment Methods</h2>
          {d.paymentMethodDist.length === 0 ? (
            <p className="text-[#9aa87a] text-xs">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {(() => {
                const total = d.paymentMethodDist.reduce((s, x) => s + x._count.id, 0);
                return d.paymentMethodDist.map((p) => {
                  const pct = total > 0 ? Math.round((p._count.id / total) * 100) : 0;
                  return (
                    <div key={p.method}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#f2f4e8] text-xs">{p.method.replace("_", " ")}</span>
                        <span className="label text-[#9aa87a]">{p._count.id} · {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#BFE01D]/6 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACC }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Row 5 — quick actions */}
      {quickActions.length > 0 && (
      <div className="border border-[#BFE01D]/15 panel p-5">
        <p className="label text-[#9aa87a] mb-4">Quick Actions</p>
        <Stagger className="flex flex-wrap gap-3" stagger={0.04}>
          {quickActions.map((a) => (
            <MagneticBox key={a.href}>
              <a href={a.href}
                className="inline-flex items-center border border-[#BFE01D]/15 panel hover:border-[#BFE01D] hover:text-[#BFE01D] text-[#9aa87a] text-xs uppercase tracking-[0.2em] px-5 py-2.5 transition-colors">
                {a.label}
              </a>
            </MagneticBox>
          ))}
        </Stagger>
      </div>
      )}

    </div>
  );
}
