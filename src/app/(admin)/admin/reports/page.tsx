import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

const ACC = "#BFE01D";

async function getReportData() {
  const now        = new Date();
  const thisMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // last 6 months revenue
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { label: d.toLocaleString("en-BD", { month: "short", year: "2-digit" }), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 0) };
  });

  const revenueByMonth = await Promise.all(
    months.map((m) =>
      prisma.payment.aggregate({
        where: { status: "PAID", paymentDate: { gte: m.start, lte: m.end } },
        _sum: { totalAmount: true },
      }).then((r) => ({ label: m.label, revenue: Number(r._sum.totalAmount ?? 0) }))
    )
  );

  const [
    thisMonthRevenue,
    lastMonthRevenue,
    thisMonthMembers,
    totalMembers,
    planDist,
    paymentMethodDist,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: thisMonth } },
      _sum: { totalAmount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: lastMonth, lte: lastMonthEnd } },
      _sum: { totalAmount: true },
    }),
    prisma.member.count({ where: { createdAt: { gte: thisMonth } } }),
    prisma.member.count(),
    prisma.membership.groupBy({ by: ["planId"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5,
      where: { status: "ACTIVE" } }),
    prisma.payment.groupBy({ by: ["method"], _count: { id: true }, where: { status: "PAID" } }),
  ]);

  // get plan names
  const planIds = planDist.map((p) => p.planId);
  const plans   = await prisma.membershipPlan.findMany({ where: { id: { in: planIds } } });
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.name]));

  const thisMonthRev  = Number(thisMonthRevenue._sum.totalAmount  ?? 0);
  const lastMonthRev  = Number(lastMonthRevenue._sum.totalAmount  ?? 0);
  const revGrowth     = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1) : "—";

  return { revenueByMonth, thisMonthRev, lastMonthRev, revGrowth, thisMonthMembers, totalMembers, planDist, planMap, paymentMethodDist };
}

export default async function ReportsPage() {
  await requireStaff();
  const d = await getReportData();

  const maxRev = Math.max(...d.revenueByMonth.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Reports</h1>
        <p className="label text-[#9aa87a] mt-1">Business overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "This Month Revenue", value: `৳${d.thisMonthRev.toLocaleString()}` },
          { label: "Last Month Revenue", value: `৳${d.lastMonthRev.toLocaleString()}` },
          { label: "Revenue Growth",     value: d.revGrowth === "—" ? "—" : `${d.revGrowth}%` },
          { label: "New Members (Month)",value: d.thisMonthMembers },
        ].map((k) => (
          <div key={k.label} className="border border-[#BFE01D]/15 panel p-5">
            <p className="label text-[#9aa87a] mb-2">{k.label}</p>
            <p className="font-display text-3xl text-[#f2f4e8]">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="border border-[#BFE01D]/15 panel p-6">
        <h2 className="label text-[#9aa87a] mb-6">Revenue — Last 6 Months</h2>
        <div className="flex items-end gap-3 h-40">
          {d.revenueByMonth.map((m) => {
            const h = maxRev > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[9px] text-[#9aa87a]">{m.revenue > 0 ? `৳${(m.revenue/1000).toFixed(0)}k` : ""}</span>
                <div className="w-full rounded-t-sm transition-all duration-500"
                  style={{ height: `${Math.max(h, 2)}%`, backgroundColor: ACC, opacity: h === 100 ? 1 : 0.5 + h / 200 }} />
                <span className="label text-[#9aa87a] text-[9px]">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan distribution */}
        <div className="border border-[#BFE01D]/15 panel p-6">
          <h2 className="label text-[#9aa87a] mb-5">Active Plans Distribution</h2>
          <div className="space-y-3">
            {d.planDist.map((p) => {
              const total = d.planDist.reduce((s, x) => s + x._count.id, 0);
              const pct   = total > 0 ? Math.round((p._count.id / total) * 100) : 0;
              return (
                <div key={p.planId}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#f2f4e8] text-xs">{d.planMap[p.planId] ?? "Unknown"}</span>
                    <span className="label text-[#9aa87a]">{p._count.id} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#BFE01D]/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACC }} />
                  </div>
                </div>
              );
            })}
            {d.planDist.length === 0 && <p className="text-[#9aa87a] text-xs">No active memberships.</p>}
          </div>
        </div>

        {/* Payment method distribution */}
        <div className="border border-[#BFE01D]/15 panel p-6">
          <h2 className="label text-[#9aa87a] mb-5">Payment Methods</h2>
          <div className="space-y-3">
            {d.paymentMethodDist.map((p) => {
              const total = d.paymentMethodDist.reduce((s, x) => s + x._count.id, 0);
              const pct   = total > 0 ? Math.round((p._count.id / total) * 100) : 0;
              return (
                <div key={p.method}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#f2f4e8] text-xs">{p.method.replace("_", " ")}</span>
                    <span className="label text-[#9aa87a]">{p._count.id} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#BFE01D]/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACC }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
