import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Stagger from "@/components/motion/Stagger";
import CountUp from "@/components/motion/CountUp";

const ACC = "#BFE01D";

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where:   { userId: session.user.id },
    include: {
      memberships: {
        where:   { status: "ACTIVE" },
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take:    1,
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take:    3,
      },
    },
  });

  if (!member) redirect("/login");

  const active = member.memberships[0];
  const daysLeft = active
    ? Math.max(0, Math.ceil((new Date(active.endDate).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="label" style={{ color: ACC }}>Welcome back</p>
        <h1 className="font-display text-3xl md:text-4xl text-[#f2f4e8] uppercase tracking-wide mt-1">
          {member.fullName}
        </h1>
        <p className="label text-[#9aa87a] mt-1">{member.memberId}</p>
      </div>

      {/* Membership status card */}
      {active ? (
        <div className="border p-6 space-y-4" style={{ borderColor: ACC }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="label" style={{ color: ACC }}>Active Membership</p>
              <h2 className="font-display text-2xl text-[#f2f4e8] uppercase mt-1">{active.plan.name}</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm text-[#BFE01D] bg-[#BFE01D]/10">
              Active
            </span>
          </div>
          <Stagger className="grid grid-cols-3 gap-4 pt-2 border-t border-[#BFE01D]/15" stagger={0.08}>
            <div>
              <p className="label text-[#9aa87a]">Days Left</p>
              <p className="font-display text-3xl text-[#f2f4e8]"><CountUp value={daysLeft} separator={false} /></p>
            </div>
            <div>
              <p className="label text-[#9aa87a]">Renews</p>
              <p className="text-[#f2f4e8] text-sm mt-1">{new Date(active.endDate).toLocaleDateString("en-BD")}</p>
            </div>
            <div>
              <p className="label text-[#9aa87a]">Plan</p>
              <p className="text-[#f2f4e8] text-sm mt-1">{active.plan.durationDays}d</p>
            </div>
          </Stagger>
          {daysLeft <= 7 && daysLeft > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 px-4 py-3 text-orange-300 text-xs">
              ⚠️ Your membership expires in {daysLeft} day{daysLeft === 1 ? "" : "s"}. Contact the gym to renew.
            </div>
          )}
        </div>
      ) : (
        <div className="border border-[#BFE01D]/15 panel p-6 text-center space-y-3">
          <p className="text-[#9aa87a]">No active membership</p>
          <p className="text-xs text-[#9aa87a]">Contact the gym to get started.</p>
        </div>
      )}

      {/* Recent payments */}
      <div className="panel border border-[#BFE01D]/15 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="label text-[#9aa87a]">Recent Payments</h3>
          <Link href="/payments" className="text-[10px] uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors"
            style={{ color: ACC }}>View all →</Link>
        </div>
        {member.payments.length === 0
          ? <p className="text-[#9aa87a] text-xs">No payments yet.</p>
          : member.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#BFE01D]/15 last:border-0">
              <div>
                <p className="font-mono text-xs text-[#f2f4e8]">{p.invoiceNumber}</p>
                <p className="label text-[#9aa87a]">{p.method} · {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-BD") : "—"}</p>
              </div>
              <p className="text-[#f2f4e8] text-sm">৳{Number(p.totalAmount).toLocaleString()}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
