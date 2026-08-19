"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DangerZone() {
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleReset() {
    setBusy(true);
    // TODO: wire up to a real API/server action
    await new Promise((r) => setTimeout(r, 1000));
    setBusy(false);
    setConfirmReset(false);
    router.refresh();
  }

  return (
    <div className="border border-red-900/40 panel p-6 space-y-4">
      <h2 className="label text-red-400">Danger Zone</h2>
      <p className="text-[#9aa87a] text-xs">
        These actions are irreversible. Proceed with caution.
      </p>

      <div className="flex items-center justify-between py-3 border-b border-[#BFE01D]/15">
        <div>
          <p className="text-[#f2f4e8] text-xs uppercase tracking-[0.15em]">Reset All Data</p>
          <p className="text-[#9aa87a] text-[11px] mt-0.5">Permanently deletes all members, payments and plans.</p>
        </div>

        {confirmReset ? (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={busy}
              className="border border-red-500 text-red-400 hover:bg-red-500/10 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50"
            >
              {busy ? "Resetting…" : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="border border-[#BFE01D]/15 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="border border-red-900/40 text-red-400 hover:border-red-500 hover:bg-red-500/10 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
