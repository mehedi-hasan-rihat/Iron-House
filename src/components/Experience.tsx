"use client";
import { useState, useEffect, useRef } from "react";

const rooms = [
  { num: "01", name: "Reception",       desc: "A quiet arrival. Concrete, warm light, black marble.",  img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { num: "02", name: "Strength Floor",  desc: "Rogue racks, calibrated plates, full-mirror walls.",    img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg" },
  { num: "03", name: "Cardio Deck",     desc: "Technogym line, panoramic city view.",                  img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { num: "04", name: "Combat Room",     desc: "Heavy bags, ring, private coaching.",                   img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg" },
  { num: "05", name: "Women's Studio",  desc: "Female-only training hours & coaches.",                 img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg" },
];

export default function Experience() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="experience" className="bg-[#0a0a0a] py-32 md:py-40">
      <div className="px-8 md:px-16">

        {/* Editorial header — index + large title side by side */}
        <div className="flex items-end justify-between mb-20 border-b border-[#141414] pb-8">
          <div
            className="transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
          >
            <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-4">02 — STEP INSIDE</p>
            <h2
              className="font-black text-white leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 8rem)", letterSpacing: "-0.04em" }}
            >
              THE<br />EXPERIENCE
            </h2>
          </div>
          <p
            className="text-[8px] tracking-[0.5em] text-[#2a2a2a] pb-2 hidden md:block transition-all duration-700 delay-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {String(active + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
          </p>
        </div>

        {/* Full-bleed image + list — no max-width container */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px] gap-0 items-stretch">

          {/* Image — no border, just raw photo */}
          <div
            className="relative overflow-hidden transition-all duration-700 delay-100"
            style={{ minHeight: 480, opacity: visible ? 1 : 0 }}
          >
            {rooms.map((r, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={r.img}
                alt={r.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            {/* Active room name stamped on image */}
            <div className="absolute bottom-8 left-8 pointer-events-none">
              <p className="text-[9px] tracking-[0.4em] text-white/30">{rooms[active].num}</p>
              <p className="text-white font-black text-xl tracking-wide">{rooms[active].name}</p>
            </div>
          </div>

          {/* Room list — flush right */}
          <div
            className="border-l border-[#141414] transition-all duration-700 delay-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {rooms.map((r, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-full group flex items-start gap-5 px-8 py-7 border-b border-[#141414] last:border-b-0 text-left transition-colors hover:bg-[#0d0d0d]"
              >
                <span className={`text-[8px] tracking-widest pt-0.5 shrink-0 transition-colors ${i === active ? "text-[#c8a96e]" : "text-[#2a2a2a]"}`}>
                  {r.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs tracking-[0.2em] font-bold mb-1.5 transition-colors ${i === active ? "text-white" : "text-[#3a3a3a] group-hover:text-[#666]"}`}>
                    {r.name.toUpperCase()}
                  </p>
                  <p className={`text-[11px] leading-5 transition-all duration-300 ${i === active ? "text-[#555] max-h-10 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    {r.desc}
                  </p>
                </div>
                <span className={`text-xs pt-0.5 shrink-0 transition-all duration-300 ${i === active ? "text-[#c8a96e] translate-x-0" : "text-[#222] group-hover:translate-x-1"}`}>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
