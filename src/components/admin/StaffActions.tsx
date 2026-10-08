"use client";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit } from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { toast } from "sonner";

const ACTIONS = [
  { label: "Set Active",    status: "ACTIVE",    color: "text-[#BFE01D]"  },
  { label: "Set On Leave",  status: "ON_LEAVE",  color: "text-yellow-400" },
  { label: "Suspend",       status: "SUSPENDED", color: "text-orange-400", restrictedForOwner: true },
  { label: "Mark Resigned", status: "RESIGNED",  color: "text-[#9aa87a]",  restrictedForOwner: true },
];

function ActionMenu({
  staffId,
  currentStatus,
  isOwner,
  btnRef,
  onClose,
}: {
  staffId:       string;
  currentStatus: string;
  isOwner:       boolean;
  btnRef:        React.RefObject<HTMLButtonElement | null>;
  onClose:       () => void;
}) {
  const menuRef               = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState<string | null>(null);

  const actions = ACTIONS.filter(
    (a) => a.status !== currentStatus && !(isOwner && a.restrictedForOwner)
  );
  const menuH   = actions.length * 44 + 8;

  useEffect(() => {
    function calc() {
      const btn = btnRef.current;
      if (!btn) return;
      const r          = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp     = spaceBelow < menuH + 8;
      setPos({
        top:  openUp ? r.top - menuH - 4 : r.bottom + 4,
        left: r.right - 160,
      });
    }
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [btnRef, menuH]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const btn = btnRef.current;
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btn && !btn.contains(e.target as Node)
      ) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [btnRef, onClose]);

  async function applyStatus(status: string) {
    setLoading(status);
    const res = await fetch(`/api/staff/${staffId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    setLoading(null);
    if (!res.ok) {
      const d = await res.json();
      toast.error(d.error ?? "Something went wrong.");
      return;
    }
    onClose();
    window.location.reload();
  }

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, width: 160 }}
      className="bg-[#111] border border-[#BFE01D]/20 shadow-2xl py-1"
    >
      {actions.map((a) => (
        <button
          key={a.status}
          disabled={!!loading}
          onClick={() => applyStatus(a.status)}
          className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-40 hover:bg-[#BFE01D]/6 ${a.color}`}
        >
          {loading === a.status ? "Saving…" : a.label}
        </button>
      ))}
    </div>,
    document.body
  );
}

export default function StaffActions({
  staffId,
  currentStatus,
  isOwner,
}: {
  staffId:       string;
  currentStatus: string;
  isOwner:       boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef          = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/staff/${staffId}/edit`}
        className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
        title="Edit"
      >
        <Edit size={14} />
      </Link>

      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`p-1.5 transition-colors ${open ? "text-[#BFE01D]" : "text-[#9aa87a] hover:text-[#f2f4e8]"}`}
        title="Actions"
      >
        <MoreVertical size={14} />
      </button>

      {open && (
        <ActionMenu
          staffId={staffId}
          currentStatus={currentStatus}
          isOwner={isOwner}
          btnRef={btnRef}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
