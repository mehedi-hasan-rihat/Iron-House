"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ACC = "#BFE01D";

const DumbbellIcon = () => (
  <div style={{ transform: "rotate(315deg)", display: "flex", alignItems: "center" }}>
    <svg width="28" height="28" viewBox="-2 7 32 14" fill="none">
      <circle cx="0"  cy="14" r="6"   fill={ACC} />
      <circle cx="0"  cy="14" r="3.5" fill="#050505" fillOpacity="0.35" />
      <rect x="5"  y="11.5" width="4"  height="5" rx="1" fill={ACC} fillOpacity="0.8" />
      <rect x="9"  y="12.5" width="10" height="3" rx="1.5" fill={ACC} fillOpacity="0.95" />
      <rect x="19" y="11.5" width="4"  height="5" rx="1" fill={ACC} fillOpacity="0.8" />
      <circle cx="28" cy="14" r="6"   fill={ACC} />
      <circle cx="28" cy="14" r="3.5" fill="#050505" fillOpacity="0.35" />
    </svg>
  </div>
);

export default function NavbarSmart({
  isLoggedIn,
  dashboardHref,
}: {
  isLoggedIn: boolean;
  dashboardHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-[#050505]/70 border-b border-[#1a1a1a]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        {/* Wordmark */}
        <a href="#top" className="flex items-center gap-2">
          <DumbbellIcon />
          <span className="font-display text-lg tracking-widest">FIT GYM CENTER</span>
        </a>

        {/* Nav links */}
        <nav className="hidden items-center gap-9 text-xs uppercase tracking-[0.24em] text-[#bdbdbd] md:flex">
          {["Experience", "Programs", "Trainers", "Membership", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition">
              {l}
            </a>
          ))}
        </nav>

        {/* CTA — swaps based on login state */}
        {isLoggedIn ? (
          <Link
            href={dashboardHref}
            className="group relative inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-black"
            style={{
              borderColor: ACC,
              color:       ACC,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = ACC;
              (e.currentTarget as HTMLElement).style.color = "#050505";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = ACC;
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACC }} />
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors"
            style={{ borderColor: ACC, color: ACC }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = ACC;
              (e.currentTarget as HTMLElement).style.color = "#050505";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = ACC;
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACC }} />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
