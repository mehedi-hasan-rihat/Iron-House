import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, CreditCard, ArrowLeft } from "lucide-react";

const ACC = "#BFE01D";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  SUSPENDED: "text-orange-400 bg-orange-400/10",
  FROZEN:    "text-blue-400 bg-blue-400/10",
};

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where:   { id },
    include: {
      memberships: {
        include:  { plan: true, trainer: true },
        orderBy:  { createdAt: "desc" },
      },
      payments: { orderBy: { createdAt: "desc" }, take: 10 },
      notes:    { orderBy: { createdAt: "desc" } },
    },
  });

  if (!member) notFound();

  const activeMembership = member.memberships.find((m) => m.status === "ACTIVE");

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back */}
      <Link href="/admin/members" className="inline-flex items-center gap-2 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Members
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">{member.fullName}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[member.status] ?? ""}`}>
              {member.status}
            </span>
          </div>
          <p className="label text-[#9aa87a] mt-1">{member.memberId}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/members/${id}/edit`}
            className="inline-flex items-center gap-2 border border-[#BFE01D]/15 text-[#9aa87a] hover:border-[#BFE01D]/50 hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] px-4 py-2.5 transition-colors">
            <Edit size={13} /> Edit
          </Link>
          <Link href={`/admin/memberships/new?memberId=${id}`}
            className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-4 py-2.5 hover:opacity-85 transition-opacity"
            style={{ backgroundColor: ACC }}>
            <CreditCard size={13} /> New Membership
          </Link>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Personal Details">
          <Row label="Phone"    value={member.phone} />
          <Row label="Email"    value={member.email} />
          <Row label="Gender"   value={member.gender} />
          <Row label="DOB"      value={member.dob ? new Date(member.dob).toLocaleDateString("en-BD") : null} />
          <Row label="Blood"    value={member.bloodGroup} />
          <Row label="Address"  value={member.address} />
        </InfoCard>

        <InfoCard title="Emergency & Medical">
          <Row label="Emergency Contact" value={member.emergencyContact} />
          <Row label="Medical Info"      value={member.medicalInfo} />
        </InfoCard>
      </div>

      {/* Active membership */}
      {activeMembership && (
        <InfoCard title="Active Membership">
          <Row label="Plan"    value={activeMembership.plan.name} />
          <Row label="Trainer" value={activeMembership.trainer?.name} />
          <Row label="Starts"  value={new Date(activeMembership.startDate).toLocaleDateString("en-BD")} />
          <Row label="Expires" value={new Date(activeMembership.endDate).toLocaleDateString("en-BD")} />
          <Row label="Amount"  value={`৳${Number(activeMembership.finalAmount).toLocaleString()}`} />
        </InfoCard>
      )}

      {/* Membership history */}
      <InfoCard title={`Membership History (${member.memberships.length})`}>
        {member.memberships.length === 0 ? (
          <p className="text-[#9aa87a] text-xs">No memberships yet.</p>
        ) : (
          <div className="space-y-2">
            {member.memberships.map((ms) => (
              <div key={ms.id} className="flex items-center justify-between py-2 border-b border-[#BFE01D]/15 last:border-0">
                <div>
                  <p className="text-[#f2f4e8] text-sm">{ms.plan.name}</p>
                  <p className="label text-[#9aa87a]">
                    {new Date(ms.startDate).toLocaleDateString("en-BD")} – {new Date(ms.endDate).toLocaleDateString("en-BD")}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[ms.status] ?? "text-[#9aa87a]"}`}>
                  {ms.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </InfoCard>

      {/* Recent payments */}
      <InfoCard title={`Recent Payments (${member.payments.length})`}>
        {member.payments.length === 0 ? (
          <p className="text-[#9aa87a] text-xs">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {member.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#BFE01D]/15 last:border-0">
                <div>
                  <p className="text-[#f2f4e8] text-sm font-mono">{p.invoiceNumber}</p>
                  <p className="label text-[#9aa87a]">{p.method} · {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-BD") : "—"}</p>
                </div>
                <p className="text-[#f2f4e8] text-sm">৳{Number(p.totalAmount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </InfoCard>

    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#BFE01D]/15 panel p-5">
      <h3 className="label text-[#9aa87a] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-[#BFE01D]/15 last:border-0">
      <span className="text-[#9aa87a] text-xs uppercase tracking-[0.15em]">{label}</span>
      <span className="text-[#f2f4e8] text-xs text-right max-w-[60%]">{value}</span>
    </div>
  );
}
