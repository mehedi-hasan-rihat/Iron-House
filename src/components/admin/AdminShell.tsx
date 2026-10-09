"use client";
import { useRef, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Dumbbell,
  UserCog,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import NotificationBell from "./NotificationBell";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MagneticBox from "@/components/motion/MagneticBox";
import BackToTop from "@/components/motion/BackToTop";
import { Toaster } from "sonner";
import type { PermissionKey } from "@/lib/permissions";

// ── Permission context ──────────────────────────────────────────────────────
// Consume this in any admin client component with `usePermissions()`.
// Server components should check permissions at the page level with
// `requirePermission()` from auth-guard instead.

const PermissionsContext = createContext<Set<PermissionKey>>(new Set());

export function usePermissions() {
  return useContext(PermissionsContext);
}

/** Returns true if the current user has the given permission. */
export function useHasPermission(key: PermissionKey): boolean {
  return useContext(PermissionsContext).has(key);
}

// ── Nav definition ──────────────────────────────────────────────────────────
// Each entry declares which permission gates it. The nav item is hidden if
// the user lacks that permission.

const NAV = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard, perm: "dashboard:view"   as PermissionKey },
  { href: "/admin/members",     label: "Members",     icon: Users,           perm: "members:view"     as PermissionKey },
  { href: "/admin/plans",       label: "Plans",       icon: Dumbbell,        perm: "plans:view"       as PermissionKey },
  { href: "/admin/memberships", label: "Memberships", icon: CreditCard,      perm: "memberships:view" as PermissionKey },
  { href: "/admin/payments",    label: "Payments",    icon: CreditCard,      perm: "payments:view"    as PermissionKey },
  { href: "/admin/staff",       label: "Staff",       icon: UserCog,         perm: "staff:view"       as PermissionKey },
  { href: "/admin/roles",       label: "Roles",       icon: ShieldCheck,     perm: "roles:view"       as PermissionKey },
];

const ACC = "#BFE01D";
export const SCROLL_ID = "admin-scroll";

export default function AdminShell({
  children,
  session,
  permissions,
}: {
  children: React.ReactNode;
  session: {
    user: { name?: string | null; email?: string | null; role?: string };
  };
  permissions: PermissionKey[];
}) {
  const permsSet = new Set(permissions);

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Only show nav items the user can actually reach
  const visibleNav = NAV.filter((n) => permsSet.has(n.perm));

  const activeHref = visibleNav.find(
    (n) => pathname === n.href || pathname.startsWith(`${n.href}/`),
  )?.href;

  /* ── Sliding active-link indicator (GSAP only — no sidebar involvement) ── */
  const root = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useGSAP(
    () => {
      const bar = indicator.current;
      const nav = navRef.current;
      if (!bar || !nav) return;

      const active = nav.querySelector<HTMLElement>('[data-nav-active="true"]');
      if (!active) {
        gsap.set(bar, { autoAlpha: 0 });
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      const to = {
        y: rect.top - navRect.top + nav.scrollTop,
        height: rect.height,
        autoAlpha: 1,
      };

      if (!placed.current || prefersReducedMotion()) {
        placed.current = true;
        gsap.set(bar, to);
        return;
      }
      gsap.to(bar, { ...to, duration: 0.45, ease: "expo.out" });
    },
    { scope: root, dependencies: [activeHref] },
  );

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[#BFE01D]/15 shrink-0">
        <span
          className="h-2 w-2 rounded-full accent-dot"
          style={{ backgroundColor: ACC }}
        />
        <span className="font-display text-sm tracking-[0.35em] uppercase text-[#f2f4e8]">
          Iron House
        </span>
      </div>

      {/* Nav */}
      <nav ref={navRef} className="relative flex-1 overflow-y-auto py-4 px-3">
        <span
          ref={indicator}
          aria-hidden
          className="absolute left-3 right-3 top-0 rounded-sm"
          style={{ backgroundColor: ACC, visibility: "hidden" }}
        />
        <div className="relative space-y-0.5">
          {visibleNav.map(({ href, label, icon: Icon }) => {
            const active = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                data-nav-item
                data-nav-active={active}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors rounded-sm ${
                  active
                    ? "text-[#f2f4e8] bg-[#BFE01D]/6"
                    : "text-[#9aa87a] hover:text-[#f2f4e8] hover:bg-[#BFE01D]/6"
                }`}
              >
                <Icon size={15} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + signout */}
      <div className="px-4 py-4 border-t border-[#BFE01D]/15 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="h-7 w-7 rounded-full flex items-center justify-center text-black text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: ACC }}
            title="View profile"
          >
            {session.user.name?.[0] ?? session.user.email?.[0] ?? "?"}
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="text-xs text-[#f2f4e8] truncate block hover:text-[#BFE01D] transition-colors"
            >
              {session.user.email}
            </Link>
            <p className="text-[10px] text-[#9aa87a] uppercase tracking-widest">
              {session.user.role}
            </p>
          </div>
        </div>
        <MagneticBox>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] px-1 py-1 transition-colors"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </MagneticBox>
      </div>
    </>
  );

  return (
    <PermissionsContext.Provider value={permsSet}>
      <div
        ref={root}
        data-layout="dashboard"
        className="grain-overlay flex h-screen bg-[#050505] text-[#f2f4e8] overflow-hidden"
      >
        {/* ── Desktop sidebar — always in flow, never transformed ── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col panel border-r border-[#BFE01D]/15">
          {sidebarContent}
        </aside>

        {/* ── Mobile sidebar — CSS transition, no GSAP ── */}
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
          {/* Drawer */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col panel border-r border-[#BFE01D]/15 lg:hidden transition-transform duration-300 ease-in-out ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent}
          </aside>
        </>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="relative flex items-center gap-4 px-5 py-4 border-b border-[#BFE01D]/15 bg-[#050505]/80 backdrop-blur-sm shrink-0">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex-1" />

            <ScrollProgress
              targetId={SCROLL_ID}
              variant="ring"
              className="hidden sm:block"
            />
            <NotificationBell />
            <span className="label text-[#9aa87a]">
              {new Date().toLocaleDateString("en-BD", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <ScrollProgress
              targetId={SCROLL_ID}
              className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
            />
          </header>

          {/* Page content */}
          <main id={SCROLL_ID} className="flex-1 overflow-y-auto p-5 md:p-8">
            {children}
          </main>

          <BackToTop targetId={SCROLL_ID} />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              border: "1px solid rgba(191,224,29,0.15)",
              color: "#f2f4e8",
              fontFamily: "inherit",
              fontSize: "12px",
            },
          }}
        />
      </div>
    </PermissionsContext.Provider>
  );
}
