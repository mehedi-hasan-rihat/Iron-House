"use client";
import Link from "next/link";
import { Eye, Edit, MoreVertical } from "lucide-react";
import { useState } from "react";

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
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] py-16 text-center">
        <p className="text-[#bdbdbd] text-sm">No members found.</p>
        <Link href="/admin/members/new" className="mt-4 inline-block text-[#BFE01D] text-xs uppercase tracking-[0.2em] hover:underline">
          Add first member →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#1a1a1a]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1a1a1a] bg-[#0b0b0b]">
            {["Member ID", "Name", "Phone", "Plan", "Expires", "Status", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 label text-[#bdbdbd] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {members.map((m) => {
            const activeMembership = m.memberships[0];
            const expired = activeMembership
              ? new Date(activeMembership.endDate) < new Date()
              : false;

            return (
              <tr key={m.id} className="bg-[#050505] hover:bg-[#0b0b0b] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#bdbdbd]">{m.memberId}</td>
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{m.fullName}</td>
                <td className="px-4 py-3 text-[#bdbdbd]">{m.phone}</td>
                <td className="px-4 py-3 text-[#bdbdbd]">
                  {activeMembership?.plan?.name ?? <span className="text-[#1a1a1a]">—</span>}
                </td>
                <td className="px-4 py-3 text-[#bdbdbd] whitespace-nowrap">
                  {activeMembership
                    ? <span className={expired ? "text-red-400" : ""}>
                        {new Date(activeMembership.endDate).toLocaleDateString("en-BD")}
                      </span>
                    : <span className="text-[#1a1a1a]">—</span>
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
                      className="p-1.5 text-[#bdbdbd] hover:text-white transition-colors" title="View">
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/members/${m.id}/edit`}
                      className="p-1.5 text-[#bdbdbd] hover:text-white transition-colors" title="Edit">
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => setMenu(menu === m.id ? null : m.id)}
                      className="p-1.5 text-[#bdbdbd] hover:text-white transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>
                    {menu === m.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 bg-[#111] border border-[#1a1a1a] shadow-xl">
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
                            className="w-full text-left px-4 py-2.5 text-xs text-[#bdbdbd] hover:text-white hover:bg-white/5 uppercase tracking-[0.15em]"
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
        </tbody>
      </table>
    </div>
  );
}
