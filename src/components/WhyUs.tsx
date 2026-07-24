"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { t: "International Equipment",  d: "Rogue · Technogym · Hammer Strength.", n: "01" },
  { t: "Certified Trainers",       d: "ACE, NASM & ISSA certified coaches.",  n: "02" },
  { t: "Women's Fitness",          d: "Female-only hours, female trainers.",  n: "03" },
  { t: "Functional Training",      d: "TRX, rigs, plyo, mobility zone.",      n: "04" },
  { t: "Nutrition Planning",       d: "Custom diet plans by dietitians.",     n: "05" },
  { t: "Locker · Steam · Parking", d: "Full amenities, secured parking.",     n: "06" },
  { t: "24/7 Security",            d: "CCTV, keycard access, on-site staff.", n: "07" },
];

export default function WhyUs() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section className="relative bg-[#050505] py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label">(03) — Why FIT GYM Center</span>
            <h2 className="mt-3 text-display">
              Everything you<br />
              expect. And more<br />
              you don&apos;t.
            </h2>
          </div>
          <p className="max-w-sm text-[#bdbdbd]">
            Seven reasons Dhaka&apos;s most committed athletes call this home.
          </p>
        </div>

        <div className="divide-y divide-[#1a1a1a] border-y border-[#1a1a1a]">
          {items.map((it, i) => (
            <div
              key={it.n}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative flex cursor-default items-center justify-between gap-8 py-8 md:py-10"
            >
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="label w-8">{it.n}</span>
                <motion.h3
                  animate={{ x: hover === i ? 24 : 0, color: hover === i ? "#BFE01D" : "#ffffff" }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="font-display text-4xl leading-none md:text-7xl"
                >
                  {it.t}
                </motion.h3>
              </div>
              <div className="hidden max-w-[220px] text-right text-sm text-[#bdbdbd] md:block">{it.d}</div>
              <AnimatePresence>
                {hover === i && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#BFE01D]"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
