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

/* ── images ── */
const BG   = "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg";
const IMG2 = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";
const IMG3 = "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg";
const IMG4 = "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg";

const easeOut = cubicBezier(0.16, 1, 0.3, 1);
const easeIn  = cubicBezier(0.4, 0, 1, 1);

/* act1 / act3 content slide variants */
const fadeUp = {
  enter:   { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.72, ease: easeOut } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.45, ease: easeIn  } },
};

/* masked word reveal */
function Word({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
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

/* progress dots */
function Dots({ active }: { active: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full bg-white"
          animate={{ width: active === i ? 24 : 6, opacity: active === i ? 1 : 0.3 }}
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
      if (v < 0.34)      setAct(0);
      else if (v < 0.67) setAct(1);
      else               setAct(2);
    });
  }, [scrollYProgress]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => { if (v > 0.04) setScrolled(true); });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-[#050505]"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

        {/* ════════════════════════════════
            BG layer — swaps per act
        ════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ACT 1 bg */}
          {act === 0 && (
            <motion.div key="bg0" className="absolute inset-[-6%]"
              style={{ x: smoothX, y: smoothY }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
            >
              <motion.img src={BG} alt=""
                className="h-full w-full object-cover object-[62%_18%]"
                initial={{ scale: 1.12 }}
                animate={ready ? { scale: 1.05 } : {}}
                transition={{ duration: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.div>
          )}

          {/* ACT 3 bg — strength floor */}
          {act === 2 && (
            <motion.div key="bg2" className="absolute inset-[-4%]"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG4} alt="" className="h-full w-full object-cover object-center" />
            </motion.div>
          )}

        </AnimatePresence>

        {/* ACT 2 bg — two panels slide from sides (NOT in AnimatePresence wait, so they animate independently) */}
        {act === 1 && (
          <>
            {/* LEFT panel slides in from left */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.85, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG2} alt="" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.5) 28%, transparent 58%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,5,5,0.2) 0%, transparent 45%)" }} />
            </motion.div>

            {/* RIGHT panel slides in from right */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.85, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG3} alt="" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.5) 28%, transparent 58%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(5,5,5,0.2) 0%, transparent 45%)" }} />
            </motion.div>

            {/* center divider */}
            <motion.div
              className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-white/10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />
          </>
        )}

        {/* ── global colour grades on top of every bg ── */}
        <div className="absolute inset-0 pointer-events-none z-1" style={{
          background:
            "linear-gradient(to top,    #050505 0%, rgba(5,5,5,0.45) 15%, transparent 40%)," +
            "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 16%)",
        }} />
        {/* act 3 extra dark overlay so text pops */}
        {act === 2 && (
          <div className="absolute inset-0 bg-[#050505]/60 pointer-events-none z-1" />
        )}


        {/* ════════════════════════════════
            CONTENT layer — swaps per act
        ════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ── ACT 1 content ── */}
          {act === 0 && (
            <motion.div key="c0"
              className="absolute inset-0 flex flex-col justify-end md:justify-center px-6 pb-28 md:pb-0 md:px-16 max-w-4xl pointer-events-none z-2"
              variants={fadeUp} initial="enter" animate="visible" exit="exit"
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.span className="block h-px bg-[#BFE01D] w-9"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
                <span className="label tracking-[0.45em] text-[#BFE01D]">Gulshan, Dhaka · Est. 2016</span>
              </div>

              <h1 className="font-display text-white"
                style={{ fontSize: "clamp(4.2rem, 12vw, 14rem)", lineHeight: 0.87, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
                {ready && (<>
                  <div className="flex gap-[0.18em]">
                    <Word delay={0.08}>IRON</Word>
                    <Word delay={0.20}>HOUSE</Word>
                  </div>
                  <div><Word delay={0.34} className="text-[#BFE01D]">DHAKA</Word></div>
                </>)}
              </h1>

              <p className="mt-7 max-w-xs text-[#bdbdbd] text-sm leading-[1.8] tracking-wide">
                Not a gym. A standard.{" "}
                <span className="text-white/40">International equipment · Certified coaches · Premium experience.</span>
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-5 pointer-events-auto">
                <a href="#contact" className="group inline-flex items-center gap-3 bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-accent-hover transition-colors duration-300">
                  Book Free Trial
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" /></svg>
                </a>
                <a href="#experience" className="group inline-flex items-center gap-2 text-[#bdbdbd] text-xs uppercase tracking-[0.25em] hover:text-white transition-colors duration-300 pointer-events-auto">
                  Explore
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" /></svg>
                </a>
              </div>
            </motion.div>
          )}

          {/* ── ACT 2 content — labels slide in after panels ── */}
          {act === 1 && (
            <motion.div key="c1" className="absolute inset-0 pointer-events-none z-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* left label */}
              <motion.div
                className="absolute bottom-0 left-0 w-1/2 px-8 md:px-14 pb-14"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display leading-none select-none text-[#BFE01D]/10 mb-1"
                  style={{ fontSize: "clamp(4rem, 7vw, 8rem)", letterSpacing: "-0.04em" }}>01</p>
                <div className="border-t border-[#BFE01D]/30 pt-5">
                  <p className="label text-[#BFE01D] tracking-[0.35em] mb-3">Women&apos;s Program</p>
                  <h3 className="font-display text-white"
                    style={{ fontSize: "clamp(2rem, 3.2vw, 4rem)", lineHeight: 0.88, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
                    Built for<br />Her Strength
                  </h3>
                  <p className="mt-4 text-[#bdbdbd] text-xs leading-loose max-w-[20ch]">
                    Female-only floors<br />Certified women coaches<br />Zero judgment
                  </p>
                </div>
              </motion.div>

              {/* right label */}
              <motion.div
                className="absolute bottom-0 right-0 w-1/2 px-8 md:px-14 pb-14 text-right"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.78, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display leading-none select-none text-[#BFE01D]/10 mb-1"
                  style={{ fontSize: "clamp(4rem, 7vw, 8rem)", letterSpacing: "-0.04em" }}>02</p>
                <div className="border-t border-[#BFE01D]/30 pt-5">
                  <p className="label text-[#BFE01D] tracking-[0.35em] mb-3">Combat Program</p>
                  <h3 className="font-display text-white"
                    style={{ fontSize: "clamp(2rem, 3.2vw, 4rem)", lineHeight: 0.88, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
                    Train Like<br />You Mean It
                  </h3>
                  <p className="mt-4 text-[#bdbdbd] text-xs leading-loose max-w-[20ch] ml-auto">
                    Heavy bags &amp; ring work<br />Private coaching<br />Real intensity
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── ACT 3 content — bold horizontal split ── */}
          {act === 2 && (
            <motion.div key="c2"
              className="absolute inset-0 z-2 pointer-events-none"
              variants={fadeUp} initial="enter" animate="visible" exit="exit"
            >
              {/* top-left: eyebrow + huge number */}
              <motion.div
                className="absolute top-28 left-6 md:left-16"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="label text-[#BFE01D] tracking-[0.45em] mb-2">Strength Floor · Since 2016</p>
                <p className="font-display text-white/6 leading-none select-none"
                  style={{ fontSize: "clamp(6rem, 18vw, 22rem)", letterSpacing: "-0.05em", lineHeight: 0.8 }}>
                  03
                </p>
              </motion.div>

              {/* bottom: big headline left + copy+cta right */}
              <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-display text-white"
                    style={{ fontSize: "clamp(3.5rem, 10vw, 12rem)", lineHeight: 0.87, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
                    <span className="block">No</span>
                    <span className="block text-[#BFE01D]">Limits.</span>
                    <span className="block">No</span>
                    <span className="block">Excuses.</span>
                  </h2>
                </motion.div>

                <motion.div
                  className="md:max-w-70 shrink-0 pointer-events-auto"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[#bdbdbd] text-sm leading-[1.8] tracking-wide mb-6">
                    Rogue racks. Calibrated plates. Mirror walls.{" "}
                    <span className="text-white/40">Everything you need. Nothing you don&apos;t.</span>
                  </p>
                  <a href="#programs"
                    className="group inline-flex items-center gap-3 bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] px-7 py-4 hover:bg-accent-hover transition-colors duration-300">
                    View All Programs
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── stats bar — act 1 only ── */}
        <AnimatePresence>
          {act === 0 && (
            <motion.div key="stats"
              className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#050505]/60 backdrop-blur-sm pointer-events-auto z-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.8 } }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
            >
              <div className="mx-auto flex max-w-[1600px] items-stretch divide-x divide-[#1a1a1a] px-6 md:px-16">
                {[
                  { value: "3,240+", label: "Active Members" },
                  { value: "12",     label: "Elite Trainers" },
                  { value: "8",      label: "Years Running"  },
                  { value: "15+",    label: "Programs"       },
                ].map((s, i) => (
                  <div key={s.label} className={`flex-1 py-5 px-4 md:px-8 ${i > 1 ? "hidden md:flex" : "flex"} flex-col gap-0.5`}>
                    <span className="font-display text-xl md:text-2xl text-white leading-none">
                      {s.value.replace(/[+]/g, "")}<span className="text-[#BFE01D]">{s.value.includes("+") ? "+" : ""}</span>
                    </span>
                    <span className="label mt-1">{s.label}</span>
                  </div>
                ))}
                <div className="ml-auto hidden lg:flex flex-col items-end justify-center gap-2 py-5 px-8">
                  <p className="label">N 23.7925° · E 90.4155°</p>
                  <div className="flex items-center gap-2">
                    <span className="label text-[#BFE01D]/60 tracking-[0.4em]">scroll</span>
                    <motion.div className="w-px h-6 bg-[#BFE01D]/40"
                      animate={scrolled ? { opacity: 0 } : { scaleY: [0, 1, 0] }}
                      transition={scrolled ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                      style={{ transformOrigin: "top" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── slide counter ── */}
        <div className="absolute top-24 right-6 md:right-16 hidden md:block pointer-events-none z-3">
          <AnimatePresence mode="wait">
            <motion.span key={act} className="label text-white/25 tracking-[0.35em]"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
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
