"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

export default function DeletePlanButton({ planId, planName, membershipCount }: {
  planId:          string;
  planName:        string;
  membershipCount: number;
}) {
  const router = useRouter();
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/plans/${planId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete plan.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => { setError(""); setOpen(true); }}
        title={membershipCount > 0 ? `${membershipCount} memberships — only deletable if none are active` : "Delete plan"}
        className="text-[#9aa87a] hover:text-red-400 transition-colors"
      >
        <Trash2 size={13} />
      </button>

      <ConfirmModal
        open={open}
        title="Delete plan"
        description={
          membershipCount > 0
            ? `"${planName}" has ${membershipCount} membership(s). It can only be deleted if none are currently active, frozen, or pending.`
            : `Delete "${planName}" permanently? This cannot be undone.`
        }
        confirmLabel="Delete"
        danger
        loading={loading}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => { setOpen(false); setError(""); }}
      />
    </>
  );
}
