"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundButton({ paymentId }: { paymentId: string }) {
  const router  = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function refund() {
    setBusy(true);
    await fetch(`/api/payments/${paymentId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: "REFUNDED" }),
    });
    setBusy(false);
    setConfirm(false);
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex gap-2">
        <button onClick={refund} disabled={busy}
          className="border border-red-500 text-red-400 hover:bg-red-500/10 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50">
          {busy ? "Processing…" : "Confirm Refund"}
        </button>
        <button onClick={() => setConfirm(false)}
          className="border border-[#1a1a1a] text-[#bdbdbd] hover:text-white text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirm(true)}
      className="border border-[#1a1a1a] text-[#bdbdbd] hover:border-red-400 hover:text-red-400 text-xs uppercase tracking-[0.2em] px-4 py-2 transition-colors">
      Refund
    </button>
  );
}
