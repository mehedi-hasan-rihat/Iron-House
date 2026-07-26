import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { Users, TrendingUp, AlertCircle, DollarSign, Calendar, UserPlus, Clock } from "lucide-react";

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
  label, value, icon: Icon, accent = false, warning = false,
}: {
  label: string; value: string | number;
  icon: React.ElementType; accent?: boolean; warning?: boolean;
}) {
  return (
    <div className={`
      border p-5 bg-[#0b0b0b] flex items-start justify-between
      ${accent  ? "border-[#BFE01D]"   : ""}
      ${warning ? "border-orange-500/40" : ""}
      ${!accent && !warning ? "border-[#1a1a1a]" : ""}
    `}>
      <div>
        <p className="label text-[#bdbdbd] mb-2">{label}</p>
        <p className="font-display text-3xl md:text-4xl text-white leading-none">{value}</p>
      </div>
      <div className={`
        h-9 w-9 rounded-sm flex items-center justify-center
        ${accent  ? "bg-[#BFE01D]/10"     : ""}
        ${warning ? "bg-orange-500/10"     : ""}
        ${!accent && !warning ? "bg-white/5" : ""}
      `}>
        <Icon
          size={18}
          style={{ color: accent ? ACC : warning ? "#f97316" : "#bdbdbd" }}
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
        <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide">Dashboard</h1>
        <p className="label text-[#bdbdbd] mt-1">Welcome back · {new Date().toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Members */}
      <section>
        <p className="label text-[#bdbdbd] mb-4">Members</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total Members"      value={s.totalMembers}       icon={Users}      accent />
          <StatCard label="Active"             value={s.activeMembers}      icon={TrendingUp} />
          <StatCard label="Inactive / Frozen"  value={s.inactiveMembers}    icon={AlertCircle} warning={s.inactiveMembers > 0} />
          <StatCard label="Expired Memberships" value={s.expiredMemberships} icon={Clock}      warning={s.expiredMemberships > 0} />
        </div>
      </section>

      {/* Expiring */}
      <section>
        <p className="label text-[#bdbdbd] mb-4">Expiring</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Expiring Today"     value={s.expiringToday}     icon={AlertCircle} warning={s.expiringToday > 0} />
          <StatCard label="Expiring This Week" value={s.expiringThisWeek}  icon={Calendar}    warning={s.expiringThisWeek > 0} />
          <StatCard label="New This Month"     value={s.newThisMonth}      icon={UserPlus}    accent={s.newThisMonth > 0} />
        </div>
      </section>

      {/* Revenue */}
      <section>
        <p className="label text-[#bdbdbd] mb-4">Revenue</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Today's Revenue"  value={`৳${s.todayRevenue.toLocaleString()}`}  icon={DollarSign} accent />
          <StatCard label="Monthly Revenue"  value={`৳${s.monthRevenue.toLocaleString()}`}  icon={TrendingUp} />
          <StatCard label="Pending Payments" value={s.pendingPayments} icon={Clock}      warning={s.pendingPayments > 0} />
          <StatCard label="Failed Payments"  value={s.failedPayments}  icon={AlertCircle} warning={s.failedPayments > 0} />
        </div>
      </section>

      {/* Staff */}
      <section>
        <p className="label text-[#bdbdbd] mb-4">Staff</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Active Staff" value={s.totalStaff} icon={UserPlus} />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <p className="label text-[#bdbdbd] mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Member",          href: "/admin/members/new"     },
            { label: "Record Payment",       href: "/admin/payments/new"    },
            { label: "Create Membership",    href: "/admin/memberships/new" },
            { label: "Add Staff",            href: "/admin/staff/new"       },
            { label: "Create Plan",          href: "/admin/plans/new"       },
          ].map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#0b0b0b] hover:border-[#BFE01D] hover:text-[#BFE01D] text-[#bdbdbd] text-xs uppercase tracking-[0.2em] px-5 py-3 transition-colors"
            >
              {a.label}
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
