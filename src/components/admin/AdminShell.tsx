"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, CreditCard, Dumbbell,
  UserCog, ShieldCheck, BarChart3, Settings,
  LogOut, ChevronRight,
} from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import NotificationBell from "./NotificationBell";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MagneticBox from "@/components/motion/MagneticBox";
import BackToTop from "@/components/motion/BackToTop";

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

const ACC = "#BFE01D";
const MOBILE = "(max-width: 1023px)";

/** The scroll container the progress indicators read from. */
export const SCROLL_ID = "admin-scroll";

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { user: { name?: string | null; email?: string | null; role?: string } };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const root      = useRef<HTMLDivElement>(null);
  const aside     = useRef<HTMLElement>(null);
  const navRef    = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const overlay   = useRef<HTMLDivElement>(null);
  const burger    = useRef<HTMLButtonElement>(null);

  const activeHref = NAV.find((n) => pathname.startsWith(n.href))?.href;

  /* ── Sliding active-link indicator ──
     One lime block that travels between items instead of nine backgrounds
     switching on and off. `instant` on first paint so it doesn't fly in from
     the top of the list. */
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

      /* Measured against the nav, not the link's offsetParent: the links sit in
         an inner wrapper, so offsetTop would be short by the nav's padding. */
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
    { scope: root, dependencies: [activeHref] }
  );

  /* ── Menu reveal ──
     Desktop: the sidebar staggers in once on mount. Mobile: the panel slides,
     an overlay opens as a circle from the burger, and the items stagger behind
     it — the same timeline, replayed each time the menu opens. */
  useGSAP(
    () => {
      const panel = aside.current;
      const nav = navRef.current;
      if (!panel || !nav) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-nav-item]", nav);
      const isMobile = window.matchMedia(MOBILE).matches;

      if (prefersReducedMotion()) {
        gsap.set(items, { clearProps: "all" });
        gsap.set(panel, { xPercent: isMobile && !open ? -100 : 0 });
        return;
      }

      if (!isMobile) {
        /* The panel is laid out in flow at this width — strip any transform a
           previous mobile open/close left behind. */
        gsap.set(panel, { clearProps: "transform" });
        gsap.from(items, {
          x: -18,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.035,
        });
        return;
      }

      const tl = gsap.timeline();

      if (open) {
        const r = burger.current?.getBoundingClientRect();
        const x = r ? `${r.left + r.width / 2}px` : "0px";
        const y = r ? `${r.top + r.height / 2}px` : "0px";

        tl.set(overlay.current, { display: "block" })
          .fromTo(
            overlay.current,
            { clipPath: `circle(0% at ${x} ${y})` },
            { clipPath: `circle(150% at ${x} ${y})`, duration: 0.6, ease: "expo.out" }
          )
          .to(panel, { xPercent: 0, duration: 0.55, ease: "expo.out" }, 0.05)
          .from(items, { x: -24, autoAlpha: 0, duration: 0.4, ease: "power3.out", stagger: 0.04 }, 0.2);
      } else {
        tl.to(panel, { xPercent: -100, duration: 0.4, ease: "power3.in" })
          .to(overlay.current, { autoAlpha: 0, duration: 0.25 }, 0)
          .set(overlay.current, { display: "none", autoAlpha: 1, clipPath: "none" });
      }

      return () => tl.kill();
    },
    { scope: root, dependencies: [open] }
  );

  /* ── Hamburger → X ── */
  useGSAP(
    () => {
      const bars = gsap.utils.toArray<HTMLElement>("[data-burger-bar]", burger.current);
      if (bars.length !== 2) return;
      const d = prefersReducedMotion() ? 0 : 0.35;

      gsap.to(bars[0], { y: open ? 3.5 : 0, rotate: open ? 45 : 0, duration: d, ease: "power3.inOut" });
      gsap.to(bars[1], { y: open ? -3.5 : 0, rotate: open ? -45 : 0, duration: d, ease: "power3.inOut" });
    },
    { scope: root, dependencies: [open] }
  );

  return (
    <div
      ref={root}
      data-layout="dashboard"
      className="grain-overlay flex h-screen bg-[#050505] text-[#f2f4e8] overflow-hidden"
    >
      {/* ── Sidebar ── */}
      <aside
        ref={aside}
        className="
          fixed inset-y-0 left-0 z-50 w-64 panel border-r border-[#BFE01D]/15
          flex flex-col -translate-x-full lg:relative lg:translate-x-0 lg:flex
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-[#BFE01D]/15">
          <span className="h-2 w-2 rounded-full accent-dot" style={{ backgroundColor: ACC }} />
          <span className="font-display text-sm tracking-[0.35em] uppercase text-[#f2f4e8]">
            Fit Gym Center
          </span>
        </div>

        {/* Nav */}
        <nav ref={navRef} className="relative flex-1 overflow-y-auto py-4 px-3">
          {/* The travelling indicator, behind the links. */}
          <span
            ref={indicator}
            aria-hidden
            className="absolute left-3 right-3 top-0 rounded-sm"
            style={{ backgroundColor: ACC, visibility: "hidden" }}
          />

          <div className="relative space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === activeHref;
              return (
                <Link
                  key={href}
                  href={href}
                  data-nav-item
                  data-nav-active={active}
                  onClick={() => setOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-[0.2em]
                    transition-colors rounded-sm
                    ${active
                      ? "text-black font-bold"
                      : "text-[#9aa87a] hover:text-[#f2f4e8] hover:bg-[#BFE01D]/[0.06]"
                    }
                  `}
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
        <div className="px-4 py-4 border-t border-[#BFE01D]/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-black text-xs font-bold"
              style={{ backgroundColor: ACC }}>
              {session.user.name?.[0] ?? session.user.email?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#f2f4e8] truncate">{session.user.email}</p>
              <p className="text-[10px] text-[#9aa87a] uppercase tracking-widest">{session.user.role}</p>
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
      </aside>

      {/* Mobile overlay — opens as a circle from the burger. */}
      <div
        ref={overlay}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        style={{ display: "none" }}
      />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="relative flex items-center gap-4 px-5 py-4 border-b border-[#BFE01D]/15 bg-[#050505]/80 backdrop-blur-sm shrink-0">
          <button
            ref={burger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden relative h-5 w-6 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            <span data-burger-bar className="absolute left-0 top-[7px] block h-[1.5px] w-6 bg-current" />
            <span data-burger-bar className="absolute left-0 top-[14px] block h-[1.5px] w-6 bg-current" />
          </button>

          <div className="flex-1" />

          <ScrollProgress targetId={SCROLL_ID} variant="ring" className="hidden sm:block" />
          <NotificationBell />
          <span className="label text-[#9aa87a]">
            {new Date().toLocaleDateString("en-BD", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>

          {/* Page scroll progress, hairline along the bottom of the bar. */}
          <ScrollProgress
            targetId={SCROLL_ID}
            className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
          />
        </header>

        {/* Page content */}
        <main id={SCROLL_ID} className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>

        <BackToTop targetId={SCROLL_ID} />
      </div>
    </div>
  );
}
