import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RefundButton from "@/components/admin/RefundButton";

const ACC = "#BFE01D";
const STATUS_COLORS: Record<string, string> = {
  PAID:      "text-[#BFE01D] bg-[#BFE01D]/10",
  PENDING:   "text-yellow-400 bg-yellow-400/10",
  FAILED:    "text-red-400 bg-red-400/10",
  REFUNDED:  "text-blue-400 bg-blue-400/10",
  CANCELLED: "text-[#9aa87a] bg-[#BFE01D]/[0.06]",
};

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where:   { id },
    include: {
      member:     { select: { fullName: true, memberId: true, phone: true, id: true } },
      membership: { include: { plan: true } },
      attempts:   { orderBy: { attemptAt: "desc" } },
    },
  });

  if (!payment) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/payments"
        className="inline-flex items-center gap-2 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Payments
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-[#f2f4e8] uppercase">{payment.invoiceNumber}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[payment.status] ?? ""}`}>
              {payment.status}
            </span>
          </div>
          <Link href={`/admin/members/${payment.member.id}`}
            className="label mt-1 hover:underline" style={{ color: ACC }}>
            {payment.member.fullName} · {payment.member.memberId}
          </Link>
        </div>
        {payment.status === "PAID" && <RefundButton paymentId={payment.id} />}
      </div>

      {/* Details */}
      <div className="border border-[#BFE01D]/15 panel p-5 space-y-0">
        <h3 className="label text-[#9aa87a] mb-4">Payment Details</h3>
        {[
          { label: "Invoice",        value: payment.invoiceNumber },
          { label: "Transaction ID", value: payment.transactionId },
          { label: "Method",         value: payment.method.replace("_", " ") },
          { label: "Date",           value: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-BD") : null },
          { label: "Plan",           value: payment.membership?.plan.name },
          { label: "Amount",         value: `৳${Number(payment.amount).toLocaleString()}` },
          { label: "Discount",       value: Number(payment.discount) > 0 ? `৳${Number(payment.discount).toLocaleString()}` : null },
          { label: "Tax",            value: Number(payment.tax) > 0 ? `৳${Number(payment.tax).toLocaleString()}` : null },
          { label: "Total",          value: `৳${Number(payment.totalAmount).toLocaleString()}`, accent: true },
        ].map(({ label, value, accent }) => value ? (
          <div key={label} className="flex justify-between py-2 border-b border-[#BFE01D]/15 last:border-0">
            <span className="text-[#9aa87a] text-xs uppercase tracking-[0.15em]">{label}</span>
            <span className={`text-xs ${accent ? "font-bold" : "text-[#f2f4e8]"}`}
              style={accent ? { color: ACC } : undefined}>{value}</span>
          </div>
        ) : null)}
      </div>

      {/* Attempts */}
      {payment.attempts.length > 0 && (
        <div className="border border-[#BFE01D]/15 panel p-5">
          <h3 className="label text-[#9aa87a] mb-4">Attempt History</h3>
          <div className="space-y-2">
            {payment.attempts.map((a) => (
              <div key={a.id} className="py-2 border-b border-[#BFE01D]/15 last:border-0">
                <div className="flex justify-between">
                  <span className="text-[#f2f4e8] text-xs uppercase">{a.status}</span>
                  <span className="label text-[#9aa87a]">{new Date(a.attemptAt).toLocaleString("en-BD")}</span>
                </div>
                {a.failureReason && <p className="text-red-400 text-xs mt-1">{a.failureReason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
