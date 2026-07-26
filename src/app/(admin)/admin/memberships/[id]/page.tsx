import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MembershipActions from "@/components/admin/MembershipActions";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  PENDING:   "text-yellow-400 bg-yellow-400/10",
  FROZEN:    "text-blue-400 bg-blue-400/10",
  EXPIRED:   "text-[#bdbdbd] bg-white/5",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const ms = await prisma.membership.findUnique({
    where:   { id },
    include: {
      member:   true,
      plan:     true,
      trainer:  true,
      timeline: { orderBy: { createdAt: "asc" } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!ms) notFound();

  const isExpired = new Date(ms.endDate) < new Date();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/memberships"
        className="inline-flex items-center gap-2 text-[#bdbdbd] hover:text-white text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Memberships
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-white uppercase tracking-wide">{ms.membershipNumber}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[ms.status] ?? ""}`}>
              {ms.status}
            </span>
          </div>
          <Link href={`/admin/members/${ms.memberId}`}
            className="label text-[#BFE01D] mt-1 hover:underline">
            {ms.member.fullName} · {ms.member.memberId}
          </Link>
        </div>
        <MembershipActions membershipId={ms.id} currentStatus={ms.status} planName={ms.plan.name} />
      </div>

      {/* Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Membership Details">
          <Row label="Plan"      value={ms.plan.name} />
          <Row label="Trainer"   value={ms.trainer?.name} />
          <Row label="Start"     value={new Date(ms.startDate).toLocaleDateString("en-BD")} />
          <Row label="End"       value={new Date(ms.endDate).toLocaleDateString("en-BD")}
            valueClass={isExpired && ms.status === "ACTIVE" ? "text-red-400" : undefined} />
          <Row label="Duration"  value={`${ms.plan.durationDays} days`} />
        </InfoCard>

        <InfoCard title="Financials">
          <Row label="Amount"       value={`৳${Number(ms.amount).toLocaleString()}`} />
          <Row label="Discount"     value={`৳${Number(ms.discount).toLocaleString()}`} />
          <Row label="Tax"          value={`৳${Number(ms.tax).toLocaleString()}`} />
          <Row label="Total Paid"   value={`৳${Number(ms.finalAmount).toLocaleString()}`} accent />
        </InfoCard>
      </div>

      {/* Payments */}
      <InfoCard title={`Payments (${ms.payments.length})`}>
        {ms.payments.length === 0
          ? <p className="text-[#bdbdbd] text-xs">No payments recorded.</p>
          : ms.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
              <div>
                <Link href={`/admin/payments/${p.id}`}
                  className="font-mono text-xs text-[#BFE01D] hover:underline">{p.invoiceNumber}</Link>
                <p className="label text-[#bdbdbd]">{p.method} · {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-BD") : "—"}</p>
              </div>
              <p className="text-white text-sm">৳{Number(p.totalAmount).toLocaleString()}</p>
            </div>
          ))
        }
      </InfoCard>

      {/* Timeline */}
      <InfoCard title="Timeline">
        <div className="space-y-3">
          {ms.timeline.map((t) => (
            <div key={t.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-2 w-2 rounded-full mt-1" style={{ backgroundColor: "#BFE01D" }} />
                <div className="flex-1 w-px bg-[#1a1a1a]" />
              </div>
              <div className="pb-3">
                <p className="text-white text-xs uppercase tracking-[0.15em] font-medium">{t.event}</p>
                <p className="label text-[#bdbdbd]">{new Date(t.createdAt).toLocaleString("en-BD")}</p>
                {t.note && <p className="text-[#bdbdbd] text-xs mt-0.5">{t.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-5">
      <h3 className="label text-[#bdbdbd] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value, accent, valueClass }: { label: string; value?: string | null; accent?: boolean; valueClass?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-[#1a1a1a] last:border-0">
      <span className="text-[#bdbdbd] text-xs uppercase tracking-[0.15em]">{label}</span>
      <span className={`text-xs ${accent ? "font-bold" : ""} ${valueClass ?? "text-white"}`}
        style={accent ? { color: "#BFE01D" } : undefined}>{value}</span>
    </div>
  );
}
