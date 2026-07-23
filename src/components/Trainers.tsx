"use client";
import { useEffect, useRef, useState } from "react";

const trainers = [
  { num: "01", name: "RAKIB HASAN",    role: "Head Strength Coach",   certs: "NASM-CPT · 8 YRS",      img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg" },
  { num: "02", name: "AYESHA RAHMAN",  role: "Women's Fitness Lead",  certs: "ACE · PRE/POST-NATAL",  img: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg" },
  { num: "03", name: "TANVEER AHMED",  role: "Performance Coach",     certs: "ISSA · NUTRITION",      img: "https://iron-house.lovable.app/assets/trainer-3-3mi-LptE.jpg" },
];

export default function Trainers() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="trainers" className="bg-[#0a0a0a] py-32 md:py-40 overflow-hidden">

      <div className="px-8 md:px-16 mb-20">
        <div
          className="flex items-end justify-between border-b border-[#141414] pb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <div>
            <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-5">05 — THE COACHES</p>
            <h2
              className="font-black text-white leading-none"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6.5rem)", letterSpacing: "-0.035em" }}
            >
              THE PEOPLE<br />
              BEHIND<br />
              THE REPS.
            </h2>
          </div>
          <p className="text-[8px] tracking-[0.5em] text-[#222] pb-2 hidden md:block">03 / 12</p>
        </div>
      </div>

      {/* Trainers — wide asymmetric layout, not a 3-col card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {trainers.map((t, i) => (
          <div
            key={t.num}
            className={`group relative overflow-hidden transition-all duration-700 ${i < 2 ? "md:border-r border-[#111]" : ""}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(40px)",
              transitionDelay: visible ? `${i * 150}ms` : "0ms",
            }}
          >
            {/* Photograph — grayscale, colour on hover */}
            <div className="overflow-hidden" style={{ paddingBottom: i === 1 ? "140%" : "120%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.img}
                alt={t.name}
                className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>

            {/* Overlay — bottom only */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, #0a0a0a 0%, #0a0a0a50 30%, transparent 60%)" }} />

            {/* Name block */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <p className="text-[8px] tracking-widest text-[#c8a96e] mb-2">{t.num}</p>
              <h3
                className="font-black text-white leading-none mb-1"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", letterSpacing: "-0.02em" }}
              >
                {t.name}
              </h3>
              <p className="text-[11px] text-[#666] tracking-wide">{t.role}</p>
              <p className="text-[9px] tracking-[0.3em] text-[#c8a96e] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                {t.certs}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
