"use client";
import { useEffect, useRef, useState } from "react";

const channels = [
  { label: "CALL",      value: "+880 1700 000 000",  href: "tel:+8801700000000",                             external: false },
  { label: "WHATSAPP",  value: "+880 1700 000 000",  href: "https://wa.me/8801700000000",                    external: false },
  { label: "INSTAGRAM", value: "@ironhouse.dhk",     href: "https://instagram.com/ironhouse.dhk",            external: true  },
  { label: "FACEBOOK",  value: "/ironhousebd",       href: "https://facebook.com/ironhousebd",               external: true  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="contact" className="bg-[#0a0a0a] overflow-hidden">

      {/* Full-bleed closing image */}
      <div className="relative w-full" style={{ height: "55vh", minHeight: 340 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg"
          alt="IRON HOUSE strength floor"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.25)" }}
        />
        {/* Large closing statement stamped on image */}
        <div className="absolute inset-0 flex items-end px-8 md:px-16 pb-14 pointer-events-none">
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(3.5rem, 12vw, 13rem)", letterSpacing: "-0.04em" }}
          >
            DISCIPLINE<br />
            <span style={{ WebkitTextStroke: "1px #c8a96e", color: "transparent" }}>BEGINS</span><br />
            HERE.
          </h2>
        </div>
      </div>

      {/* Contact grid below image */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-[#141414] transition-all duration-700"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Channel list */}
        <div className="lg:col-span-2 border-r border-[#111] px-8 md:px-16 py-16">
          <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-10">09 — COME IN</p>
          <div className="space-y-0">
            {channels.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-8 py-5 border-b border-[#0f0f0f] group transition-colors"
              >
                <span className="text-[8px] tracking-[0.45em] text-[#c8a96e] w-20 shrink-0">{c.label}</span>
                <span className="text-sm text-[#333] group-hover:text-white transition-colors duration-300 tracking-wide">{c.value}</span>
                <span className="ml-auto text-[#1a1a1a] group-hover:text-[#c8a96e] group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 mt-12">
            <a
              href="https://wa.me/8801700000000"
              className="group relative inline-flex items-center text-[9px] tracking-[0.45em] text-white hover:text-[#c8a96e] transition-colors duration-300"
            >
              <span className="mr-3 w-8 h-px bg-white group-hover:bg-[#c8a96e] transition-colors duration-300 shrink-0" />
              BOOK FREE TRIAL
            </a>
            <a
              href="https://maps.google.com/?q=Gulshan+2+Dhaka"
              target="_blank" rel="noopener noreferrer"
              className="group relative inline-flex items-center text-[9px] tracking-[0.45em] text-[#333] hover:text-white transition-colors duration-300"
            >
              <span className="mr-3 w-8 h-px bg-[#333] group-hover:bg-white transition-colors duration-300 shrink-0" />
              GET DIRECTIONS
            </a>
          </div>
        </div>

        {/* Address & hours */}
        <div className="px-8 md:px-12 py-16 flex flex-col gap-12">
          <div>
            <p className="text-[8px] tracking-[0.5em] text-[#2a2a2a] mb-5">ADDRESS</p>
            <p className="text-sm text-[#444] leading-7">
              House 42, Road 11<br />
              Gulshan 2, Dhaka 1212<br />
              Bangladesh
            </p>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.5em] text-[#2a2a2a] mb-5">HOURS</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#3a3a3a] tracking-wide">Sat – Thu</span>
                <span className="text-[11px] text-[#555]">06:00 — 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#3a3a3a] tracking-wide">Friday</span>
                <span className="text-[11px] text-[#555]">15:00 — 22:00</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.5em] text-[#2a2a2a] mb-5">COORDINATES</p>
            <p className="text-[11px] text-[#333] tracking-wide leading-5">
              N 23.7925°<br />E 90.4155°
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
