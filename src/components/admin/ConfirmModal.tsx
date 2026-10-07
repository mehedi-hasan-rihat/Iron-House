"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  open:        boolean;
  title:       string;
  description: string;
  confirmLabel?: string;
  danger?:     boolean;
  loading?:    boolean;
  error?:      string;
  onConfirm:   () => void;
  onCancel:    () => void;
};

export default function ConfirmModal({
  open, title, description,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel on open; close on Escape
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-[#BFE01D]/15 p-6 space-y-5">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        {/* Content */}
        <div className="space-y-2 pr-4">
          <h2 id="modal-title" className="font-display text-lg text-[#f2f4e8] uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-[#9aa87a] text-sm leading-relaxed">{description}</p>
        </div>

        {error && (
          <p className="text-red-400 text-xs border border-red-500/20 px-3 py-2">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            className="text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5 disabled:opacity-40 transition-opacity hover:opacity-85 ${
              danger
                ? "bg-red-500 text-white"
                : "text-black"
            }`}
            style={danger ? undefined : { backgroundColor: "#BFE01D" }}
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
