"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const items = [
  { n: "P01", t: "Weight Loss",       d: "12-week body recomposition program.",       size: "big"  },
  { n: "P02", t: "Muscle Building",   d: "Hypertrophy split, progressive overload."               },
  { n: "P03", t: "Strength",          d: "Powerlifting: squat, bench, deadlift."                  },
  { n: "P04", t: "Functional",        d: "Movement patterns, mobility, athleticism.", size: "wide" },
  { n: "P05", t: "HIIT & Cardio",     d: "Fat burn, endurance, VO₂ max."                          },
  { n: "P06", t: "Women's Fitness",   d: "Female-only coaching & studio."                         },
  { n: "P07", t: "Personal Training", d: "1-on-1 with certified coach.",              size: "big"  },
  { n: "P08", t: "Senior Fitness",    d: "Low-impact, joint-safe programming."                    },
];

export default function Programs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

      /* Cards clip-wipe up in a grid-aware stagger, so the block builds as a
         wave across the rows instead of every tile appearing at once. */
      gsap.set(cards, { visibility: "visible" });
      gsap.from(cards, {
        yPercent: 30,
        autoAlpha: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        ease: EASE.out,
        stagger: { each: 0.07, grid: "auto", from: "start" },
        scrollTrigger: { trigger: cards[0]?.parentElement, start: "top 80%", once: true },
      });

      /* Each card's title drifts against the scroll — small, but it stops the
         grid from feeling like a static screenshot as you pass it. */
      cards.forEach((card) => {
        const title = card.querySelector("[data-card-title]");
        if (!title) return;
        gsap.fromTo(
          title,
          { y: 18 },
          {
            y: -18,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      /* Hover: lift the tile and swing the arrow. */
      cards.forEach((card) => {
        const arrow = card.querySelector("[data-card-arrow]");
        const enter = () => {
          gsap.to(card,  { backgroundColor: "#161616", duration: 0.4, ease: "power2.out" });
          gsap.to(arrow, { rotate: 45, color: "#BFE01D", duration: 0.45, ease: EASE.pop });
        };
        const leave = () => {
          gsap.to(card,  { backgroundColor: "#111111", duration: 0.4, ease: "power2.out" });
          gsap.to(arrow, { rotate: 0, color: "#bdbdbd", duration: 0.45, ease: "power2.out" });
        };
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
      });
    },
    { scope: root }
  );

  return (
    <section id="programs" ref={root} className="relative bg-[#0b0b0b] py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="label">(04) — Programs</span>
            <SplitReveal as="h2" type="lines" className="mt-3 text-display" stagger={0.09}>
              <>
                Trained for
                <br />
                <span className="accent-serif">whatever</span> you&apos;re
                <br />
                after.
              </>
            </SplitReveal>
          </div>
          <SplitReveal
            as="p"
            type="lines"
            className="self-end body-lg md:col-span-5 md:col-start-8"
            stagger={0.05}
          >
            Eight signature tracks — every one built and adjusted by our head coaches
            around your goal, your body, and your schedule.
          </SplitReveal>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((it) => (
            <div
              key={it.n}
              data-card
              data-anim
              className={`group relative flex flex-col justify-between overflow-hidden bg-[#111111] p-6 ${
                it.size === "big"  ? "row-span-2 min-h-[360px]" :
                it.size === "wide" ? "col-span-2 min-h-[220px]" :
                "min-h-[220px]"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="label text-[#BFE01D]">{it.n}</span>
                <svg
                  data-card-arrow
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="text-[#bdbdbd]"
                >
                  <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </div>
              <div data-card-title>
                <h3
                  className={`font-display leading-none ${
                    it.size === "big" ? "text-5xl md:text-7xl" : "text-3xl md:text-5xl"
                  }`}
                >
                  {it.t}
                </h3>
                <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-[#bdbdbd]">{it.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
