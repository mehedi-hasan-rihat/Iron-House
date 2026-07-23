"use client";
import { useEffect, useRef, useState } from "react";

const programs = [
  { code: "P01", title: "WEIGHT LOSS",       desc: "12-week body recomposition.",       img: "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg"   },
  { code: "P02", title: "MUSCLE BUILDING",   desc: "Hypertrophy split, overload.",      img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg"   },
  { code: "P03", title: "STRENGTH",          desc: "Squat, bench, deadlift.",           img: "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg"   },
  { code: "P04", title: "FUNCTIONAL",        desc: "Mobility, movement, athleticism.",  img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg"   },
  { code: "P05", title: "HIIT & CARDIO",     desc: "Fat burn, VO₂ max.",               img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg"   },
  { code: "P06", title: "WOMEN'S FITNESS",   desc: "Female-only studio & coaching.",    img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg"   },
  { code: "P07", title: "PERSONAL TRAINING", desc: "1-on-1 certified coaching.",        img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg"},
  { code: "P08", title: "SENIOR FITNESS",    desc: "Low-impact, joint-safe.",           img: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg"},
];

export default function Programs() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="programs" className="bg-[#0a0a0a] py-32 md:py-40">

      {/* Section header */}
      <div
        className="px-8 md:px-16 mb-20 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
      >
        <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-6">04 — PROGRAMS</p>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", letterSpacing: "-0.04em" }}
          >
            TRAINED FOR<br />
            <span className="text-[#c8a96e]">WHATEVER.</span>
          </h2>
          <p className="text-[#3a3a3a] text-xs leading-6 max-w-xs pb-2">
            Eight signature tracks. Every one built around your goal, your body, your schedule.
          </p>
        </div>
      </div>

      {/* Editorial program list — NOT a card grid */}
      <div className="border-t border-[#111]">
        {programs.map((p, i) => (
          <div
            key={p.code}
            className="group relative border-b border-[#111] overflow-hidden cursor-default transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transitionDelay: visible ? `${i * 50}ms` : "0ms",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Background image — only visible on hover */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
            />

            <div className="relative flex items-center gap-8 px-8 md:px-16 py-7">
              <span className={`text-[8px] tracking-widest w-8 shrink-0 transition-colors duration-300 ${hovered === i ? "text-[#c8a96e]" : "text-[#222]"}`}>
                {p.code}
              </span>
              <h3
                className={`font-black flex-1 leading-none transition-colors duration-300 ${hovered === i ? "text-white" : "text-[#2a2a2a]"}`}
                style={{ fontSize: "clamp(1.4rem, 4vw, 3.5rem)", letterSpacing: "-0.025em" }}
              >
                {p.title}
              </h3>
              <p className={`text-[11px] text-[#555] tracking-wide hidden md:block max-w-[180px] text-right transition-opacity duration-300 ${hovered === i ? "opacity-100" : "opacity-0"}`}>
                {p.desc}
              </p>
              <span className={`text-xs shrink-0 transition-all duration-300 ${hovered === i ? "text-[#c8a96e] translate-x-0" : "text-[#1a1a1a] -translate-x-2"}`}>
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
