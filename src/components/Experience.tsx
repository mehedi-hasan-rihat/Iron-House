"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const panels = [
  { n: "01", title: "Reception",      copy: "A quiet arrival. Concrete, warm light, black marble.",  img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { n: "02", title: "Strength Floor", copy: "Rogue racks, calibrated plates, full-mirror walls.",    img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg" },
  { n: "03", title: "Cardio Deck",    copy: "Technogym line, panoramic city view.",                  img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { n: "04", title: "Combat Room",    copy: "Heavy bags, ring, private coaching.",                   img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg" },
  { n: "05", title: "Women's Studio", copy: "Female-only training hours & coaches.",                 img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg" },
];

export default function Experience() {
  const wrap = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  return (
    <section
      id="experience"
      ref={wrap}
      className="relative bg-[#050505]"
      style={{ height: `${panels.length * 90}vh` }}
    >
      <div className="sticky top-2 flex h-screen items-center overflow-hidden">
        {/* Header */}
        <div className="absolute left-5 top-10 z-10 md:left-10">
          <span className="label">(02) — Step Inside</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">The Experience</h2>
        </div>

        {/* Horizontal scroll track */}
        <motion.div
          style={{ x }}
          className="flex h-full items-center gap-6 pl-[6vw] pr-[40vw]"
        >
          {panels.map((p) => (
            <div
              key={p.n}
              className="relative h-[72vh] w-[76vw] shrink-0 overflow-hidden md:w-[48vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 md:p-10">
                <div>
                  <div className="label text-[#BFE01D]">{p.n}</div>
                  <div className="mt-2 font-display text-3xl md:text-5xl">{p.title}</div>
                  <div className="mt-2 max-w-md text-sm text-[#bdbdbd]">{p.copy}</div>
                </div>
              </div>
              <div className="absolute right-4 top-4 border border-white/20 px-2 py-1 text-[10px] uppercase tracking-[0.24em]">
                {p.n} / {String(panels.length).padStart(2, "0")}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
