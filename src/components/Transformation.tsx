"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 3240, suffix: "+", label: "MEMBERS"      },
  { value: 12,   suffix: "",  label: "TRAINERS"      },
  { value: 8,    suffix: "+", label: "YEARS"         },
  { value: 98,   suffix: "%", label: "SATISFACTION"  },
];

function useCountUp(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const dur   = 1800;
    const start = performance.now();
    const tick  = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4); // ease-out-quart
      setVal(Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return val;
}

function Stat({ stat }: { stat: typeof stats[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const val = useCountUp(stat.value, active);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="border-r border-[#111] last:border-r-0 px-8 py-10 flex-1 min-w-0">
      <p className="font-black text-white leading-none mb-2" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}>
        {val.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-[8px] tracking-[0.5em] text-[#333]">{stat.label}</p>
    </div>
  );
}

export default function Transformation() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 md:py-40 overflow-hidden">

      {/* Full-bleed: image left, quote right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] mb-0">

        {/* Before/After — raw, no cards */}
        <div
          className="grid grid-cols-2 gap-px bg-[#111] transition-all duration-700"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className="relative overflow-hidden" style={{ minHeight: 480 }}>
            <div className="absolute top-5 left-5 z-10 text-[8px] tracking-[0.4em] text-[#666]">BEFORE</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg"
              alt="Before"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute top-5 left-5 z-10 text-[8px] tracking-[0.4em] text-[#c8a96e]">AFTER</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg"
              alt="After"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Quote column */}
        <div
          className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 lg:py-0 transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(40px)" }}
        >
          <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-12">06 — TRANSFORMATION</p>

          {/* Hero number */}
          <div className="mb-8">
            <span
              className="font-black text-white leading-none"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "-0.05em" }}
            >
              −18
            </span>
            <span
              className="font-black text-[#c8a96e] leading-none"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
            >
              KG
            </span>
            <p className="text-[#444] text-sm tracking-[0.2em] mt-2">IN 22 WEEKS.</p>
          </div>

          <blockquote className="text-[#444] text-sm leading-8 mb-10 max-w-xs border-l border-[#1f1f1f] pl-6">
            &ldquo;I walked in tired of my body. I walked out with something I built.
            IRON HOUSE didn&apos;t just change my weight — it changed my discipline.&rdquo;
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-7 h-7 rounded-full border border-[#c8a96e] flex items-center justify-center text-[10px] font-black text-[#c8a96e]">S</div>
            <div>
              <p className="text-xs font-bold text-white tracking-wider">Sadia Karim</p>
              <p className="text-[8px] tracking-[0.4em] text-[#333] mt-0.5">MEMBER · 2 YEARS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar — full width, flush */}
      <div className="border-t border-[#111] flex flex-wrap">
        {stats.map((s) => <Stat key={s.label} stat={s} />)}
      </div>
    </section>
  );
}
