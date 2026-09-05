"use client";
import { useState } from "react";

interface Props {
  planId:   string;
  planName: string;
  amount:   number;
}

export default function CheckoutForm({ planId, planName, amount }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/moneybag/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Hard redirect to Moneybag hosted checkout
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-xs">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-[#BFE01D] text-black font-bold text-xs uppercase tracking-[0.25em] py-5 flex items-center justify-center gap-3 hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-black/40 border-t-black animate-spin" />
            Redirecting to payment…
          </>
        ) : (
          <>
            Pay ৳{amount.toLocaleString()} for {planName}
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
              <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-[#9aa87a]">
        You&apos;ll be redirected to Moneybag&apos;s secure payment page.
      </p>
    </div>
  );
}
