"use client";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, User, LogOut } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MagneticBox from "@/components/motion/MagneticBox";
import BackToTop from "@/components/motion/BackToTop";

const ACC = "#BFE01D";
const NAV = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/membership",  label: "Membership",  icon: CreditCard      },
  { href: "/payments",    label: "Payments",    icon: CreditCard      },
  { href: "/profile",     label: "Profile",     icon: User            },
];

export default function CustomerShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { user: { email?: string | null; name?: string | null } };
}) {
  const pathname = usePathname();
  const root  = useRef<HTMLDivElement>(null);
  const topNav = useRef<HTMLDivElement>(null);
  const tabNav = useRef<HTMLDivElement>(null);

  const activeHref = NAV.find((n) => pathname.startsWith(n.href))?.href;

  /* Two underlines — one per nav — slide to whichever item is active. Both are
     driven from the same measurement pass so they never disagree. */
  const placed = useRef(false);
  useGSAP(
    () => {
      const move = (wrap: HTMLElement | null) => {
        if (!wrap) return;
        const bar = wrap.querySelector<HTMLElement>("[data-indicator]");
        const active = wrap.querySelector<HTMLElement>('[data-nav-active="true"]');
        if (!bar) return;

        if (!active) {
          gsap.set(bar, { autoAlpha: 0 });
          return;
        }

        const wrapRect = wrap.getBoundingClientRect();
        const rect = active.getBoundingClientRect();
        const to = {
          x: rect.left - wrapRect.left,
          width: rect.width,
          autoAlpha: 1,
        };
        if (!placed.current || prefersReducedMotion()) gsap.set(bar, to);
        else gsap.to(bar, { ...to, duration: 0.45, ease: "expo.out" });
      };

      move(topNav.current);
      move(tabNav.current);
      placed.current = true;
    },
    { scope: root, dependencies: [activeHref] }
  );

  return (
    <div
      ref={root}
      data-layout="dashboard"
      className="grain-overlay min-h-screen bg-[#050505] text-[#f2f4e8]"
    >
      {/* top nav */}
      <header className="sticky top-0 z-50 border-b border-[#BFE01D]/15 bg-[#050505]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full accent-dot" style={{ backgroundColor: ACC }} />
            <span className="font-display text-sm tracking-[0.35em] uppercase">Iron House</span>
          </div>
          <div className="flex items-center gap-1">
            <div ref={topNav} className="relative flex items-center gap-1">
              <span
                data-indicator
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] rounded-full"
                style={{ backgroundColor: ACC, visibility: "hidden" }}
              />
              {NAV.map(({ href, icon: Icon, label }) => (
                <MagneticBox key={href} strength={0.3}>
                  <Link
                    href={href}
                    aria-label={label}
                    data-nav-active={href === activeHref}
                    className={`p-2 rounded-sm transition-colors ${
                      href === activeHref ? "text-[#BFE01D]" : "text-[#9aa87a] hover:text-[#f2f4e8]"
                    }`}
                  >
                    <Icon size={18} />
                  </Link>
                </MagneticBox>
              ))}
            </div>
            <MagneticBox>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-[#9aa87a] hover:text-[#f2f4e8] transition-colors ml-1">
                <LogOut size={18} />
              </button>
            </MagneticBox>
          </div>
        </div>

        {/* read progress for the page below */}
        <ScrollProgress className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden" />
      </header>

      {/* bottom tab nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#BFE01D]/15 bg-[#050505]/95 backdrop-blur md:hidden">
        <div ref={tabNav} className="relative grid grid-cols-4">
          <span
            data-indicator
            aria-hidden
            className="absolute top-0 left-0 h-[2px] rounded-full"
            style={{ backgroundColor: ACC, visibility: "hidden" }}
          />
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === activeHref;
            return (
              <Link key={href} href={href}
                data-nav-active={active}
                className={`flex flex-col items-center gap-1 py-3 text-[9px] uppercase tracking-[0.2em] transition-colors
                  ${active ? "text-[#BFE01D]" : "text-[#9aa87a]"}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* content */}
      <main className="mx-auto max-w-3xl px-5 py-8 pb-24 md:pb-8">
        {children}
      </main>

      <BackToTop className="bottom-20 md:bottom-6" />
    </div>
  );
}
