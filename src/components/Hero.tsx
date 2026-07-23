"use client";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const word1Ref    = useRef<HTMLSpanElement>(null);
  const word2Ref    = useRef<HTMLSpanElement>(null);
  const word3Ref    = useRef<HTMLSpanElement>(null);
  const mouseLayer  = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded]   = useState(false);

  /* ── Staggered word reveals after image loads ── */
  useEffect(() => {
    if (!loaded) return;
    const delays = [
      { el: word1Ref.current, d: "0.2s"  },
      { el: word2Ref.current, d: "0.55s" },
      { el: word3Ref.current, d: "0.9s"  },
    ];
    delays.forEach(({ el, d }) => {
      if (!el) return;
      el.style.animationDelay    = d;
      el.style.animationFillMode = "forwards";
    });
  }, [loaded]);

  /* ── Parallax on scroll ── */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !imageRef.current) return;
      const scrolled = window.scrollY;
      const rate     = scrolled * 0.35;
      imageRef.current.style.transform = `scale(1) translateY(${rate}px)`;

      // word2 shifts slightly faster creating depth
      if (word2Ref.current) {
        word2Ref.current.style.transform = `translateY(${scrolled * -0.12}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mouse depth / parallax ── */
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (!mouseLayer.current) return;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 → 1
      const dy = (e.clientY - cy) / cy;
      mouseLayer.current.style.transform =
        `translate(${dx * 10}px, ${dy * 6}px)`;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden"
      style={{ height: "100svh", minHeight: 640 }}
    >

      {/* ─── BACKGROUND IMAGE — bleeds edge to edge, 70 % viewport ─── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ bottom: "5%" }}
      >
        {/* Cinematic mask container */}
        <div
          className={`absolute inset-0 ${loaded ? "hero-mask-reveal" : "opacity-0"}`}
        >
          {/* Slow zoom wrapper */}
          <div
            ref={imageRef}
            className={`absolute inset-0 will-change-transform ${loaded ? "hero-slow-zoom" : ""}`}
            style={{ transformOrigin: "60% 40%" }}
          >
            {/* The athlete — offset RIGHT so body bleeds out */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg"
              alt="IRON HOUSE athlete"
              onLoad={() => setLoaded(true)}
              className="absolute h-full w-auto max-w-none object-cover object-top"
              style={{
                right: "-8%",
                top: 0,
                width: "72%",
              }}
            />
          </div>

          {/* Deep shadow — left side only, no gradient on right/top/bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #0a0a0a 18%, #0a0a0a55 44%, transparent 65%)",
            }}
          />
          {/* Bottom fade into next section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
          />
        </div>
      </div>

      {/* ─── MOUSE DEPTH LAYER (subtle image shift) ─── */}
      <div
        ref={mouseLayer}
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{ transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      />

      {/* ─── EDITORIAL TYPOGRAPHY — asymmetric, interacts with photo ─── */}
      {loaded && (
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">

          {/* ── Top-left meta line ── */}
          <div className="pt-28 pl-8 md:pl-16">
            <p
              className="word-reveal text-[9px] tracking-[0.45em] text-[#c8a96e] font-light"
              style={{ animationDelay: "1.4s" }}
            >
              EST. 2016 &nbsp;·&nbsp; GULSHAN, DHAKA &nbsp;·&nbsp; N 23.7925°
            </p>
          </div>

          {/* ── Main headline block ── */}
          <div className="relative z-10 pb-20 md:pb-24">

            {/* DISCIPLINE — full bleed left, enormous, behind photo */}
            <div
              className="relative overflow-visible"
              style={{ zIndex: 2 }}
            >
              <span
                ref={word1Ref}
                className="word-reveal block font-black uppercase leading-none tracking-tighter text-white"
                style={{
                  fontSize:   "clamp(5.5rem, 16vw, 17rem)",
                  paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
                  // sits at z-2 — in front of image shadow layer, behind athlete cutout
                  mixBlendMode: "normal",
                  letterSpacing: "-0.03em",
                }}
              >
                DISCIPLINE
              </span>
            </div>

            {/* STARTS — overlaps athlete, shifted right, smaller */}
            <div
              className="relative -mt-4 md:-mt-8"
              style={{ zIndex: 4, paddingLeft: "clamp(2.5rem, 10vw, 12rem)" }}
            >
              <span
                ref={word2Ref}
                className="word-reveal block font-black uppercase leading-none text-[#c8a96e] will-change-transform"
                style={{
                  fontSize:    "clamp(3.5rem, 10vw, 11rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                STARTS
              </span>
            </div>

            {/* HERE. — far right, very large, partially off-screen, behind the image */}
            <div
              className="relative -mt-2 md:-mt-4 flex justify-end pr-0"
              style={{ zIndex: 1 }}
            >
              <span
                ref={word3Ref}
                className="word-reveal block font-black uppercase leading-none text-white/10"
                style={{
                  fontSize:    "clamp(5rem, 18vw, 20rem)",
                  letterSpacing: "-0.04em",
                  marginRight: "-4vw",
                }}
              >
                HERE.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── BOTTOM BAR — thin, editorial ─── */}
      {loaded && (
        <div
          className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-8 md:px-16 z-20 pointer-events-none"
        >
          {/* Left — stats column */}
          <div
            className="word-reveal flex gap-10"
            style={{ animationDelay: "1.6s" }}
          >
            {[
              { v: "3,240+", l: "MEMBERS"  },
              { v: "12",     l: "TRAINERS" },
              { v: "08 YRS", l: "IN DHAKA" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-sm font-black text-white leading-none">{s.v}</p>
                <p className="text-[8px] tracking-[0.35em] text-[#555] mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Right — minimal CTA + scroll hint */}
          <div
            className="word-reveal flex flex-col items-end gap-4 pointer-events-auto"
            style={{ animationDelay: "1.8s" }}
          >
            <a
              href="https://wa.me/8801700000000"
              className="group relative text-[10px] tracking-[0.35em] text-white/70 hover:text-white transition-colors duration-300"
            >
              JOIN NOW
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c8a96e] group-hover:w-full transition-all duration-500" />
            </a>
            <a
              href="#about"
              className="flex flex-col items-center gap-1.5 text-[8px] tracking-[0.4em] text-[#444] hover:text-[#666] transition-colors"
            >
              <span
                className="block w-px bg-[#333] mx-auto"
                style={{
                  height: 40,
                  transformOrigin: "top",
                  animation: "scrollLine 2s 2s ease infinite",
                  transform: "scaleY(0)",
                  animationFillMode: "forwards"
                }}
              />
              SCROLL
            </a>
          </div>
        </div>
      )}

      {/* ─── Vertical coordinates — far left, rotated ─── */}
      {loaded && (
        <div
          className="word-reveal hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-px h-12 bg-[#2a2a2a]" />
          <p
            className="text-[7px] tracking-[0.5em] text-[#444]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            E 90.4155°
          </p>
          <div className="w-px h-12 bg-[#2a2a2a]" />
        </div>
      )}
    </section>
  );
}
