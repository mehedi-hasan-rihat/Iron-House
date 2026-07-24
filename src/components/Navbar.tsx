"use client";
import { useState, useEffect } from "react";

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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-[#050505]/70 border-b border-[#1a1a1a]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        {/* Wordmark */}
        <a href="#top" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#BFE01D] accent-dot" />
          <span className="font-display text-lg tracking-widest">FIT GYM CENTER</span>
        </a>

        {/* Nav links */}
        <nav className="hidden items-center gap-9 text-xs uppercase tracking-[0.24em] text-[#bdbdbd] md:flex">
          {["Experience","Programs","Trainers","Membership","Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition">
              {l}
            </a>
          ))}
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
