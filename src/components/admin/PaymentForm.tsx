"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";
const METHODS = ["CASH","CARD","BKASH","NAGAD","ROCKET","BANK_TRANSFER"];

type Member = { id: string; memberId: string; fullName: string };

export default function PaymentForm({
  members, defaultMemberId = "", defaultMembershipId = "",
}: {
  members: Member[]; defaultMemberId?: string; defaultMembershipId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    memberId:      defaultMemberId,
    membershipId:  defaultMembershipId,
    amount:        "",
    discount:      "0",
    tax:           "0",
    method:        "CASH",
    transactionId: "",
    paymentDate:   new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const total = Math.max(0, Number(form.amount) - Number(form.discount) + Number(form.tax));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/payments", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    const p = await res.json();
    router.push(`/admin/payments/${p.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#BFE01D]/15 panel p-6 space-y-5">
        <h2 className="label text-[#9aa87a]">Payment Details</h2>

        <Field label="Member *">
          <select required value={form.memberId} onChange={set("memberId")} className={cls}>
            <option value="">Select member…</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.fullName} ({m.memberId})</option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Amount (৳) *">
            <input type="number" required min={0} value={form.amount} onChange={set("amount")} className={cls} placeholder="1500" />
          </Field>
          <Field label="Discount (৳)">
            <input type="number" min={0} value={form.discount} onChange={set("discount")} className={cls} />
          </Field>
          <Field label="Tax (৳)">
            <input type="number" min={0} value={form.tax} onChange={set("tax")} className={cls} />
          </Field>
        </div>

        {form.amount && (
          <p className="label text-[#9aa87a]">
            Total: <span className="font-display text-xl" style={{ color: ACC }}>৳{total.toLocaleString()}</span>
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Payment Method *">
            <select required value={form.method} onChange={set("method")} className={cls}>
              {METHODS.map((m) => <option key={m} value={m}>{m.replace("_", " ")}</option>)}
            </select>
          </Field>
          <Field label="Payment Date *">
            <input type="date" required value={form.paymentDate} onChange={set("paymentDate")} className={cls} />
          </Field>
        </div>

        <Field label="Transaction ID (optional)">
          <input value={form.transactionId} onChange={set("transactionId")} className={cls} placeholder="bKash/Nagad ref…" />
        </Field>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          {loading ? "Saving…" : "Record Payment"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">{label}</label>
      {children}
    </div>
  );
}
const cls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";
