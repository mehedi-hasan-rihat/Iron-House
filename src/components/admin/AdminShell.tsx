"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, CreditCard, Dumbbell,
  UserCog, ShieldCheck, BarChart3, Settings,
  Menu, X, LogOut, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/members",     label: "Members",      icon: Users           },
  { href: "/admin/plans",       label: "Plans",        icon: Dumbbell        },
  { href: "/admin/memberships", label: "Memberships",  icon: CreditCard      },
  { href: "/admin/payments",    label: "Payments",     icon: CreditCard      },
  { href: "/admin/staff",       label: "Staff",        icon: UserCog         },
  { href: "/admin/roles",       label: "Roles",        icon: ShieldCheck     },
  { href: "/admin/reports",     label: "Reports",      icon: BarChart3       },
  { href: "/admin/settings",    label: "Settings",     icon: Settings        },
];

import NotificationBell from "./NotificationBell";

const ACC = "#BFE01D";

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { user: { name?: string | null; email?: string | null; role?: string } };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div data-layout="dashboard" className="flex h-screen bg-[#050505] text-white overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#0b0b0b] border-r border-[#1a1a1a]
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-[#1a1a1a]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACC }} />
          <span className="font-display text-sm tracking-[0.35em] uppercase text-white">
            Fit Gym Center
          </span>
          <button
            className="ml-auto lg:hidden text-[#bdbdbd] hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-[0.2em]
                  transition-colors rounded-sm
                  ${active
                    ? "text-black font-bold"
                    : "text-[#bdbdbd] hover:text-white hover:bg-white/5"
                  }
                `}
                style={active ? { backgroundColor: ACC } : {}}
              >
                <Icon size={15} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + signout */}
        <div className="px-4 py-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-black text-xs font-bold"
              style={{ backgroundColor: ACC }}>
              {session.user.name?.[0] ?? session.user.email?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{session.user.email}</p>
              <p className="text-[10px] text-[#bdbdbd] uppercase tracking-widest">{session.user.role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full text-[#bdbdbd] hover:text-white text-xs uppercase tracking-[0.2em] px-1 py-1 transition-colors"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center gap-4 px-5 py-4 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-sm shrink-0">
          <button
            className="lg:hidden text-[#bdbdbd] hover:text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <NotificationBell />
          <span className="label text-[#bdbdbd]">
            {new Date().toLocaleDateString("en-BD", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
