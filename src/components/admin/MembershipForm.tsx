"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";
const METHODS = ["CASH","CARD","BKASH","NAGAD","ROCKET","BANK_TRANSFER"];

type Member = { id: string; memberId: string; fullName: string };
type Plan   = { id: string; name: string; price: number; durationDays: number };
type Staff  = { id: string; name: string };

export default function MembershipForm({
  members, plans, trainers, defaultMemberId = "",
}: {
  members: Member[]; plans: Plan[]; trainers: Staff[]; defaultMemberId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    memberId:      defaultMemberId,
    planId:        plans[0]?.id ?? "",
    trainerId:     "",
    startDate:     new Date().toISOString().split("T")[0],
    amount:        plans[0]?.price ?? 0,
    discount:      0,
    tax:           0,
    paymentMethod: "CASH",
    recordPayment: true,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // auto-fill price when plan changes
  useEffect(() => {
    const plan = plans.find((p) => p.id === form.planId);
    if (plan) setForm((f) => ({ ...f, amount: plan.price }));
  }, [form.planId, plans]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const final = Math.max(0, Number(form.amount) - Number(form.discount) + Number(form.tax));
  const selectedPlan = plans.find((p) => p.id === form.planId);
  const endDate = (() => {
    if (!form.startDate || !selectedPlan) return "";
    const d = new Date(form.startDate);
    d.setDate(d.getDate() + selectedPlan.durationDays);
    return d.toLocaleDateString("en-BD");
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/memberships", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...form,
        paymentMethod: form.recordPayment ? form.paymentMethod : undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    const ms = await res.json();
    router.push(`/admin/memberships/${ms.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-5">
        <h2 className="label text-[#bdbdbd]">Membership Details</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Member *">
            <select required value={form.memberId} onChange={set("memberId")} className={cls}>
              <option value="">Select member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.fullName} ({m.memberId})</option>
              ))}
            </select>
          </Field>
          <Field label="Plan *">
            <select required value={form.planId} onChange={set("planId")} className={cls}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ৳{Number(p.price).toLocaleString()}</option>
              ))}
            </select>
          </Field>
          <Field label="Trainer">
            <select value={form.trainerId} onChange={set("trainerId")} className={cls}>
              <option value="">No trainer</option>
              {trainers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Start Date *">
            <input type="date" required value={form.startDate} onChange={set("startDate")} className={cls} />
          </Field>
        </div>

        {endDate && (
          <p className="label text-[#bdbdbd]">
            End date: <span style={{ color: ACC }}>{endDate}</span>
            {selectedPlan && ` · ${selectedPlan.durationDays} days`}
          </p>
        )}
      </div>

      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-5">
        <h2 className="label text-[#bdbdbd]">Pricing</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Amount (৳) *">
            <input type="number" min={0} value={form.amount} onChange={set("amount")} className={cls} />
          </Field>
          <Field label="Discount (৳)">
            <input type="number" min={0} value={form.discount} onChange={set("discount")} className={cls} />
          </Field>
          <Field label="Tax (৳)">
            <input type="number" min={0} value={form.tax} onChange={set("tax")} className={cls} />
          </Field>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="label text-[#bdbdbd]">Total:</span>
          <span className="font-display text-2xl" style={{ color: ACC }}>৳{final.toLocaleString()}</span>
        </div>
      </div>

      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.recordPayment}
            onChange={set("recordPayment")} className="accent-[#BFE01D] w-4 h-4" />
          <span className="label text-[#bdbdbd]">Record payment now</span>
        </label>
        {form.recordPayment && (
          <Field label="Payment Method">
            <select value={form.paymentMethod} onChange={set("paymentMethod")} className={cls}>
              {METHODS.map((m) => <option key={m} value={m}>{m.replace("_", " ")}</option>)}
            </select>
          </Field>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          {loading ? "Creating…" : "Create Membership"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-[#bdbdbd] text-xs uppercase tracking-[0.2em] hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#bdbdbd] mb-2">{label}</label>
      {children}
    </div>
  );
}
const cls = "w-full bg-[#050505] border border-[#1a1a1a] text-white text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";
