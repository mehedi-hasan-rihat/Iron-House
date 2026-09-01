"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";
const cls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";

export default function CustomerProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [member, setMember]     = useState<Record<string, string> | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [success, setSuccess]   = useState("");
  const [error,   setError]     = useState("");

  useEffect(() => {
    fetch("/api/members/me")
      .then((r) => r.json())
      .then((d) => { setMember(d); setLoading(false); });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!member) return;
    setSaving(true); setError(""); setSuccess("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/members/me", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    setSuccess("Profile updated.");
    router.refresh();
  }

  if (loading) return <div className="py-12 text-center text-[#9aa87a] text-xs uppercase tracking-widest">Loading…</div>;
  if (!member) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Profile</h1>
        <p className="label text-[#9aa87a] mt-1">{member.memberId}</p>
      </div>

      <form onSubmit={save} className="space-y-5">
        <div className="border border-[#BFE01D]/15 panel p-6 space-y-5">
          <h2 className="label text-[#9aa87a]">Personal Information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { name: "fullName", label: "Full Name",       type: "text"  },
              { name: "phone",    label: "Phone",           type: "tel"   },
              { name: "email",    label: "Email",           type: "email" },
              { name: "address",  label: "Address",         type: "text"  },
              { name: "emergencyContact", label: "Emergency Contact", type: "text" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">{label}</label>
                <input name={name} type={type} defaultValue={member[name] ?? ""}
                  className={cls} />
              </div>
            ))}
          </div>
        </div>

        {error   && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-xs" style={{ color: ACC }}>{success}</p>}

        <button type="submit" disabled={saving}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          {saving ? "Saving…" : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
