"use client";
import Link from "next/link";
import { Eye, Edit, MoreVertical } from "lucide-react";
import { useState } from "react";
import Stagger from "@/components/motion/Stagger";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  SUSPENDED: "text-orange-400 bg-orange-400/10",
  FROZEN:    "text-blue-400 bg-blue-400/10",
};

type Member = {
  id: string; memberId: string; fullName: string; phone: string;
  email?: string | null; status: string; createdAt: Date;
  memberships: Array<{ plan: { name: string } | null; endDate: Date }>;
};

export default function MembersTable({ members }: { members: Member[] }) {
  const [menu, setMenu] = useState<string | null>(null);

  if (!members.length) {
    return (
      <div className="border border-[#BFE01D]/15 panel py-16 text-center">
        <p className="text-[#9aa87a] text-sm">No members found.</p>
        <Link href="/admin/members/new" className="mt-4 inline-block text-[#BFE01D] text-xs uppercase tracking-[0.2em] hover:underline">
          Add first member →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#BFE01D]/15">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#BFE01D]/15 panel">
            {["Member ID", "Name", "Phone", "Plan", "Expires", "Status", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <Stagger as="tbody" selector="tr" className="divide-y divide-[#BFE01D]/15"
          stagger={0.035} y={12} blur={false}>
          {members.map((m) => {
            const activeMembership = m.memberships[0];
            const expired = activeMembership
              ? new Date(activeMembership.endDate) < new Date()
              : false;

            return (
              <tr key={m.id} className="bg-[#050505] hover:bg-[#0d0f08] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#9aa87a]">{m.memberId}</td>
                <td className="px-4 py-3 font-medium text-[#f2f4e8] whitespace-nowrap">{m.fullName}</td>
                <td className="px-4 py-3 text-[#9aa87a]">{m.phone}</td>
                <td className="px-4 py-3 text-[#9aa87a]">
                  {activeMembership?.plan?.name ?? <span className="text-[#1f2408]">—</span>}
                </td>
                <td className="px-4 py-3 text-[#9aa87a] whitespace-nowrap">
                  {activeMembership
                    ? <span className={expired ? "text-red-400" : ""}>
                        {new Date(activeMembership.endDate).toLocaleDateString("en-BD")}
                      </span>
                    : <span className="text-[#1f2408]">—</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${STATUS_COLORS[m.status] ?? ""}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 relative">
                    <Link href={`/admin/members/${m.id}`}
                      className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors" title="View">
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/members/${m.id}/edit`}
                      className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors" title="Edit">
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => setMenu(menu === m.id ? null : m.id)}
                      className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>
                    {menu === m.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 bg-[#111] border border-[#BFE01D]/15 shadow-xl">
                        {[
                          { label: "Suspend",  status: "SUSPENDED" },
                          { label: "Freeze",   status: "FROZEN"    },
                          { label: "Activate", status: "ACTIVE"    },
                        ].map((action) => (
                          <button key={action.label}
                            onClick={async () => {
                              await fetch(`/api/members/${m.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: action.status }),
                              });
                              setMenu(null);
                              window.location.reload();
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-[#9aa87a] hover:text-[#f2f4e8] hover:bg-[#BFE01D]/[0.06] uppercase tracking-[0.15em]"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </Stagger>
      </table>
    </div>
  );
}
