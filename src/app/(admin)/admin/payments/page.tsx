import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

const ACC = "#BFE01D";
const STATUS_COLORS: Record<string, string> = {
  PAID:       "text-[#BFE01D] bg-[#BFE01D]/10",
  PENDING:    "text-yellow-400 bg-yellow-400/10",
  FAILED:     "text-red-400 bg-red-400/10",
  CANCELLED:  "text-[#bdbdbd] bg-white/5",
  REFUNDED:   "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-orange-400 bg-orange-400/10",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; method?: string; page?: string }>;
}) {
  await requireStaff();
  const sp     = await searchParams;
  const status = sp.status ?? "";
  const method = sp.method ?? "";
  const page   = Math.max(1, Number(sp.page ?? 1));
  const limit  = 20;

  const where = {
    ...(status ? { status: status as "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED" } : {}),
    ...(method ? { method: method as "CASH" | "CARD" | "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" } : {}),
  };

  const [payments, total, monthRevenue] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: { member: { select: { fullName: true, memberId: true } } },
    }),
    prisma.payment.count({ where }),
    prisma.payment.aggregate({
      where: { status: "PAID", paymentDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { totalAmount: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-wide">Payments</h1>
          <p className="label text-[#bdbdbd] mt-1">
            {total} records · Monthly: <span style={{ color: ACC }}>৳{Number(monthRevenue._sum.totalAmount ?? 0).toLocaleString()}</span>
          </p>
        </div>
        <Link href="/admin/payments/new"
          className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          <Plus size={14} /> Record Payment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "PAID", "PENDING", "FAILED", "CANCELLED", "REFUNDED"].map((s) => (
          <Link key={s} href={`?status=${s}&method=${method}`}
            className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors
              ${status === s ? "border-[#BFE01D] text-black font-bold" : "border-[#1a1a1a] text-[#bdbdbd] hover:border-white hover:text-white"}`}
            style={status === s ? { backgroundColor: ACC } : {}}>
            {s || "All Status"}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-[#0b0b0b]">
              {["Invoice", "Member", "Amount", "Method", "Date", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 label text-[#bdbdbd] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {payments.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#bdbdbd] text-xs">No payments found.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="bg-[#050505] hover:bg-[#0b0b0b] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#bdbdbd]">{p.invoiceNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-white">{p.member.fullName}</p>
                  <p className="label text-[#bdbdbd]">{p.member.memberId}</p>
                </td>
                <td className="px-4 py-3 text-white font-medium">৳{Number(p.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3 text-[#bdbdbd]">{p.method.replace("_", " ")}</td>
                <td className="px-4 py-3 text-[#bdbdbd] whitespace-nowrap">
                  {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-BD") : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[p.status] ?? ""}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/payments/${p.id}`}
                    className="text-[10px] uppercase tracking-[0.15em] text-[#bdbdbd] hover:text-white transition-colors">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
