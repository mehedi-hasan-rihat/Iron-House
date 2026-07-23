"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

/* ─── images ─── */
const BG  = "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg";
const IMG2 = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";
const IMG3 = "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg";

/* ─── single headline word, masked-reveal from bottom ─── */
function RevealWord({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── thin horizontal rule that draws left→right ─── */
function DrawLine({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <motion.span
      className={`inline-block h-px bg-[#c8a96e] ${className}`}
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "left" }}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [ready, setReady] = useState(false);

  /* start hero reveal after mount */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* subtle mouse parallax on the photo */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 18);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  /* scroll-driven transforms */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* photo pulls upward and fades as you leave hero */
  const imgY     = useTransform(scrollYProgress, [0, 1],    ["0%",   "-22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5],  [1.04,   1.0]);
  const imgOp    = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 1,  0]);

  /* headline drifts up independently */
  const titleY   = useTransform(scrollYProgress, [0, 0.6],  ["0%",  "-14%"]);
  const titleOp  = useTransform(scrollYProgress, [0, 0.4, 0.65], [1, 1,   0]);

  /* overlay deepens on scroll — story reveal */
  const overlayOp = useTransform(scrollYProgress, [0, 0.5],  [0.45, 0.82]);

  /* side panels slide in on scroll */
  const panel1X = useTransform(scrollYProgress, [0, 0.3, 0.6], ["-100%", "0%", "0%"]);
  const panel2X = useTransform(scrollYProgress, [0, 0.4, 0.7], ["100%",  "0%", "0%"]);
  const panelOp = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.8], [0, 1, 1, 0]);

  /* scroll indicator fades out */
  const scrollCueOp = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /* business-statement layer */
  const stmtOp  = useTransform(scrollYProgress, [0.35, 0.5, 0.75, 0.88], [0, 1, 1, 0]);
  const stmtY0  = useTransform(scrollYProgress, [0.35, 0.55], ["30px",  "0px"]);
  const stmtY1  = useTransform(scrollYProgress, [0.35, 0.55], ["50px",  "0px"]);
  const stmtY2  = useTransform(scrollYProgress, [0.35, 0.55], ["70px",  "0px"]);
  const stmtSubOp = useTransform(scrollYProgress, [0.45, 0.58], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative"
      style={{ height: "280vh" }}
    >
      {/* ─── sticky viewport ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

        {/* ══ LAYER 0 — full-bleed athletic photograph ══ */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: smoothX, y: smoothY }}
        >
          <motion.div
            className="absolute inset-[-5%] grain-overlay"
            style={{ y: imgY, scale: imgScale, opacity: imgOp }}
          >
            {/* Initial cinematic scale-in */}
            <motion.img
              src={BG}
              alt="IRON HOUSE athlete"
              className="h-full w-full object-cover object-[60%_20%]"
              initial={{ scale: 1.12 }}
              animate={ready ? { scale: 1.04 } : {}}
              transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>
        </motion.div>

        {/* ══ LAYER 1 — progressive dark overlay ══ */}
        <motion.div
          className="absolute inset-0 bg-[#050505]"
          style={{ opacity: overlayOp }}
        />
        {/* fixed bottom-to-top gradient so stats bar always reads */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, #05050580 18%, transparent 45%), " +
              "linear-gradient(to bottom, #05050560 0%, transparent 22%)",
          }}
        />

        {/* ══ LAYER 2 — main headline ══ */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 pointer-events-none"
          style={{ y: titleY, opacity: titleOp }}
        >
          {/* eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <DrawLine delay={0.3} className="w-10" />
            <motion.span
              className="label tracking-[0.45em] text-[#c8a96e]"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Gulshan, Dhaka · Est. 2016
            </motion.span>
          </div>

          {/* display headline */}
          <h1
            className="font-display text-white"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 13rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {ready && (
              <>
                <div>
                  <RevealWord delay={0.4}>IRON</RevealWord>
                  {" "}
                  <RevealWord delay={0.52}>HOUSE</RevealWord>
                </div>
                <div>
                  <RevealWord delay={0.65} className="text-[#c8a96e]">
                    DHAKA
                  </RevealWord>
                </div>
              </>
            )}
          </h1>

          {/* tagline — appears after headline */}
          <motion.p
            className="mt-7 max-w-sm text-[#bdbdbd] text-sm leading-7 tracking-wide"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Not a gym. A standard.<br />
            <span className="text-[#ffffff]/50">
              International equipment · Certified coaches · Premium experience.
            </span>
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="mt-10 flex items-center gap-6 pointer-events-auto"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="https://wa.me/8801700000000"
              className="group inline-flex items-center gap-3 bg-[#c8a96e] text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-accent-hover transition-colors duration-300"
            >
              Book Free Trial
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 text-[#bdbdbd] text-xs uppercase tracking-[0.25em] hover:text-white transition-colors duration-300"
            >
              Explore
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* ══ LAYER 3 — scroll-reveal panels (business story) ══ */}
        {/* Left panel: women's strength */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[28vw] hidden lg:block overflow-hidden"
          style={{ x: panel1X, opacity: panelOp }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG2} alt="Women's strength" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-linear-to-r from-[#050505]/60 to-transparent" />
          <div className="absolute bottom-10 left-6">
            <p className="label text-[#c8a96e] mb-1">01</p>
            <p className="font-display text-2xl text-white">WOMEN&apos;S<br />STRENGTH</p>
          </div>
        </motion.div>

        {/* Right panel: combat */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-[28vw] hidden lg:block overflow-hidden"
          style={{ x: panel2X, opacity: panelOp }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG3} alt="Combat training" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-linear-to-l from-[#050505]/60 to-transparent" />
          <div className="absolute bottom-10 right-6 text-right">
            <p className="label text-[#c8a96e] mb-1">02</p>
            <p className="font-display text-2xl text-white">COMBAT<br />TRAINING</p>
          </div>
        </motion.div>

        {/* ══ LAYER 4 — bottom stats bar ══ */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 px-6 md:px-16 flex items-end justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Stats */}
          <div className="flex items-end gap-8 md:gap-12">
            {[
              { v: "3,240+", l: "Members"  },
              { v: "12",     l: "Trainers" },
              { v: "08",     l: "Years"    },
            ].map((s, i) => (
              <div key={s.l} className={i > 0 ? "hidden md:block" : ""}>
                <p className="font-display text-2xl md:text-3xl text-white leading-none">
                  {s.v.replace("+", "")}<span className="text-[#c8a96e]">{s.v.includes("+") ? "+" : ""}</span>
                </p>
                <p className="label mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Coordinates + scroll cue */}
          <div className="flex flex-col items-end gap-2">
            <motion.p className="label hidden md:block" style={{ opacity: scrollCueOp }}>
              N 23.7925° · E 90.4155°
            </motion.p>
            <motion.div
              className="flex flex-col items-center gap-1"
              style={{ opacity: scrollCueOp }}
            >
              <span className="label text-[#c8a96e]/70 tracking-[0.4em]">scroll</span>
              <motion.div
                className="w-px h-8 bg-[#c8a96e]/40"
                animate={{ scaleY: [0, 1, 0], originY: "top" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
                style={{ transformOrigin: "top" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ══ LAYER 5 — scroll-stamped business statement ══ */}
        {/* appears mid-scroll, communicates what the gym IS */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
          style={{ opacity: stmtOp }}
        >
          <div className="text-center">
            {[
              { word: "DISCIPLINE",     col: "text-white",     y: stmtY0 },
              { word: "STRENGTH",       col: "text-[#c8a96e]", y: stmtY1 },
              { word: "TRANSFORMATION", col: "text-white/30",  y: stmtY2 },
            ].map((item) => (
              <motion.div
                key={item.word}
                className={`font-display block leading-none ${item.col}`}
                style={{
                  fontSize: "clamp(2.5rem, 9vw, 10rem)",
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  y: item.y,
                }}
              >
                {item.word}
              </motion.div>
            ))}
            <motion.p
              className="mt-6 text-[#bdbdbd]/60 text-sm tracking-[0.3em] uppercase"
              style={{ opacity: stmtSubOp }}
            >
              Gulshan 2, Dhaka · Since 2016
            </motion.p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
