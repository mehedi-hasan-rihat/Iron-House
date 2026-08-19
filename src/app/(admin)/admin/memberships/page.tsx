import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import Stagger from "@/components/motion/Stagger";

const ACC = "#BFE01D";
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  PENDING:   "text-yellow-400 bg-yellow-400/10",
  FROZEN:    "text-blue-400 bg-blue-400/10",
  EXPIRED:   "text-[#9aa87a] bg-[#BFE01D]/[0.06]",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default async function MembershipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireStaff();
  const sp     = await searchParams;
  const status = sp.status ?? "";
  const page   = Math.max(1, Number(sp.page ?? 1));
  const limit  = 20;

  const where = status ? { status: status as "ACTIVE" | "PENDING" | "FROZEN" | "EXPIRED" | "CANCELLED" } : {};

  const [memberships, total] = await Promise.all([
    prisma.membership.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: { member: true, plan: true, trainer: true },
    }),
    prisma.membership.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Memberships</h1>
          <p className="label text-[#9aa87a] mt-1">{total} total</p>
        </div>
        <Link href="/admin/memberships/new"
          className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          <Plus size={14} /> New Membership
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {["", "ACTIVE", "PENDING", "FROZEN", "EXPIRED", "CANCELLED"].map((s) => (
          <Link key={s}
            href={`?status=${s}`}
            className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors
              ${status === s
                ? "border-[#BFE01D] text-black font-bold"
                : "border-[#BFE01D]/15 text-[#9aa87a] hover:border-[#BFE01D]/50 hover:text-[#f2f4e8]"
              }`}
            style={status === s ? { backgroundColor: ACC } : {}}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-[#BFE01D]/15">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#BFE01D]/15 panel">
              {["#", "Member", "Plan", "Trainer", "Start", "End", "Amount", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <Stagger as="tbody" selector="tr" className="divide-y divide-[#BFE01D]/15"
          stagger={0.035} y={12} blur={false}>
            {memberships.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-[#9aa87a] text-xs">No memberships found.</td></tr>
            )}
            {memberships.map((m) => {
              const expired = new Date(m.endDate) < new Date();
              return (
                <tr key={m.id} className="bg-[#050505] hover:bg-[#0d0f08] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#9aa87a]">{m.membershipNumber}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/members/${m.memberId}`} className="text-[#f2f4e8] hover:text-[#BFE01D] transition-colors">
                      {m.member.fullName}
                    </Link>
                    <p className="label text-[#9aa87a]">{m.member.memberId}</p>
                  </td>
                  <td className="px-4 py-3 text-[#9aa87a]">{m.plan.name}</td>
                  <td className="px-4 py-3 text-[#9aa87a]">{m.trainer?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-[#9aa87a] whitespace-nowrap">{new Date(m.startDate).toLocaleDateString("en-BD")}</td>
                  <td className={`px-4 py-3 whitespace-nowrap ${expired && m.status === "ACTIVE" ? "text-red-400" : "text-[#9aa87a]"}`}>
                    {new Date(m.endDate).toLocaleDateString("en-BD")}
                  </td>
                  <td className="px-4 py-3 text-[#f2f4e8]">৳{Number(m.finalAmount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[m.status] ?? ""}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/memberships/${m.id}`}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#9aa87a] hover:text-[#f2f4e8] transition-colors">
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </Stagger>
        </table>
      </div>

      {/* Pagination */}
      {Math.ceil(total / limit) > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`?status=${status}&page=${p}`}
              className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors
                ${p === page ? "text-black font-bold border-[#BFE01D]" : "border-[#BFE01D]/15 text-[#9aa87a] hover:border-[#BFE01D]/50 hover:text-[#f2f4e8]"}`}
              style={p === page ? { backgroundColor: ACC } : {}}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
