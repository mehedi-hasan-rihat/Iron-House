"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const BEFORE = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";
const AFTER  = "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg";

export default function Transformation() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* ── Before/after wipe, driven entirely by scroll position ──
         The "after" image is clipped to zero width and opens left-to-right as
         the section crosses the viewport, so the user scrubs the result
         themselves. This is the section's whole idea. */
      const after  = root.current?.querySelector("[data-after]");
      const handle = root.current?.querySelector("[data-handle]");
      const frame  = root.current?.querySelector("[data-compare]");

      if (after && handle && frame) {
        gsap.set(frame, { visibility: "visible" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: frame,
              start: "top 78%",
              end: "bottom 55%",
              scrub: 1,
            },
          })
          .fromTo(
            after,
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
            0
          )
          .fromTo(handle, { left: "0%" }, { left: "100%", ease: "none" }, 0);

        /* Frame itself wipes in once, before the comparison starts. */
        gsap.from(frame, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.4,
          ease: EASE.out,
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
        });
      }

      /* ── The −18kg figure counts down as you scroll ── */
      const kg = root.current?.querySelector<HTMLElement>("[data-kg]");
      if (kg) {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: 18,
          ease: "none",
          scrollTrigger: { trigger: kg, start: "top 85%", end: "top 40%", scrub: 1 },
          onUpdate: () => { kg.textContent = String(Math.round(counter.v)); },
        });
      }

      /* Attribution block slides up last. */
      const cite = root.current?.querySelector("[data-cite]");
      if (cite) {
        gsap.set(cite, { visibility: "visible" });
        gsap.from(cite, {
          yPercent: 50,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.out,
          scrollTrigger: { trigger: cite, start: "top 90%", once: true },
        });
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-[#0b0b0b] py-28 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        {/* Quote col */}
        <div className="md:col-span-5">
          <span className="label">(06) — Transformation</span>

          <h2 className="mt-3 text-display">
            &minus;<span data-kg className="tabular-nums">0</span>
            <span className="text-[#BFE01D]">kg</span>
            <br />
            in 22
            <br />
            <span className="accent-serif">weeks.</span>
          </h2>

          <SplitReveal as="blockquote" type="lines" className="mt-10 max-w-md body-lg" stagger={0.05}>
            &ldquo;I had quit two gyms before this one. The difference was that
            somebody here noticed when I stopped coming and messaged me. That is
            the whole story. I did the work, but they made it hard to
            disappear.&rdquo;
          </SplitReveal>

          <div data-cite data-anim className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFE01D]/30 bg-[#BFE01D]/10">
              <span className="font-display text-[#BFE01D]">S</span>
            </div>
            <div>
              <div className="font-medium">Sadia Karim</div>
              <div className="text-sm text-[#bdbdbd]">Member since 2023 · Weight Loss track</div>
            </div>
          </div>
        </div>

        {/* Before / after comparison */}
        <div className="md:col-span-7">
          <div
            data-compare
            data-anim
            className="relative aspect-4/3 w-full overflow-hidden md:aspect-16/11"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BEFORE}
              alt="Before the program"
              className="absolute inset-0 h-full w-full object-cover grayscale"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-after
              src={AFTER}
              alt="After 22 weeks"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}
              loading="lazy"
            />

            {/* Wipe handle rides the clip edge */}
            <div
              data-handle
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px bg-[#BFE01D]"
            >
              <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#BFE01D] bg-[#050505]/60 backdrop-blur-sm" />
            </div>

            <div className="pointer-events-none absolute left-4 top-4 z-10 border border-white/20 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm">
              Before
            </div>
            <div className="pointer-events-none absolute right-4 top-4 z-10 border border-[#BFE01D]/40 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#BFE01D] backdrop-blur-sm">
              After
            </div>
          </div>

          <p className="mt-4 label">Scroll to compare — 22 weeks apart</p>
        </div>
      </div>
    </section>
  );
}
