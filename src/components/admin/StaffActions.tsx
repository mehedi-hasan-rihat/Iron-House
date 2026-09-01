"use client";
import { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function StaffActions({ staffId, currentStatus }: { staffId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: "Set Active",    status: "ACTIVE"    },
    { label: "Set On Leave",  status: "ON_LEAVE"  },
    { label: "Suspend",       status: "SUSPENDED" },
    { label: "Mark Resigned", status: "RESIGNED"  },
  ].filter((a) => a.status !== currentStatus);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-1 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors">
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-6 z-20 w-40 bg-[#111] border border-[#BFE01D]/15 shadow-xl">
            {actions.map((a) => (
              <button key={a.status}
                onClick={async () => {
                  await fetch(`/api/staff/${staffId}`, {
                    method:  "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ status: a.status }),
                  });
                  setOpen(false);
                  window.location.reload();
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-[#9aa87a] hover:text-[#f2f4e8] hover:bg-[#BFE01D]/[0.06] uppercase tracking-[0.15em]">
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
