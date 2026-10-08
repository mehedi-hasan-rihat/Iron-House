"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const ACC = "#BFE01D";
const METHODS = [
  { value: "CASH",          label: "Cash" },
  { value: "BKASH",         label: "bKash" },
  { value: "NAGAD",         label: "Nagad" },
  { value: "ROCKET",        label: "Rocket" },
  { value: "CARD",          label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];
const inputCls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";

export default function ManualPaymentForm({
  membershipId,
  defaultAmount,
  isPending,
}: {
  membershipId:  string;
  defaultAmount: number;
  isPending:     boolean;
}) {
  const router  = useRouter();
  const [open,          setOpen]          = useState(false);
  const [amount,        setAmount]        = useState(String(defaultAmount));
  const [method,        setMethod]        = useState("CASH");
  const [transactionId, setTransactionId] = useState("");
  const [note,          setNote]          = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  function handleClose() {
    setOpen(false);
    setError("");
    setTransactionId("");
    setNote("");
    setAmount(String(defaultAmount));
    setMethod("CASH");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError("Enter a valid amount."); return; }
    setLoading(true); setError("");

    const res = await fetch(`/api/memberships/${membershipId}/pay`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ amount: Number(amount), method, transactionId, note }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to record payment.");
      return;
    }

    handleClose();
    router.refresh();
  }

  return (
    <>
      {/* Trigger button — sits in header */}
      <button
        onClick={() => setOpen(true)}
        className="text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5 hover:opacity-85 transition-opacity"
        style={{ backgroundColor: ACC }}
      >
        Record Payment
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog" aria-modal="true" aria-labelledby="pay-modal-title">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Panel */}
          <form onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-[#BFE01D]/15 p-6 space-y-5">
            {/* Close */}
            <button type="button" onClick={handleClose}
              className="absolute top-4 right-4 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
              aria-label="Close">
              <X size={14} />
            </button>

            {/* Header */}
            <div className="pr-6">
              <h2 id="pay-modal-title" className="font-display text-xl text-[#f2f4e8] uppercase tracking-wide">
                Record Payment
              </h2>
              {isPending && (
                <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: ACC }}>
                  Will activate this membership
                </p>
              )}
            </div>

            {/* Amount + Method */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Amount (৳) *</label>
                <input type="number" min={1} required
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Method *</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
                  {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {/* Transaction ID — non-cash only */}
            {method !== "CASH" && (
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Transaction / Reference ID</label>
                <input type="text" value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="TXN12345" className={inputCls} />
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                rows={2} placeholder="Collected at front desk…"
                className={`${inputCls} resize-none`} />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button type="button" onClick={handleClose}
                className="text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="text-black text-xs font-bold uppercase tracking-[0.2em] px-6 py-2.5 disabled:opacity-40 hover:opacity-85 transition-opacity"
                style={{ backgroundColor: ACC }}>
                {loading ? "Saving…" : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
