import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  PAID:      "text-[#BFE01D] bg-[#BFE01D]/10",
  PENDING:   "text-yellow-400 bg-yellow-400/10",
  FAILED:    "text-red-400 bg-red-400/10",
  REFUNDED:  "text-blue-400 bg-blue-400/10",
  CANCELLED: "text-[#9aa87a] bg-[#BFE01D]/[0.06]",
};

export default async function CustomerPaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where:   { userId: session.user.id },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        include: { membership: { include: { plan: true } } },
      },
    },
  });

  if (!member) redirect("/login");

  const totalPaid = member.payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Payments</h1>
        <p className="label text-[#9aa87a] mt-1">
          {member.payments.length} records · Total paid: <span style={{ color: "#BFE01D" }}>৳{totalPaid.toLocaleString()}</span>
        </p>
      </div>

      <div className="border border-[#BFE01D]/15 panel">
        {member.payments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#9aa87a] text-sm">No payment history yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#BFE01D]/15">
            {member.payments.map((p) => (
              <div key={p.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-[#f2f4e8]">{p.invoiceNumber}</p>
                  <p className="text-[#f2f4e8] text-sm">{p.membership?.plan.name ?? "General Payment"}</p>
                  <p className="label text-[#9aa87a]">
                    {p.method.replace("_", " ")}
                    {p.transactionId && ` · ${p.transactionId}`}
                    {p.paymentDate && ` · ${new Date(p.paymentDate).toLocaleDateString("en-BD")}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-display text-xl text-[#f2f4e8]">৳{Number(p.totalAmount).toLocaleString()}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[p.status] ?? ""}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
