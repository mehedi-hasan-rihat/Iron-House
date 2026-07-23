"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";

/* ── images ── */
const BG   = "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg";
const IMG2 = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg"; // women's strength
const IMG3 = "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg"; // combat
const IMG4 = "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg"; // strength floor

/* ─── masked word reveal ─── */
function Word({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className="inline-block overflow-hidden leading-[0.9]">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  /* ── scroll progress (0 → 1 over 300vh) ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── ACT 1: opening (0 → 0.33) ── */
  const photoY     = useTransform(scrollYProgress, [0, 0.33], ["0%", "-10%"]);
  const photoScale = useTransform(scrollYProgress, [0, 0.33], [1.05, 1.0]);
  const photoOp    = useTransform(scrollYProgress, [0.2, 0.38], [1, 0]);

  const titleY   = useTransform(scrollYProgress, [0, 0.28], ["0%", "-8%"]);
  const titleOp  = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const barY   = useTransform(scrollYProgress, [0, 0.22], ["0%", "40%"]);
  const barOp  = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const overlayOp = useTransform(scrollYProgress, [0, 0.3, 0.35], [0.3, 0.7, 0.95]);

  const scrollCueOp = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const labelOp     = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  /* ── ACT 2: side panels (0.30 → 0.66) ── */
  /* left panel slides in from left */
  const panel1X  = useTransform(scrollYProgress, [0.30, 0.45], ["-100%", "0%"]);
  const panel1Op = useTransform(scrollYProgress, [0.30, 0.42, 0.62, 0.70], [0, 1, 1, 0]);

  /* right panel slides in from right */
  const panel2X  = useTransform(scrollYProgress, [0.34, 0.50], ["100%", "0%"]);
  const panel2Op = useTransform(scrollYProgress, [0.34, 0.46, 0.62, 0.70], [0, 1, 1, 0]);

  /* center stamp: DISCIPLINE / STRENGTH text */
  const stampOp  = useTransform(scrollYProgress, [0.38, 0.50, 0.62, 0.70], [0, 1, 1, 0]);
  const stampY0  = useTransform(scrollYProgress, [0.38, 0.52], ["40px", "0px"]);
  const stampY1  = useTransform(scrollYProgress, [0.42, 0.56], ["40px", "0px"]);

  /* ── ACT 3: full takeover (0.66 → 1.0) ── */
  const act3Op   = useTransform(scrollYProgress, [0.68, 0.78], [0, 1]);
  const act3ImgY = useTransform(scrollYProgress, [0.68, 1.0], ["8%", "0%"]);
  const act3ContentY = useTransform(scrollYProgress, [0.70, 0.82], ["30px", "0px"]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-[#050505]"
      style={{ height: "300vh" }}
    >
      {/* ════ STICKY VIEWPORT ════ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── ACT 1: main BG ── */}
        <motion.div
          className="absolute inset-[-6%] will-change-transform"
          style={{ x: smoothX, y: smoothY }}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: photoY, scale: photoScale, opacity: photoOp }}
          >
            <motion.img
              src={BG}
              alt="IRON HOUSE athlete"
              className="h-full w-full object-cover object-[62%_18%]"
              initial={{ scale: 1.14 }}
              animate={ready ? { scale: 1.05 } : {}}
              transition={{ duration: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>
        </motion.div>

        {/* base colour grades (always present) */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, #05050590 18%, transparent 45%)," +
              "linear-gradient(to right, #050505 0%, #05050570 28%, transparent 55%)," +
              "linear-gradient(to bottom, #05050555 0%, transparent 20%)",
          }}
        />

        {/* scroll-driven darkening */}
        <motion.div
          className="absolute inset-0 bg-[#050505] pointer-events-none z-2"
          style={{ opacity: overlayOp }}
        />

        {/* ── ACT 1: headline ── */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end md:justify-center px-6 pb-32 md:pb-0 md:px-16 max-w-4xl pointer-events-none z-3"
          style={{ y: titleY, opacity: titleOp }}
        >
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <motion.span
              className="block h-px bg-[#c8a96e] w-9"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : {}}
              transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
            />
            <span className="label tracking-[0.45em] text-[#c8a96e]">
              Gulshan, Dhaka · Est. 2016
            </span>
          </motion.div>

          <h1
            className="font-display text-white"
            style={{
              fontSize: "clamp(4.2rem, 12vw, 14rem)",
              lineHeight: 0.87,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {ready && (
              <>
                <div className="flex gap-[0.18em]">
                  <Word delay={0.38}>IRON</Word>
                  <Word delay={0.50}>HOUSE</Word>
                </div>
                <div>
                  <Word delay={0.64} className="text-[#c8a96e]">DHAKA</Word>
                </div>
              </>
            )}
          </h1>

          <motion.p
            className="mt-7 max-w-xs text-[#bdbdbd] text-sm leading-[1.8] tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Not a gym. A standard.{" "}
            <span className="text-white/40">
              International equipment · Certified coaches · Premium experience.
            </span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5 pointer-events-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-[#c8a96e] text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-accent-hover transition-colors duration-300"
            >
              Book Free Trial
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 text-[#bdbdbd] text-xs uppercase tracking-[0.25em] hover:text-white transition-colors duration-300 pointer-events-auto"
            >
              Explore
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* ── ACT 1: bottom stats bar ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#050505]/60 backdrop-blur-sm z-4"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: barY, opacity: barOp }}
        >
          <div className="mx-auto flex max-w-[1600px] items-stretch divide-x divide-[#1a1a1a] px-6 md:px-16">
            {[
              { value: "3,240+", label: "Active Members" },
              { value: "12",     label: "Elite Trainers" },
              { value: "8",      label: "Years Running"  },
              { value: "15+",    label: "Programs"       },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`flex-1 py-5 px-4 md:px-8 ${i > 1 ? "hidden md:flex" : "flex"} flex-col gap-0.5`}
              >
                <span className="font-display text-xl md:text-2xl text-white leading-none">
                  {s.value.replace(/[+]/g, "")}
                  <span className="text-[#c8a96e]">{s.value.includes("+") ? "+" : ""}</span>
                </span>
                <span className="label mt-1">{s.label}</span>
              </div>
            ))}
            <div className="ml-auto hidden lg:flex flex-col items-end justify-center gap-2 py-5 px-8">
              <p className="label">N 23.7925° · E 90.4155°</p>
              <motion.div className="flex items-center gap-2" style={{ opacity: scrollCueOp }}>
                <span className="label text-[#c8a96e]/60 tracking-[0.4em]">scroll</span>
                <motion.div
                  className="w-px h-6 bg-[#c8a96e]/40"
                  animate={{ scaleY: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                  style={{ transformOrigin: "top" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── ACT 1: top-right label ── */}
        <motion.div
          className="absolute top-24 right-6 md:right-16 hidden md:flex flex-col items-end gap-1 pointer-events-none z-3"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{ opacity: labelOp }}
        >
          <span className="label text-white/30 tracking-[0.35em]">Premium Fitness</span>
          <span className="label text-white/30 tracking-[0.35em]">Bangladesh</span>
        </motion.div>

        {/* ════ ACT 2: side panels + center stamp ════ */}

        {/* Left panel — Women's Strength */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[36vw] hidden lg:block overflow-hidden z-5"
          style={{ x: panel1X, opacity: panel1Op }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG2}
            alt="Women's strength training"
            className="h-full w-full object-cover object-top"
          />
          {/* inner gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505]/80 via-transparent to-transparent" />
          {/* label */}
          <div className="absolute bottom-12 left-8">
            <p className="label text-[#c8a96e] mb-2 tracking-[0.4em]">01 — Program</p>
            <p className="font-display text-white" style={{ fontSize: "clamp(1.6rem, 2.8vw, 3rem)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              WOMEN&apos;S<br />STRENGTH
            </p>
            <p className="mt-3 text-[#bdbdbd] text-xs leading-relaxed max-w-[18ch]">
              Female-only hours · dedicated coaches · safe space
            </p>
          </div>
          {/* corner tag */}
          <div className="absolute top-8 left-8 border border-white/20 px-2 py-1">
            <span className="label text-white/50">01 / 02</span>
          </div>
        </motion.div>

        {/* Right panel — Combat Training */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-[36vw] hidden lg:block overflow-hidden z-5"
          style={{ x: panel2X, opacity: panel2Op }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG3}
            alt="Combat training"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-l from-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505]/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 right-8 text-right">
            <p className="label text-[#c8a96e] mb-2 tracking-[0.4em]">02 — Program</p>
            <p className="font-display text-white" style={{ fontSize: "clamp(1.6rem, 2.8vw, 3rem)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              COMBAT<br />TRAINING
            </p>
            <p className="mt-3 text-[#bdbdbd] text-xs leading-relaxed max-w-[18ch] ml-auto">
              Heavy bags · ring work · private coaching
            </p>
          </div>
          <div className="absolute top-8 right-8 border border-white/20 px-2 py-1">
            <span className="label text-white/50">02 / 02</span>
          </div>
        </motion.div>

        {/* Center stamp between panels */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-6"
          style={{ opacity: stampOp }}
        >
          <motion.div style={{ y: stampY0 }}>
            <p
              className="font-display text-white text-center"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 4rem)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              Discipline
            </p>
          </motion.div>

          <motion.div className="my-3 flex items-center gap-4" style={{ y: stampY0 }}>
            <span className="block h-px w-16 bg-[#c8a96e]/50" />
            <span className="label text-[#c8a96e] tracking-[0.5em]">×</span>
            <span className="block h-px w-16 bg-[#c8a96e]/50" />
          </motion.div>

          <motion.div style={{ y: stampY1 }}>
            <p
              className="font-display text-[#c8a96e] text-center"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 4rem)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              Strength
            </p>
          </motion.div>
        </motion.div>

        {/* ════ ACT 3: full takeover — Strength Floor ════ */}
        <motion.div
          className="absolute inset-0 z-7"
          style={{ opacity: act3Op }}
        >
          {/* full-bleed image */}
          <motion.div
            className="absolute inset-[-4%]"
            style={{ y: act3ImgY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG4}
              alt="Strength floor"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* overlays */}
          <div className="absolute inset-0 bg-[#050505]/55" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #050505 0%, #05050580 22%, transparent 50%)," +
                "linear-gradient(to bottom, #05050560 0%, transparent 25%)",
            }}
          />

          {/* content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ y: act3ContentY }}
          >
            {/* eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-12 bg-[#c8a96e]" />
              <span className="label tracking-[0.5em] text-[#c8a96e]">The Floor</span>
              <span className="block h-px w-12 bg-[#c8a96e]" />
            </div>

            {/* headline */}
            <p
              className="font-display text-white"
              style={{
                fontSize: "clamp(3rem, 9vw, 11rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
              }}
            >
              Where
              <br />
              <span className="text-[#c8a96e]">Limits</span>
              <br />
              Break
            </p>

            {/* copy */}
            <p className="mt-8 max-w-sm text-[#bdbdbd] text-sm leading-relaxed">
              Rogue racks. Calibrated plates. Mirror walls.
              <br />
              <span className="text-white/40">Everything you need. Nothing you don&apos;t.</span>
            </p>

            {/* CTA row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 pointer-events-auto">
              <a
                href="#programs"
                className="group inline-flex items-center gap-3 border border-[#c8a96e] text-[#c8a96e] text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-[#c8a96e] hover:text-black transition-all duration-300"
              >
                View Programs
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-[#c8a96e] transition-colors duration-300"
              >
                Join Now
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* bottom-right tag */}
          <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-1">
            <span className="label text-white/30 tracking-[0.35em]">03 / 03</span>
            <span className="label text-white/30 tracking-[0.35em]">Strength Floor</span>
          </div>
        </motion.div>

      </div>
      {/* end sticky */}
    </section>
  );
}
