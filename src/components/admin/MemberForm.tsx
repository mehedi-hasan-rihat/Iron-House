"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ACC = "#BFE01D";

type Props = {
  defaultValues?: {
    id?: string; fullName?: string; phone?: string; email?: string;
    gender?: string; dob?: string; address?: string;
    bloodGroup?: string; medicalInfo?: string; emergencyContact?: string;
  };
  mode?: "create" | "edit";
};

export default function MemberForm({ defaultValues = {}, mode = "create" }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName:        defaultValues.fullName        ?? "",
    phone:           defaultValues.phone           ?? "",
    email:           defaultValues.email           ?? "",
    gender:          defaultValues.gender          ?? "",
    dob:             defaultValues.dob             ?? "",
    address:         defaultValues.address         ?? "",
    bloodGroup:      defaultValues.bloodGroup      ?? "",
    medicalInfo:     defaultValues.medicalInfo     ?? "",
    emergencyContact: defaultValues.emergencyContact ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url    = mode === "edit" ? `/api/members/${defaultValues.id}` : "/api/members";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const member = await res.json();
    router.push(`/admin/members/${member.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Personal */}
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-5">
        <h2 className="label text-[#bdbdbd]">Personal Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name *" required>
            <input type="text" required value={form.fullName} onChange={set("fullName")}
              className={inputCls} placeholder="Rahim Uddin" />
          </Field>
          <Field label="Phone *" required>
            <input type="tel" required value={form.phone} onChange={set("phone")}
              className={inputCls} placeholder="+880 1700 000 000" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set("email")}
              className={inputCls} placeholder="rahim@example.com" />
          </Field>
          <Field label="Date of Birth">
            <input type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={set("gender")} className={inputCls}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Blood Group">
            <select value={form.bloodGroup} onChange={set("bloodGroup")} className={inputCls}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Address">
          <input type="text" value={form.address} onChange={set("address")}
            className={inputCls} placeholder="House, Road, Area, City" />
        </Field>
      </div>

      {/* Medical */}
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-5">
        <h2 className="label text-[#bdbdbd]">Medical & Emergency</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Emergency Contact">
            <input type="text" value={form.emergencyContact} onChange={set("emergencyContact")}
              className={inputCls} placeholder="Name · Phone" />
          </Field>
          <Field label="Medical Information">
            <input type="text" value={form.medicalInfo} onChange={set("medicalInfo")}
              className={inputCls} placeholder="Conditions, allergies…" />
          </Field>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 transition-opacity hover:opacity-85"
          style={{ backgroundColor: ACC }}
        >
          {loading ? "Saving…" : mode === "edit" ? "Update Member" : "Create Member"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-[#bdbdbd] text-xs uppercase tracking-[0.2em] hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#bdbdbd] mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#050505] border border-[#1a1a1a] text-white text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";
