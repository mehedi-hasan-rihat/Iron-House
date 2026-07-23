"use client";
import { useState, useEffect } from "react";

const links = [
  { href: "#experience", label: "EXPERIENCE" },
  { href: "#programs",   label: "PROGRAMS"   },
  { href: "#trainers",   label: "TRAINERS"   },
  { href: "#membership", label: "MEMBERSHIP" },
  { href: "#contact",    label: "CONTACT"    },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[#ffffff08] bg-[#0a0a0a]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-8 md:px-16">

        {/* Wordmark */}
        <a href="#" className="text-white font-black tracking-[0.25em] text-sm">
          IRON HOUSE
        </a>

        {/* Desktop links — very thin, almost invisible */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[9px] tracking-[0.4em] text-[#555] hover:text-white transition-colors duration-300"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c8a96e] group-hover:w-full transition-all duration-400" />
            </a>
          ))}
        </nav>

        {/* Single accent CTA */}
        <a
          href="https://wa.me/8801700000000"
          className="hidden md:inline-flex group relative text-[9px] tracking-[0.4em] text-[#c8a96e] hover:text-white transition-colors duration-300"
        >
          JOIN NOW
          <span className="absolute -bottom-0.5 left-0 h-px w-full bg-[#c8a96e] group-hover:bg-white transition-colors duration-300" />
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"}`} />
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-3"}`} />
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="border-t border-[#ffffff08] px-8 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[9px] tracking-[0.45em] text-[#555] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/8801700000000"
            onClick={() => setMenuOpen(false)}
            className="text-[9px] tracking-[0.45em] text-[#c8a96e] mt-2"
          >
            JOIN NOW →
          </a>
        </div>
      </div>
    </header>
  );
}
