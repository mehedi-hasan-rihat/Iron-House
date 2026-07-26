"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACC = "#BFE01D";

export default function MembershipActions({
  membershipId, currentStatus, planName,
}: {
  membershipId: string; currentStatus: string; planName: string;
}) {
  const router  = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: string, extra: Record<string, string> = {}) {
    setBusy(true);
    await fetch(`/api/memberships/${membershipId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action, ...extra }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "ACTIVE" && (
        <button onClick={() => act("freeze")} disabled={busy}
          className="border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50">
          Freeze
        </button>
      )}
      {currentStatus === "FROZEN" && (
        <button onClick={() => act("resume")} disabled={busy}
          className="border border-[#BFE01D] text-black text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50"
          style={{ backgroundColor: ACC }}>
          Resume
        </button>
      )}
      {(currentStatus === "ACTIVE" || currentStatus === "FROZEN") && (
        <button onClick={() => act("cancel")} disabled={busy}
          className="border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50">
          Cancel
        </button>
      )}
      {(currentStatus === "ACTIVE" || currentStatus === "EXPIRED") && (
        <button onClick={() => act("renew", { paymentMethod: "CASH" })} disabled={busy}
          className="border border-[#1a1a1a] text-[#bdbdbd] hover:border-white hover:text-white text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50">
          Renew
        </button>
      )}
    </div>
  );
}
