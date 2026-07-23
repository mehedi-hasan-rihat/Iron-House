"use client";
import { useEffect, useRef, useState } from "react";

const plans = [
  { name: "MONTHLY",   price: "3,500",  period: "/ mo",  features: ["Full floor access", "Locker & steam", "Group classes"],                                     featured: false },
  { name: "QUARTERLY", price: "9,600",  period: "/ 3mo", features: ["Everything in Monthly", "1 PT session", "Nutrition consult"],                               featured: false },
  { name: "HALF-YEAR", price: "18,000", period: "/ 6mo", features: ["Everything in Quarterly", "3 PT sessions", "Body composition scan"], badge: "MOST CHOSEN",  featured: true  },
  { name: "ANNUAL",    price: "32,000", period: "/ yr",  features: ["Everything in Half-Year", "12 PT sessions", "Priority booking"],                            featured: false },
];

export default function Membership() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="membership" className="bg-[#0a0a0a] py-32 md:py-40 px-8 md:px-16">

      {/* Header */}
      <div
        className="mb-20 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
      >
        <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-6">07 — MEMBERSHIP</p>
        <div className="flex items-end justify-between flex-wrap gap-6 border-b border-[#141414] pb-10">
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.04em" }}
          >
            PICK YOUR<br />PACE.
          </h2>
          <p className="text-[#333] text-xs leading-6 max-w-xs pb-2">
            Prices in BDT. No hidden fees.<br />Cancel anytime with 30 days notice.
          </p>
        </div>
      </div>

      {/* Plans — horizontal list on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#111]">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`relative flex flex-col border-b md:border-b-0 border-r border-[#111] last:border-r-0 pt-12 pb-10 px-8 group transition-all duration-700 ${p.featured ? "bg-[#0d0d0d]" : "hover:bg-[#0c0c0c]"}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transitionDelay: visible ? `${i * 80}ms` : "0ms",
            }}
          >
            {/* Badge */}
            {p.badge && (
              <span className="absolute top-5 right-5 text-[7px] tracking-[0.4em] text-black bg-[#c8a96e] px-2 py-0.5 font-bold">
                {p.badge}
              </span>
            )}

            <p className="text-[8px] tracking-[0.45em] text-[#c8a96e] mb-8">{p.name}</p>

            <div className="mb-8">
              <span className="text-[9px] text-[#555] align-top mt-2 mr-0.5">৳</span>
              <span
                className="font-black text-white leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
              >
                {p.price}
              </span>
              <span className="text-[10px] text-[#333] ml-1.5 tracking-widest">{p.period}</span>
            </div>

            {/* Feature list — minimal */}
            <ul className="flex-1 space-y-3 mb-10">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[11px] text-[#444]">
                  <span className="text-[#c8a96e] mt-px text-[9px]">—</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA — underline style */}
            <a
              href="https://wa.me/8801700000000"
              className={`group/btn relative inline-flex text-[9px] tracking-[0.4em] transition-colors duration-300 ${
                p.featured ? "text-[#c8a96e] hover:text-white" : "text-[#333] hover:text-white"
              }`}
            >
              GET STARTED
              <span className={`absolute -bottom-0.5 left-0 h-px transition-all duration-400 ${p.featured ? "w-full bg-[#c8a96e] group-hover/btn:bg-white" : "w-0 bg-white group-hover/btn:w-full"}`} />
            </a>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 delay-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="text-[11px] text-[#2a2a2a] leading-6">
          The best way to decide is to feel it. Come tour the floor before you commit.
        </p>
        <a
          href="#contact"
          className="group relative text-[9px] tracking-[0.4em] text-[#444] hover:text-white transition-colors duration-300 whitespace-nowrap"
        >
          VISIT OUR GYM
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c8a96e] group-hover:w-full transition-all duration-400" />
        </a>
      </div>
    </section>
  );
}
