"use client";
import { useEffect, useRef, useState } from "react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Subtle parallax on scroll
  useEffect(() => {
    const fn = () => {
      if (!imgRef.current || !ref.current) return;
      const rect   = ref.current.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      imgRef.current.style.transform = `translateY(${progress * 60}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section ref={ref} id="about" className="bg-[#0a0a0a] overflow-hidden">

      {/* Full-bleed editorial row — image left, text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* ── Left: full-height photograph ── */}
        <div className="relative overflow-hidden" style={{ minHeight: "60vw" }}>
          <div ref={imgRef} className="absolute inset-0 will-change-transform" style={{ top: "-10%", bottom: "-10%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg"
              alt="Trainer coaching an athlete"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Right-edge fade to merge with text column */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent 60%, #0a0a0a)" }}
          />
          {/* Section index */}
          <div className="absolute top-16 left-8 md:left-12">
            <p className="text-[8px] tracking-[0.55em] text-[#c8a96e]">01</p>
            <div className="w-px h-10 bg-[#c8a96e]/40 mt-2" />
          </div>
        </div>

        {/* ── Right: editorial copy, vertically centered ── */}
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24 lg:py-0">

          <p
            className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-12 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
          >
            THE HOUSE
          </p>

          <h2
            className="font-black text-white leading-[0.9] mb-12 transition-all duration-700 delay-100"
            style={{
              fontSize: "clamp(3rem, 6vw, 6rem)",
              letterSpacing: "-0.03em",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
            }}
          >
            NOT A GYM.<br />
            <span className="text-[#c8a96e]">A STANDARD.</span>
          </h2>

          <div
            className="space-y-5 mb-16 transition-all duration-700 delay-200"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
          >
            <p className="text-[#555] leading-7 text-sm max-w-sm">
              We built IRON HOUSE for the people who show up when nobody&apos;s watching.
              For the ones who understand that transformation isn&apos;t loud — it&apos;s consistent.
            </p>
            <p className="text-[#444] leading-7 text-sm max-w-sm">
              International equipment. Certified coaches. A community that lifts each other — literally.
              Raising the standard of what fitness should feel like in Bangladesh.
            </p>
          </div>

          {/* Four pillars — horizontal rule list, no cards */}
          <div
            className="transition-all duration-700 delay-300"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
          >
            {[
              { n: "01", t: "Discipline"  },
              { n: "02", t: "Coaching"    },
              { n: "03", t: "Equipment"   },
              { n: "04", t: "Community"   },
            ].map((p, i) => (
              <div key={p.n} className={`flex items-center gap-6 py-4 ${i < 3 ? "border-b border-[#141414]" : ""}`}>
                <span className="text-[8px] tracking-widest text-[#c8a96e] w-5 shrink-0">{p.n}</span>
                <span className="text-xs tracking-[0.25em] text-[#777]">{p.t.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
