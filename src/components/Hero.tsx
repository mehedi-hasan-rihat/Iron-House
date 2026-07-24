"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  AnimatePresence,
  cubicBezier,
} from "framer-motion";
import { MapPin } from "lucide-react";

const BG = "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg";
const IMG2 = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";
const IMG3 = "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg";
const IMG4 = "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg";
const ACC = "#BFE01D";

const easeOut = cubicBezier(0.16, 1, 0.3, 1);
const easeIn = cubicBezier(0.4, 0, 1, 1);

/* pure opacity crossfade — no positional shift */
const fade = {
  enter: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: 0.45, ease: easeIn } },
};

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

function Dots({ active }: { active: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          animate={{
            width: active === i ? 28 : 6,
            opacity: active === i ? 1 : 0.3,
            backgroundColor: active === i ? ACC : "#ffffff",
          }}
          transition={{ duration: 0.4 }}
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [act, setAct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 18);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setAct(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
      if (v > 0.04) setScrolled(true);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-[#050505] h-[200vh] sm:h-[250vh] md:h-[280vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        {/* ══════════════════════════════════════
            BACKGROUND  — all wrapped in AnimatePresence
            so every enter/exit is always animated
        ══════════════════════════════════════ */}
        <AnimatePresence mode="sync">
          {/* ACT 1 — main photo */}
          {act === 0 && (
            <motion.div
              key="bg0"
              className="absolute inset-[-6%]"
              style={{ x: smoothX, y: smoothY }}
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            >
              <motion.img
                src={BG}
                alt=""
                className="h-full w-full object-cover object-[62%_18%]"
                initial={{ scale: 1.12 }}
                animate={ready ? { scale: 1.05 } : {}}
                transition={{ duration: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.div>
          )}

          {/* ACT 2 — mobile: full-bleed IMG2, desktop: left half */}
          {act === 1 && (
            <motion.div
              key="bg1-left"
              className="absolute overflow-hidden
                         inset-0
                         md:inset-auto md:left-0 md:top-0 md:bottom-0 md:w-1/2"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.75, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG2}
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 32%, transparent 62%)",
                }}
              />
              <div
                className="absolute inset-0 md:hidden"
                style={{ background: "rgba(5,5,5,0.35)" }}
              />
              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  background:
                    "linear-gradient(to right, rgba(5,5,5,0.25) 0%, transparent 50%)",
                }}
              />
            </motion.div>
          )}

          {/* ACT 2 — desktop only: right half */}
          {act === 1 && (
            <motion.div
              key="bg1-right"
              className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.75, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG3}
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 32%, transparent 62%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to left, rgba(5,5,5,0.25) 0%, transparent 50%)",
                }}
              />
            </motion.div>
          )}

          {/* ACT 2 — center rule (desktop only) */}
          {act === 1 && (
            <motion.div
              key="bg1-rule"
              className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-white/10 hidden md:block"
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            />
          )}

          {/* ACT 3 — strength floor photo */}
          {act === 2 && (
            <motion.div
              key="bg2"
              className="absolute inset-[-4%]"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG4}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
          )}

          {/* ACT 3 — dark overlay */}
          {act === 2 && (
            <motion.div
              key="bg2-overlay"
              className="absolute inset-0 bg-[#050505]/62"
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            />
          )}
        </AnimatePresence>

        {/* permanent bottom-up + top-down grade */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.45) 15%, transparent 40%)," +
              "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 18%)",
          }}
        />

        {/* ══════════════════════════════════════
            CONTENT  — pure opacity crossfade
        ══════════════════════════════════════ */}
        <AnimatePresence mode="sync">
          {/* ── ACT 1 ── */}
          {act === 0 && (
            <motion.div
              key="c0"
              className="absolute inset-0 flex flex-col justify-center px-6 pb-28 md:pb-0 md:px-16 pointer-events-none z-2"
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            >
              {/* eyebrow line */}
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.6 }}
              >
                <motion.span
                  className="block h-px w-9"
                  style={{ backgroundColor: ACC }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="label tracking-[0.45em]" style={{ color: ACC }}>
                  Est. 2016
                </span>
              </motion.div>

              {/* main headline — full-width dominant */}
              <h1
                className="font-display text-white"
                style={{
                  fontSize: "clamp(4.2rem, 13vw, 16rem)",
                  lineHeight: 0.82,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}
              >
                {ready && (
                  <>
                    {/* FIT GYM — line 1 */}
                    <div className="flex gap-[0.18em]">
                      <Word delay={0.08}>FIT</Word>
                      <Word delay={0.22}>GYM</Word>
                    </div>
                    {/* CENTER — line 2, accent, bigger to fill */}
                    <div>
                      <span className="inline-block overflow-hidden" style={{ lineHeight: 0.82 }}>
                        <motion.span
                          className="inline-block font-display"
                          style={{ color: ACC, fontSize: "1.08em" }}
                          initial={{ y: "110%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 1.1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        >
                          CENTER
                        </motion.span>
                      </span>
                    </div>
                  </>
                )}
              </h1>

              {/* location row */}
              <motion.div
                className="flex items-center gap-2 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <MapPin
                  style={{ color: ACC, width: 15, height: 15, flexShrink: 0 }}
                />
                <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#bdbdbd]">
                  Sabujbag, Patuakhali
                </span>
              </motion.div>

              {/* tagline */}
              <motion.p
                className="mt-5 max-w-sm text-[#bdbdbd] text-sm leading-[1.8] tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Not a gym. A standard.{" "}
                <span className="text-white/30">
                  Modern equipment · Certified coaches · Premium experience.
                </span>
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 transition-opacity duration-300 hover:opacity-85"
                  style={{ backgroundColor: ACC }}
                >
                  Book Free Trial
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </a>
                <a
                  href="#experience"
                  className="group inline-flex items-center gap-2 text-[#bdbdbd] text-xs uppercase tracking-[0.25em] hover:text-white transition-colors duration-300"
                >
                  Explore
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          )}

          {/* ── ACT 2 ── */}
          {act === 1 && (
            <motion.div
              key="c1"
              className="absolute inset-0 pointer-events-none z-2"
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            >
              {/* ══ MOBILE: full-width stacked column ══ */}
              <div className="md:hidden absolute inset-x-0 bottom-0 px-6 pb-20 space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="label" style={{ color: ACC }}>
                      01
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="label" style={{ color: ACC }}>
                      Women&apos;s
                    </span>
                  </div>
                  <h3
                    className="font-display text-white text-4xl leading-none mb-2"
                    style={{
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                    }}
                  >
                    Built for
                    <br />
                    Her Strength
                  </h3>
                  <p className="text-[#bdbdbd] text-xs leading-loose">
                    Female-only floors · Certified coaches · Zero judgment
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pt-5"
                  style={{ borderTop: `1px solid rgba(255,255,255,0.08)` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="label" style={{ color: ACC }}>
                      02
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="label" style={{ color: ACC }}>
                      Combat
                    </span>
                  </div>
                  <h3
                    className="font-display text-white text-4xl leading-none mb-2"
                    style={{
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                    }}
                  >
                    Train Like
                    <br />
                    You Mean It
                  </h3>
                  <p className="text-[#bdbdbd] text-xs leading-loose">
                    Heavy bags · Ring work · Private coaching
                  </p>
                </motion.div>
              </div>

              {/* ══ DESKTOP: side-by-side labels ══ */}
              {/* left */}
              <motion.div
                className="absolute bottom-0 left-0 w-1/2 px-14 pb-14 hidden md:block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.45,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  className="font-display leading-none select-none mb-1"
                  style={{
                    fontSize: "clamp(4rem, 7vw, 8rem)",
                    letterSpacing: "-0.04em",
                    color: `${ACC}18`,
                  }}
                >
                  01
                </p>
                <div
                  className="pt-5"
                  style={{ borderTop: `1px solid ${ACC}33` }}
                >
                  <p
                    className="label tracking-[0.35em] mb-3"
                    style={{ color: ACC }}
                  >
                    Women&apos;s Program
                  </p>
                  <h3
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(2rem, 3.2vw, 4rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                    }}
                  >
                    Built for
                    <br />
                    Her Strength
                  </h3>
                  <p className="mt-4 text-[#bdbdbd] text-xs leading-loose max-w-[22ch]">
                    Female-only floors
                    <br />
                    Certified women coaches
                    <br />
                    Zero judgment
                  </p>
                </div>
              </motion.div>

              {/* right */}
              <motion.div
                className="absolute bottom-0 right-0 w-1/2 px-14 pb-14 text-right hidden md:block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.58,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  className="font-display leading-none select-none mb-1"
                  style={{
                    fontSize: "clamp(4rem, 7vw, 8rem)",
                    letterSpacing: "-0.04em",
                    color: `${ACC}18`,
                  }}
                >
                  02
                </p>
                <div
                  className="pt-5"
                  style={{ borderTop: `1px solid ${ACC}33` }}
                >
                  <p
                    className="label tracking-[0.35em] mb-3"
                    style={{ color: ACC }}
                  >
                    Combat Program
                  </p>
                  <h3
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(2rem, 3.2vw, 4rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                    }}
                  >
                    Train Like
                    <br />
                    You Mean It
                  </h3>
                  <p className="mt-4 text-[#bdbdbd] text-xs leading-loose max-w-[22ch] ml-auto">
                    Heavy bags &amp; ring work
                    <br />
                    Private coaching
                    <br />
                    Real intensity
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── ACT 3 ── */}
          {act === 2 && (
            <motion.div
              key="c2"
              className="absolute inset-0 z-2 pointer-events-none"
              variants={fade}
              initial="enter"
              animate="show"
              exit="exit"
            >
              {/* ghost number — desktop only (too big on mobile) */}
              <motion.div
                className="absolute top-28 left-6 md:left-16 hidden md:block"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  className="label tracking-[0.45em] mb-2"
                  style={{ color: ACC }}
                >
                  Strength Floor · Since 2016
                </p>
                <p
                  className="font-display leading-none select-none text-white/5"
                  style={{
                    fontSize: "clamp(6rem, 18vw, 22rem)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.8,
                  }}
                >
                  03
                </p>
              </motion.div>

              {/* mobile eyebrow */}
              <motion.div
                className="absolute top-24 left-6 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <p className="label tracking-[0.4em]" style={{ color: ACC }}>
                  Strength Floor · Since 2016
                </p>
              </motion.div>

              {/* bottom row */}
              <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-20 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <h2
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(3rem, 10vw, 12rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span className="block">No Limits.</span>
                    <span className="block" style={{ color: ACC }}>
                      No Excuses.
                    </span>
                  </h2>
                </motion.div>

                <motion.div
                  className="md:max-w-72 shrink-0 pointer-events-auto"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.28,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <p className="text-[#bdbdbd] text-sm leading-[1.8] tracking-wide mb-5">
                    Rogue racks. Calibrated plates. Mirror walls.{" "}
                    <span className="text-white/40">
                      Everything you need. Nothing you don&apos;t.
                    </span>
                  </p>
                  <a
                    href="#programs"
                    className="group inline-flex items-center gap-3 text-black text-xs font-bold uppercase tracking-[0.25em] px-6 py-3 md:px-7 md:py-4 transition-opacity duration-300 hover:opacity-85"
                    style={{ backgroundColor: ACC }}
                  >
                    View All Programs
                    <svg
                      width="16"
                      height="8"
                      viewBox="0 0 16 8"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M1 4h14m0 0L11 1m4 3l-4 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── stats bar — act 1 only ── */}
        <AnimatePresence>
          {act === 0 && (
            <motion.div
              key="stats"
              className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#050505]/60 backdrop-blur-sm pointer-events-auto z-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1.3, duration: 0.8 },
              }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.4 } }}
            >
              <div className="mx-auto flex max-w-[1600px] items-stretch divide-x divide-[#1a1a1a] px-6 md:px-16">
                {[
                  { value: "3,240+", label: "Active Members" },
                  { value: "12", label: "Elite Trainers" },
                  { value: "8", label: "Years Running" },
                  { value: "15+", label: "Programs" },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex-1 py-5 px-4 md:px-8 ${i > 1 ? "hidden md:flex" : "flex"} flex-col gap-0.5`}
                  >
                    <span className="font-display text-xl md:text-2xl text-white leading-none">
                      {s.value.replace(/[+]/g, "")}
                      <span style={{ color: ACC }}>
                        {s.value.includes("+") ? "+" : ""}
                      </span>
                    </span>
                    <span className="label mt-1">{s.label}</span>
                  </div>
                ))}
                <div className="ml-auto hidden lg:flex flex-col items-end justify-center gap-2 py-5 px-8">
                  <p className="label">N 23.7925° · E 90.4155°</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="label tracking-[0.4em]"
                      style={{ color: `${ACC}99` }}
                    >
                      scroll
                    </span>
                    <motion.div
                      className="w-px h-6"
                      style={{
                        backgroundColor: `${ACC}66`,
                        transformOrigin: "top",
                      }}
                      animate={
                        scrolled ? { opacity: 0 } : { scaleY: [0, 1, 0] }
                      }
                      transition={
                        scrolled
                          ? { duration: 0.3 }
                          : {
                              duration: 1.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatDelay: 0.4,
                            }
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── slide counter ── */}
        <div className="absolute top-24 right-6 md:right-16 hidden md:block pointer-events-none z-3">
          <AnimatePresence mode="sync">
            <motion.span
              key={act}
              className="label text-white/25 tracking-[0.35em]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              0{act + 1} / 03
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── progress dots ── */}
        <Dots active={act} />
      </div>
    </section>
  );
}
