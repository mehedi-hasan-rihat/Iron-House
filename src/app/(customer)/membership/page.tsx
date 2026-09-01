import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const ACC = "#BFE01D";
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  FROZEN:    "text-blue-400 bg-blue-400/10",
  EXPIRED:   "text-[#9aa87a] bg-[#BFE01D]/[0.06]",
  CANCELLED: "text-red-400 bg-red-400/10",
  PENDING:   "text-yellow-400 bg-yellow-400/10",
};

export default async function CustomerMembershipPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where:   { userId: session.user.id },
    include: {
      memberships: {
        include: { plan: true, trainer: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!member) redirect("/login");

  const active = member.memberships.find((m) => m.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Membership</h1>
        <p className="label text-[#9aa87a] mt-1">{member.memberships.length} total memberships</p>
      </div>

      {/* Active */}
      {active && (
        <div className="border p-6 space-y-4" style={{ borderColor: ACC }}>
          <p className="label" style={{ color: ACC }}>Current Membership</p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Plan",       value: active.plan.name },
              { label: "Trainer",    value: active.trainer?.name },
              { label: "Start",      value: new Date(active.startDate).toLocaleDateString("en-BD") },
              { label: "End",        value: new Date(active.endDate).toLocaleDateString("en-BD") },
              { label: "Duration",   value: `${active.plan.durationDays} days` },
              { label: "Amount Paid",value: `৳${Number(active.finalAmount).toLocaleString()}` },
            ].filter((r) => r.value).map(({ label, value }) => (
              <div key={label}>
                <p className="label text-[#9aa87a]">{label}</p>
                <p className="text-[#f2f4e8] mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#BFE01D]/15">
            <p className="text-[#9aa87a] text-xs">
              To freeze, renew, or cancel your membership, please contact the gym reception.
            </p>
          </div>
        </div>
      )}

      {/* History */}
      <div className="border border-[#BFE01D]/15 panel p-5">
        <h3 className="label text-[#9aa87a] mb-4">Membership History</h3>
        {member.memberships.length === 0
          ? <p className="text-[#9aa87a] text-xs">No memberships yet.</p>
          : (
            <div className="space-y-3">
              {member.memberships.map((ms) => (
                <div key={ms.id} className="flex items-start justify-between py-3 border-b border-[#BFE01D]/15 last:border-0">
                  <div>
                    <p className="text-[#f2f4e8] text-sm font-medium">{ms.plan.name}</p>
                    <p className="label text-[#9aa87a] mt-0.5">
                      {new Date(ms.startDate).toLocaleDateString("en-BD")} – {new Date(ms.endDate).toLocaleDateString("en-BD")}
                    </p>
                    <p className="label text-[#9aa87a]">৳{Number(ms.finalAmount).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[ms.status] ?? ""}`}>
                    {ms.status}
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
