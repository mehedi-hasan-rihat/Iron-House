"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";
const PLAN_TYPES = [
  "DAILY","WEEKLY","MONTHLY","QUARTERLY",
  "HALF_YEARLY","YEARLY","PERSONAL_TRAINING","TRIAL","DAY_PASS",
];

type Props = {
  defaultValues?: {
    id?: string; name?: string; description?: string;
    durationDays?: number; price?: number; type?: string;
    isActive?: boolean; trialEnabled?: boolean; autoRenewal?: boolean;
    features?: Record<string, boolean>;
  };
  mode?: "create" | "edit";
};

export default function PlanForm({ defaultValues = {}, mode = "create" }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:         defaultValues.name         ?? "",
    description:  defaultValues.description  ?? "",
    durationDays: defaultValues.durationDays ?? 30,
    price:        defaultValues.price        ?? 0,
    type:         defaultValues.type         ?? "MONTHLY",
    isActive:     defaultValues.isActive     ?? true,
    trialEnabled: defaultValues.trialEnabled ?? false,
    autoRenewal:  defaultValues.autoRenewal  ?? false,
    features: {
      gymAccess:      defaultValues.features?.gymAccess      ?? true,
      groupClasses:   defaultValues.features?.groupClasses   ?? false,
      personalTrainer: defaultValues.features?.personalTrainer ?? false,
      locker:         defaultValues.features?.locker         ?? false,
      dietConsult:    defaultValues.features?.dietConsult    ?? false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const setFeature = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, features: { ...f.features, [k]: e.target.checked } }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    const url    = mode === "edit" ? `/api/plans/${defaultValues.id}` : "/api/plans";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...form, durationDays: Number(form.durationDays), price: Number(form.price) }),
    });

    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    router.push("/admin/plans");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#BFE01D]/15 panel p-6 space-y-5">
        <h2 className="label text-[#9aa87a]">Plan Details</h2>

        <Field label="Plan Name *">
          <input required value={form.name} onChange={set("name")} className={inputCls} placeholder="Monthly Premium" />
        </Field>
        <Field label="Description">
          <input value={form.description} onChange={set("description")} className={inputCls} placeholder="Short description" />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Type *">
            <select required value={form.type} onChange={set("type")} className={inputCls}>
              {PLAN_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </Field>
          <Field label="Duration (days) *">
            <input type="number" required min={1} value={form.durationDays} onChange={set("durationDays")} className={inputCls} />
          </Field>
          <Field label="Price (৳) *">
            <input type="number" required min={0} value={form.price} onChange={set("price")} className={inputCls} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          {[
            { key: "isActive",     label: "Active"        },
            { key: "trialEnabled", label: "Trial Enabled" },
            { key: "autoRenewal",  label: "Auto Renewal"  },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(form as Record<string, unknown>)[key] as boolean}
                onChange={set(key)} className="accent-[#BFE01D] w-4 h-4" />
              <span className="text-[#9aa87a] text-xs uppercase tracking-[0.2em]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border border-[#BFE01D]/15 panel p-6 space-y-4">
        <h2 className="label text-[#9aa87a]">Features</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "gymAccess",       label: "Gym Access"        },
            { key: "groupClasses",    label: "Group Classes"     },
            { key: "personalTrainer", label: "Personal Trainer"  },
            { key: "locker",          label: "Locker & Steam"    },
            { key: "dietConsult",     label: "Diet Consultation" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.features[key as keyof typeof form.features]}
                onChange={setFeature(key)} className="accent-[#BFE01D] w-4 h-4" />
              <span className="text-[#9aa87a] text-xs uppercase tracking-[0.2em]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          {loading ? "Saving…" : mode === "edit" ? "Update Plan" : "Create Plan"}
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

const inputCls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";
