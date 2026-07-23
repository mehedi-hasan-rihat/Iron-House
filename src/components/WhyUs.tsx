"use client";
import { useEffect, useRef, useState } from "react";

const reasons = [
  { num: "01", title: "INTERNATIONAL EQUIPMENT",  desc: "Rogue · Technogym · Hammer Strength."   },
  { num: "02", title: "CERTIFIED TRAINERS",        desc: "ACE, NASM & ISSA certified coaches."    },
  { num: "03", title: "WOMEN'S FITNESS",           desc: "Female-only hours, female trainers."    },
  { num: "04", title: "FUNCTIONAL TRAINING",       desc: "TRX, rigs, plyo, mobility zone."        },
  { num: "05", title: "NUTRITION PLANNING",        desc: "Custom diet plans by dietitians."       },
  { num: "06", title: "LOCKER · STEAM · PARKING",  desc: "Full amenities, secured parking."       },
  { num: "07", title: "24/7 SECURITY",             desc: "CCTV, keycard access, on-site staff."   },
];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 md:py-40 px-8 md:px-16">

      {/* Two-column header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 border-b border-[#141414] pb-16">
        <div
          className="transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
        >
          <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-6">03 — WHY IRON HOUSE</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", letterSpacing: "-0.035em" }}
          >
            EVERYTHING<br />
            YOU EXPECT.<br />
            <span className="text-[#c8a96e]">AND MORE.</span>
          </h2>
        </div>
        <div
          className="flex items-end transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
        >
          <p className="text-[#3a3a3a] text-sm leading-7 max-w-xs">
            Seven reasons Dhaka&apos;s most committed athletes call this home.
            Not perks — standards.
          </p>
        </div>
      </div>

      {/* Horizontal rule list — luxury magazine style */}
      <div>
        {reasons.map((r, i) => (
          <div
            key={r.num}
            className={`group flex items-center gap-8 py-6 border-b border-[#111] transition-all duration-700 cursor-default hover:border-[#1f1f1f]`}
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transitionDelay: visible ? `${i * 60}ms` : "0ms",
            }}
          >
            {/* Index */}
            <span className="text-[8px] tracking-widest text-[#c8a96e] w-6 shrink-0">{r.num}</span>

            {/* Title — expands on hover */}
            <h3
              className="font-black text-[#2a2a2a] group-hover:text-white transition-colors duration-400 flex-1"
              style={{ fontSize: "clamp(1.1rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              {r.title}
            </h3>

            {/* Description — slides in from right */}
            <p className="text-[11px] text-[#444] tracking-wide max-w-[200px] text-right opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden md:block">
              {r.desc}
            </p>

            {/* Arrow */}
            <span className="text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors duration-300 text-sm shrink-0">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
