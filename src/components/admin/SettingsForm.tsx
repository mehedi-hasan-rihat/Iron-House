"use client";

import { useState } from "react";

const ACC = "#BFE01D";

const FIELDS = [
  { label: "Gym Name",     placeholder: "Fit Gym Center",        defaultValue: "Fit Gym Center" },
  { label: "Phone",        placeholder: "+880 1700 000 000",      defaultValue: "" },
  { label: "Email",        placeholder: "info@fitgymcenter.com",  defaultValue: "" },
  { label: "Address",      placeholder: "Sabujbag, Patuakhali",   defaultValue: "" },
  { label: "Opening Time", placeholder: "06:00 AM",               defaultValue: "" },
  { label: "Closing Time", placeholder: "11:00 PM",               defaultValue: "" },
];

export default function SettingsForm() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.label, f.defaultValue]))
  );
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    // TODO: wire up to a real API / server action
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-5">
      <h2 className="label text-[#bdbdbd]">Gym Information</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {FIELDS.map(({ label, placeholder }) => (
          <div key={label}>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#bdbdbd] mb-2">
              {label}
            </label>
            <input
              value={values[label]}
              onChange={(e) => setValues((v) => ({ ...v, [label]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-[#050505] border border-[#1a1a1a] text-white text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={busy}
        className="text-black text-xs font-bold uppercase tracking-[0.25em] px-6 py-3 hover:opacity-85 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: ACC }}
      >
        {saved ? "Saved!" : busy ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
