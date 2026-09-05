"use client";
import { useState, useEffect } from "react";
const ACC = "#BFE01D";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      /* `--offer-bar-h` is owned by OfferBar; it falls back to 0 on pages that
         do not render one, and returns to 0 when the bar is dismissed. */
      style={{ top: "var(--offer-bar-h, 0px)" }}
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-[#050505]/70 border-b border-[#1a1a1a]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        {/* Wordmark */}
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <div
            style={{
              width: 28,
              height: 28,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/*
          Dumbbell drawn already rotated 45°.
          We draw it in a 24×24 coordinate space,
          rotated so the bar runs NW→SE.

          Bar centre: (12,12), length 16px along X before rotation.
          After rotate(45deg): bar runs diagonally.
        */}
            <div
              style={{
                transform: "rotate(315deg)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="28" height="28" viewBox="-2 7 32 14" fill="none">
                {/* ── left head (2 stacked circles) ── */}
                <circle cx="0" cy="14" r="6" fill={ACC} />
                <circle
                  cx="0"
                  cy="14"
                  r="3.5"
                  fill="#050505"
                  fillOpacity="0.35"
                />

                {/* ── left collar ── */}
                <rect
                  x="5"
                  y="11.5"
                  width="4"
                  height="5"
                  rx="1"
                  fill={ACC}
                  fillOpacity="0.8"
                />

                {/* ── bar ── */}
                <rect
                  x="9"
                  y="12.5"
                  width="10"
                  height="3"
                  rx="1.5"
                  fill={ACC}
                  fillOpacity="0.95"
                />

                {/* ── right collar ── */}
                <rect
                  x="19"
                  y="11.5"
                  width="4"
                  height="5"
                  rx="1"
                  fill={ACC}
                  fillOpacity="0.8"
                />

                {/* ── right head ── */}
                <circle cx="28" cy="14" r="6" fill={ACC} />
                <circle
                  cx="28"
                  cy="14"
                  r="3.5"
                  fill="#050505"
                  fillOpacity="0.35"
                />
              </svg>
            </div>
          </div>
          <span className="whitespace-nowrap font-display text-lg tracking-widest">
            IRON HOUSE
          </span>
        </a>

        {/* Nav links. Six items no longer fit at tablet widths on the old
            gap-9 / md: pairing, so the row opens later and tightens up. */}
        <nav className="hidden shrink-0 items-center gap-5 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-[#bdbdbd] lg:flex xl:gap-8 xl:tracking-[0.24em]">
          {["Experience", "Programs", "Trainers", "Membership", "Offers", "Contact"].map(
            (l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-white transition"
              >
                {l}
              </a>
            ),
          )}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="group relative inline-flex items-center gap-2 border border-[#BFE01D] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#BFE01D] transition-colors hover:bg-[#BFE01D] hover:text-black"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#BFE01D] group-hover:bg-black" />
          Book Free Trial
        </a>
      </div>
    </header>
  );
}
