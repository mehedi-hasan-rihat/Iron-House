"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";
type Role = { id: string; name: string };

export default function StaffForm({
  roles,
  defaultValues = {},
  mode = "create",
}: {
  roles: Role[];
  defaultValues?: {
    id?: string; name?: string; phone?: string; email?: string;
    address?: string; designation?: string; roleName?: string;
    salary?: number; joiningDate?: string;
  };
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:        defaultValues.name        ?? "",
    phone:       defaultValues.phone       ?? "",
    email:       defaultValues.email       ?? "",
    address:     defaultValues.address     ?? "",
    designation: defaultValues.designation ?? "",
    roleName:    defaultValues.roleName    ?? roles[0]?.name ?? "",
    salary:      defaultValues.salary?.toString() ?? "",
    joiningDate: defaultValues.joiningDate ?? new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    const url    = mode === "edit" ? `/api/staff/${defaultValues.id}` : "/api/staff";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    router.push("/admin/staff");
    router.refresh();
  }

  const cls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#BFE01D]/15 panel p-6 space-y-5">
        <h2 className="label text-[#9aa87a]">Staff Details</h2>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            { key: "name",        label: "Full Name *",  type: "text",  required: true,  placeholder: "Karim Ahmed" },
            { key: "phone",       label: "Phone *",      type: "tel",   required: true,  placeholder: "+880 1700 000 000" },
            { key: "email",       label: "Email",        type: "email", required: false, placeholder: "karim@example.com" },
            { key: "designation", label: "Designation *",type: "text",  required: true,  placeholder: "Trainer" },
          ].map(({ key, label, type, required, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">{label}</label>
              <input type={type} required={required} value={(form as Record<string,string>)[key]}
                onChange={set(key)} className={cls} placeholder={placeholder} />
            </div>
          ))}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Role *</label>
            <select required value={form.roleName} onChange={set("roleName")} className={cls}>
              {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Joining Date</label>
            <input type="date" value={form.joiningDate} onChange={set("joiningDate")} className={cls} />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Salary (৳)</label>
            <input type="number" min={0} value={form.salary} onChange={set("salary")} className={cls} placeholder="15000" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Address</label>
          <input type="text" value={form.address} onChange={set("address")} className={cls} placeholder="Area, City" />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          {loading ? "Saving…" : mode === "edit" ? "Update Staff" : "Add Staff"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
