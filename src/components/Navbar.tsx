"use client";
import { useState, useEffect } from "react";
const ACC = "#BFE01D";

const LINKS = ["Experience", "Trainers", "Membership", "Offers", "Contact"];

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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Lock body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{ top: "var(--offer-bar-h, 0px)" }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "backdrop-blur-md bg-[#050505]/90 border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
          {/* Wordmark */}
          <a href="#top" className="flex shrink-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
            <DumbbellIcon />
            <span className="whitespace-nowrap font-display text-lg tracking-widest">
              IRON HOUSE
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden shrink-0 items-center gap-5 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-[#bdbdbd] lg:flex xl:gap-8 xl:tracking-[0.24em]">
            {LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <a
              href="#contact"
              className="hidden lg:inline-flex group relative items-center gap-2 border border-[#BFE01D] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#BFE01D] transition-colors hover:bg-[#BFE01D] hover:text-black"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#BFE01D] group-hover:bg-black" />
              Book Free Trial
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative h-5 w-6 lg:hidden text-white"
            >
              <span
                className="absolute left-0 block h-[1.5px] w-6 bg-current transition-all duration-300"
                style={{ top: menuOpen ? "50%" : "30%", transform: menuOpen ? "translateY(-50%) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 block h-[1.5px] bg-current transition-all duration-300"
                style={{ top: "50%", width: menuOpen ? 0 : "1.5rem", transform: "translateY(-50%)", opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-[1.5px] w-6 bg-current transition-all duration-300"
                style={{ top: menuOpen ? "50%" : "70%", transform: menuOpen ? "translateY(-50%) rotate(-45deg)" : "none" }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col bg-[#050505] transition-all duration-500 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ paddingTop: "calc(var(--offer-bar-h, 0px) + 4.5rem)" }}
      >
        <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8 pb-20">
          {LINKS.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="w-full border-b border-[#1a1a1a] py-5 font-display text-4xl uppercase tracking-tight text-white transition-colors hover:text-[#BFE01D]"
              style={{
                transitionDelay: menuOpen ? `${i * 55}ms` : "0ms",
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                opacity: menuOpen ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 55}ms, transform 0.4s ease ${i * 55}ms, color 0.2s`,
              }}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-8 inline-flex items-center gap-2 bg-[#BFE01D] px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-black"
            style={{
              transitionDelay: menuOpen ? `${LINKS.length * 55}ms` : "0ms",
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.4s ease ${LINKS.length * 55}ms, transform 0.4s ease ${LINKS.length * 55}ms`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Book Free Trial
          </a>
        </nav>
      </div>
    </>
  );
}
