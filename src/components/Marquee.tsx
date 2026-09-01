"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* Imperatives rather than abstract nouns — they read as instructions from the
   floor, which is the voice the rest of the page uses. */
const items = [
  "SHOW UP", "LIFT HEAVY", "EAT ENOUGH",
  "SLEEP MORE", "NO SHORTCUTS", "EARN IT",
];

export default function Marquee() {
  const wrap  = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      /* Base crawl. Scroll velocity then modulates this tween, so the strip is
         never fully static and never purely scroll-driven either. */
      const loop = gsap.to(el, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      /* Scroll direction flips the crawl; scroll speed skews and accelerates it.
         This is what makes a marquee read as GSAP rather than a CSS keyframe. */
      const skew = gsap.quickTo(el, "skewX",     { duration: 0.5, ease: "power3.out" });
      const rate = gsap.quickTo(loop, "timeScale", { duration: 0.4, ease: "power2.out" });

      const st = ScrollTrigger.create({
        trigger: wrap.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          /* Clamp hard — a trackpad fling otherwise sends timeScale into the hundreds. */
          const boost = gsap.utils.clamp(-16, 16, self.getVelocity() / 200);
          rate(self.direction * (1 + Math.abs(boost)));
          skew(gsap.utils.clamp(-12, 12, -boost * 0.85));
        },
      });

      /* getVelocity() only decays while scrolling, so settle it on idle. */
      let idle: ReturnType<typeof setTimeout>;
      const onScroll = () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          skew(0);
          rate(st.direction || 1);
        }, 150);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        clearTimeout(idle);
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: wrap }
  );

  return (
    <div
      ref={wrap}
      className="relative border-y border-[#1a1a1a] bg-[#050505] py-7 overflow-hidden"
    >
      {/* Edge fades so words dissolve instead of getting guillotined. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-44"
        style={{ background: "linear-gradient(to right, #050505, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-44"
        style={{ background: "linear-gradient(to left, #050505, transparent)" }}
      />

      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center px-7">
                <span
                  className="font-display text-4xl md:text-6xl"
                  style={{ fontVariationSettings: '"wdth" 104, "wght" 800' }}
                >
                  {t}
                </span>
                <span className="mx-7 h-1.5 w-1.5 rotate-45 bg-[#BFE01D]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
