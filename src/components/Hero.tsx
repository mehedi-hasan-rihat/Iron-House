"use client";
"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const HERO_IMGS = {
  bg:    "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg",
  img1:  "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg",
  img2:  "https://iron-house.lovable.app/assets/hero-5-CemgzuX4.jpg",
  img3:  "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg",
  img4:  "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg",
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const y1           = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const y2           = useTransform(scrollYProgress, [0, 1], ["0%",  "40%"]);
  const y3           = useTransform(scrollYProgress, [0, 1], ["0%", "-90%"]);
  const y4           = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y5           = useTransform(scrollYProgress, [0, 1], ["0%",  "70%"]);
  const rot1         = useTransform(scrollYProgress, [0, 1], [-3,  4]);
  const rot3         = useTransform(scrollYProgress, [0, 1], [ 2, -6]);
  const scaleBg      = useTransform(scrollYProgress, [0.5, 1], [1, 1.35]);
  const opacityBg    = useTransform(scrollYProgress, [0,   0.3], [0.4, 1]);
  const titleY       = useTransform(scrollYProgress, [0, 1],  ["0%", "-30%"]);
  const titleScale   = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);
  const overlayOp    = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.2, 0.7]);

  const scrollBounce = useSpring(
    useTransform(scrollYProgress, [0, 0.05], [0, 6]),
    { stiffness: 60, damping: 10 }
  );

  return (
    <section ref={ref} id="top" className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden grain-overlay">

        {/* BG slow parallax */}
        <motion.img
          src={HERO_IMGS.bg}
          alt=""
          style={{ y: y5, scale: scaleBg, opacity: opacityBg }}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <motion.div style={{ opacity: overlayOp }} className="absolute inset-0 bg-[#050505]" />

        {/* Collage — top left */}
        <motion.div
          style={{ y: y1, rotate: rot1 }}
          className="absolute left-[6%] top-[18%] hidden w-[22vw] max-w-[340px] md:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMGS.img1} alt="Female athlete training" className="w-full object-cover shadow-2xl" />
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#bdbdbd]">
            <span>01 — Women&apos;s Strength</span>
            <span>DHK/24</span>
          </div>
        </motion.div>

        {/* Collage — top right */}
        <motion.div
          style={{ y: y2 }}
          className="absolute right-[5%] top-[14%] hidden w-[20vw] max-w-[300px] md:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMGS.img2} alt="Barbell" className="w-full object-cover shadow-2xl" />
        </motion.div>

        {/* Collage — bottom left */}
        <motion.div
          style={{ y: y3, rotate: rot3 }}
          className="absolute bottom-[10%] left-[14%] w-[45vw] max-w-[260px] md:w-[16vw]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMGS.img3} alt="Boxer training" className="w-full object-cover shadow-2xl" />
        </motion.div>

        {/* Collage — bottom right */}
        <motion.div
          style={{ y: y4 }}
          className="absolute -bottom-[8%] right-[8%] w-[55vw] max-w-[420px] md:w-[26vw]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMGS.img4} alt="Deadlift" className="w-full object-cover shadow-2xl" />
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#bdbdbd]">
            <span>02 — Strength Floor</span>
            <span className="text-[#BFE01D]">● LIVE</span>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.div
          style={{ y: titleY, scale: titleScale }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5"
        >
          <div className="text-center text-white leading-[0.82]">
            <div className="text-hero">BUILD</div>
            <div className="text-hero">
              YOUR{" "}
              <span className="text-[#BFE01D] italic font-normal" style={{ fontFamily: "Georgia, serif" }}>
                strongest
              </span>
            </div>
            <div className="text-hero">SELF.</div>
          </div>
        </motion.div>

        {/* Side labels */}
        <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 md:block">
          <span className="label whitespace-nowrap">Est. 2016 — Gulshan, Dhaka</span>
        </div>
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-90 md:block">
          <span className="label whitespace-nowrap">N 23.7925° · E 90.4155°</span>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-wrap items-end justify-between gap-4 px-5 md:px-10">
          <div className="flex items-center gap-6">
            <div>
              <div className="label">Members</div>
              <div className="font-display text-3xl md:text-4xl">3,240<span className="text-[#BFE01D]">+</span></div>
            </div>
            <div className="hidden h-10 w-px bg-white/15 md:block" />
            <div className="hidden md:block">
              <div className="label">Trainers</div>
              <div className="font-display text-3xl md:text-4xl">12</div>
            </div>
            <div className="hidden h-10 w-px bg-white/15 md:block" />
            <div className="hidden md:block">
              <div className="label">Years</div>
              <div className="font-display text-3xl md:text-4xl">08</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="label flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BFE01D] accent-dot" />
              Scroll to explore
            </span>
            <motion.div
              style={{ y: scrollBounce }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-px bg-linear-to-b from-white to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
