"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

const ACC = "#BFE01D";

const cls =
  "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  ON_LEAVE:  "text-yellow-400 bg-yellow-400/10",
  SUSPENDED: "text-orange-400 bg-orange-400/10",
  RESIGNED:  "text-[#9aa87a] bg-[#BFE01D]/[0.06]",
};

type Props = {
  staffId:     string;
  name:        string;
  email:       string;
  phone:       string;
  address:     string;
  designation: string;
  role:        string;
  joined:      string;
  salary:      string;
  status:      string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#BFE01D]/10 last:border-0">
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] pt-0.5 w-32 shrink-0">{label}</span>
      <span className="text-sm text-[#f2f4e8] text-right">{value || "—"}</span>
    </div>
  );
}

export default function ProfileForm(props: Props) {
  // ── Contact edit state ────────────────────────────────────────────────────
  const [editingContact, setEditingContact] = useState(false);
  const [phone,   setPhone]   = useState(props.phone);
  const [address, setAddress] = useState(props.address);
  const [profileLoading, setProfileLoading] = useState(false);

  function cancelContact() {
    setPhone(props.phone);
    setAddress(props.address);
    setEditingContact(false);
  }

  async function saveContact(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    const res = await fetch("/api/staff/me", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ type: "profile", phone, address }),
    });
    setProfileLoading(false);
    if (!res.ok) {
      const d = await res.json();
      toast.error(d.error ?? "Could not save changes.");
      return;
    }
    toast.success("Contact details updated.");
    setEditingContact(false);
  }

  // ── Password state ────────────────────────────────────────────────────────
  const [editingPw, setEditingPw] = useState(false);
  const [pw, setPwState] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError,   setPwError]   = useState("");

  function cancelPw() {
    setPwState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPwError("");
    setEditingPw(false);
  }

  const setPw = (k: keyof typeof pw) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPwState((p) => ({ ...p, [k]: e.target.value }));

  async function savePassword(e: React.FormEvent) {
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
    const res = await fetch("/api/staff/me", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        currentPassword: pw.currentPassword,
        newPassword:     pw.newPassword,
      }),
    });
    setPwLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setPwError(d.error ?? "Something went wrong.");
      return;
    }

    toast.success("Password updated.");
    cancelPw();
  }

  return (
    <div className="space-y-4">

      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <div className="border border-[#BFE01D]/15 panel p-6 space-y-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#BFE01D]/15">
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center text-black text-base font-bold shrink-0"
            style={{ backgroundColor: ACC }}
          >
            {props.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-[#f2f4e8] font-medium text-sm">{props.name}</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[props.status] ?? ""}`}>
              {props.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <Row label="Staff ID"    value={props.staffId} />
        <Row label="Email"       value={props.email} />
        <Row label="Role"        value={props.role} />
        <Row label="Designation" value={props.designation} />
        <Row label="Joined"      value={props.joined} />
        <Row label="Salary"      value={props.salary} />
      </div>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <div className="border border-[#BFE01D]/15 panel p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="label text-[#9aa87a]">Contact Details</span>
          {!editingContact && (
            <button
              type="button"
              onClick={() => setEditingContact(true)}
              className="flex items-center gap-1.5 text-[#9aa87a] hover:text-[#f2f4e8] text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <Pencil size={11} /> Edit
            </button>
          )}
        </div>

        {editingContact ? (
          <form onSubmit={saveContact} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel" required value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cls} placeholder="+880 1700 000 000"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Address</label>
                <input
                  type="text" value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={cls} placeholder="Area, City"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit" disabled={profileLoading}
                className="text-black text-xs font-bold uppercase tracking-[0.25em] px-6 py-2.5 disabled:opacity-50 hover:opacity-85 transition-opacity"
                style={{ backgroundColor: ACC }}
              >
                {profileLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button" onClick={cancelContact}
                className="flex items-center gap-1 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <Row label="Phone"   value={phone} />
            <Row label="Address" value={address} />
          </div>
        )}
      </div>

      {/* ── Password ─────────────────────────────────────────────────────── */}
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
                onChange={setPw("currentPassword")}
                className={cls} autoComplete="current-password"
                // eslint-disable-next-line jsx-a11y/no-autofocus
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
                  Confirm New Password <span className="text-red-400">*</span>
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
            <div className="flex items-center gap-3 pt-1">
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
