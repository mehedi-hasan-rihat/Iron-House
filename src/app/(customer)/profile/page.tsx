"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

const ACC = "#BFE01D";
const cls =
  "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";

type MemberData = {
  memberId:         string;
  fullName:         string;
  phone:            string;
  address:          string;
  emergencyContact: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#BFE01D]/10 last:border-0">
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] pt-0.5 shrink-0 w-28">{label}</span>
      <span className="text-sm text-[#f2f4e8] text-right break-all">{value || "—"}</span>
    </div>
  );
}

export default function CustomerProfilePage() {
  const { data: session } = useSession();

  const [member,  setMember]  = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [formError, setFormError] = useState("");

  // ── Password state ──────────────────────────────────────────────────────
  const [editingPw, setEditingPw] = useState(false);
  const [pw, setPwState] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError,   setPwError]   = useState("");

  useEffect(() => {
    fetch("/api/members/me")
      .then((r) => r.json())
      .then((d: MemberData) => {
        setMember({
          memberId:         d.memberId         ?? "",
          fullName:         d.fullName         ?? "",
          phone:            d.phone            ?? "",
          address:          d.address          ?? "",
          emergencyContact: d.emergencyContact ?? "",
        });
        setLoading(false);
      });
  }, []);

  // ── Profile save ──────────────────────────────────────────────────────────
  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    setFormError("");

    const res = await fetch("/api/members/me", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        fullName:         member.fullName,
        phone:            member.phone,
        address:          member.address,
        emergencyContact: member.emergencyContact,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setFormError(d.error ?? "Failed to save.");
      return;
    }
    toast.success("Profile updated.");
  }

  const setField = (k: keyof MemberData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setMember((m) => m ? { ...m, [k]: e.target.value } : m);

  // ── Password save ─────────────────────────────────────────────────────────
  function cancelPw() {
    setPwState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPwError("");
    setEditingPw(false);
  }

  const setPw = (k: keyof typeof pw) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPwState((p) => ({ ...p, [k]: e.target.value }));

  async function savePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError("");

    if (pw.newPassword !== pw.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pw.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    const res = await fetch("/api/members/me/password", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        currentPassword: pw.currentPassword,
        newPassword:     pw.newPassword,
      }),
    });
    setPwLoading(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setPwError(d.error ?? "Something went wrong.");
      return;
    }

    toast.success("Password updated.");
    cancelPw();
  }

  if (loading) return (
    <div className="py-12 text-center text-[#9aa87a] text-xs uppercase tracking-widest">
      Loading…
    </div>
  );
  if (!member) return null;

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Profile</h1>
        <p className="label text-[#9aa87a] mt-1">{member.memberId}</p>
      </div>

      {/* Read-only identity */}
      <div className="border border-[#BFE01D]/15 panel p-6">
        <Row label="Member ID" value={member.memberId} />
        <Row label="Email"     value={session?.user?.email ?? "—"} />
      </div>

      {/* Editable personal info */}
      <form onSubmit={saveProfile} className="border border-[#BFE01D]/15 panel p-6 space-y-5">
        <h2 className="label text-[#9aa87a]">Personal Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          {([
            { key: "fullName",         label: "Full Name",         type: "text" },
            { key: "phone",            label: "Phone",             type: "tel"  },
            { key: "address",          label: "Address",           type: "text" },
            { key: "emergencyContact", label: "Emergency Contact", type: "text" },
          ] as { key: keyof MemberData; label: string; type: string }[]).map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                {label}
              </label>
              <input
                type={type}
                value={member[key]}
                onChange={setField(key)}
                className={cls}
              />
            </div>
          ))}
        </div>

        {formError && <p className="text-red-400 text-xs">{formError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}
        >
          {saving ? "Saving…" : "Update Profile"}
        </button>
      </form>

      {/* Password */}
      <div className="border border-[#BFE01D]/15 panel p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="label text-[#9aa87a]">Password</span>
          {!editingPw && (
            <button
              type="button"
              onClick={() => setEditingPw(true)}
              className="flex items-center gap-1.5 text-[#9aa87a] hover:text-[#f2f4e8] text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <Pencil size={11} /> Change
            </button>
          )}
        </div>

        {editingPw ? (
          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                Current Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password" required value={pw.currentPassword}
                onChange={setPw("currentPassword")} className={cls}
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                  New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password" required minLength={8}
                  value={pw.newPassword} onChange={setPw("newPassword")}
                  className={cls} placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                  Confirm <span className="text-red-400">*</span>
                </label>
                <input
                  type="password" required minLength={8}
                  value={pw.confirmPassword} onChange={setPw("confirmPassword")}
                  className={cls} placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </div>
            </div>
            {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
            <div className="flex items-center gap-3">
              <button
                type="submit" disabled={pwLoading}
                className="text-black text-xs font-bold uppercase tracking-[0.25em] px-6 py-2.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
                style={{ backgroundColor: ACC }}
              >
                {pwLoading ? "Updating…" : "Update Password"}
              </button>
              <button
                type="button" onClick={cancelPw}
                className="flex items-center gap-1 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-[#9aa87a]">••••••••</p>
        )}
      </div>
    </div>
  );
}
