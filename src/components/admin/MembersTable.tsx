"use client";
import Link from "next/link";
import { Eye, Edit, MoreVertical, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";

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

type SortKey = "memberId" | "fullName" | "createdAt" | "status";

/* Actions shown depend on current status — never show the one already active */
const ACTIONS_FOR: Record<string, { label: string; status: string; color: string; desc: string }[]> = {
  ACTIVE: [
    { label: "Suspend", status: "SUSPENDED", color: "text-orange-400", desc: "Block entry, clock runs" },
    { label: "Freeze",  status: "FROZEN",    color: "text-blue-400",   desc: "Pause — extends end date" },
  ],
  SUSPENDED: [
    { label: "Activate", status: "ACTIVE",  color: "text-[#BFE01D]",  desc: "Restore full access"      },
    { label: "Freeze",   status: "FROZEN",  color: "text-blue-400",   desc: "Pause — extends end date" },
  ],
  FROZEN: [
    { label: "Activate", status: "ACTIVE",     color: "text-[#BFE01D]",  desc: "Unfreeze + extend end date" },
    { label: "Suspend",  status: "SUSPENDED",  color: "text-orange-400", desc: "Block entry, clock runs"    },
  ],
};

/* ── Sortable column header ── */
function SortTh({ col, label, current, dir }: {
  col: SortKey; label: string; current: SortKey | null; dir: "asc" | "desc";
}) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const active       = current === col;
  const nextDir      = active && dir === "asc" ? "desc" : "asc";

  function toggle() {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", col); p.set("dir", nextDir); p.set("page", "1");
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <th className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">
      <button onClick={toggle} className="inline-flex items-center gap-1 hover:text-[#f2f4e8] transition-colors">
        {label}
        {active
          ? dir === "asc"
            ? <ChevronUp   size={11} className="text-[#BFE01D]" />
            : <ChevronDown size={11} className="text-[#BFE01D]" />
          : <ChevronsUpDown size={11} className="opacity-30" />
        }
      </button>
    </th>
  );
}

/* ── Portal dropdown ── */
function ActionMenu({
  memberId, memberStatus, btnMap, onClose,
}: {
  memberId: string;
  memberStatus: string;
  btnMap: React.RefObject<Map<string, HTMLButtonElement>>;
  onClose: () => void;
}) {
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState<string | null>(null);
  const menuRef               = useRef<HTMLDivElement>(null);
  const actions               = ACTIONS_FOR[memberStatus] ?? [];
  const menuH                 = actions.length * 56 + 8;

  useEffect(() => {
    function calc() {
      const btn = btnMap.current?.get(memberId);
      if (!btn) return;
      const r          = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp     = spaceBelow < menuH + 8;
      setPos({
        top:  openUp ? r.top - menuH - 4 : r.bottom + 4,
        left: r.right - 192,
      });
    }
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => { window.removeEventListener("scroll", calc); window.removeEventListener("resize", calc); };
  }, [memberId, btnMap, menuH]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const btn = btnMap.current?.get(memberId);
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btn && !btn.contains(e.target as Node)
      ) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [memberId, btnMap, onClose]);

  async function applyStatus(status: string) {
    setLoading(status);
    try {
      await fetch(`/api/members/${memberId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      onClose();
      window.location.reload();
    } catch {
      setLoading(null);
    }
  }

  if (!actions.length) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, width: 192 }}
      className="bg-[#111] border border-[#BFE01D]/20 shadow-2xl py-1"
    >
      {actions.map((a) => (
        <button
          key={a.status}
          disabled={!!loading}
          onClick={() => applyStatus(a.status)}
          className={`w-full text-left px-4 py-3 transition-colors disabled:opacity-40 hover:bg-[#BFE01D]/6 ${a.color}`}
        >
          <span className="block text-xs uppercase tracking-[0.18em] font-semibold">
            {loading === a.status ? "Saving…" : a.label}
          </span>
          <span className="block text-[10px] text-[#9aa87a] mt-0.5 normal-case tracking-normal">
            {a.desc}
          </span>
        </button>
      ))}
    </div>,
    document.body
  );
}

/* ── Main table ── */
export default function MembersTable({
  members, sort, dir,
}: {
  members: Member[];
  sort: SortKey | null;
  dir: "asc" | "desc";
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const openMember = openMenu ? members.find((x) => x.id === openMenu) ?? null : null;

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
    <>
      <div className="overflow-x-auto border border-[#BFE01D]/15">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#BFE01D]/15 panel">
              <SortTh col="memberId"  label="Member ID" current={sort} dir={dir} />
              <SortTh col="fullName"  label="Name"      current={sort} dir={dir} />
              <th className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">Phone</th>
              <th className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">Plan</th>
              <th className="text-left px-4 py-3 label text-[#9aa87a] whitespace-nowrap">Expires</th>
              <SortTh col="status"    label="Status"    current={sort} dir={dir} />
              <SortTh col="createdAt" label="Joined"    current={sort} dir={dir} />
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BFE01D]/15">
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
                  <td className="px-4 py-3 text-[#9aa87a] whitespace-nowrap text-xs">
                    {new Date(m.createdAt).toLocaleDateString("en-BD")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/members/${m.id}`}
                        className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors" title="View">
                        <Eye size={14} />
                      </Link>
                      <Link href={`/admin/members/${m.id}/edit`}
                        className="p-1.5 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors" title="Edit">
                        <Edit size={14} />
                      </Link>
                      <button
                        ref={(el) => { if (el) btnRefs.current.set(m.id, el); else btnRefs.current.delete(m.id); }}
                        onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                        className={`p-1.5 transition-colors ${openMenu === m.id ? "text-[#BFE01D]" : "text-[#9aa87a] hover:text-[#f2f4e8]"}`}
                        title="Actions"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openMenu && openMember && (
        <ActionMenu
          memberId={openMenu}
          memberStatus={openMember.status}
          btnMap={btnRefs}
          onClose={() => setOpenMenu(null)}
        />
      )}
    </>
  );
}
