"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const EXP1 = "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg";

/* Concrete figures beat abstract virtues — each pillar carries a number you
   can check rather than a word anyone could claim. */
const pillars = [
  ["23,000", "Sq ft of floor"],
  ["40+",    "Machines & racks"],
  ["17h",    "Open daily"],
  ["1:8",    "Coach to member"],
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* Image: clip-wipe up, with the photo counter-scaling so the reveal feels
         like a curtain lifting rather than a box growing. */
      const frame = root.current?.querySelector("[data-about-frame]");
      const photo = root.current?.querySelector("[data-about-photo]");

      if (frame && photo) {
        gsap.set(frame, { visibility: "visible" });
        gsap
          .timeline({ scrollTrigger: { trigger: frame, start: "top 82%", once: true } })
          .from(frame, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.5,
            ease: EASE.out,
          })
          .from(photo, { scale: 1.35, duration: 1.8, ease: EASE.out }, 0);

        /* Slow drift while the section passes — depth against the static copy. */
        gsap.fromTo(
          photo,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }

      /* Pillars count in from a hairline, staggered left to right. */
      const cells = root.current?.querySelectorAll("[data-pillar]");
      if (cells?.length) {
        gsap.set(cells, { visibility: "visible" });
        gsap.from(cells, {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.out,
          stagger: 0.09,
          scrollTrigger: { trigger: cells[0].parentElement, start: "top 88%", once: true },
        });
      }

      /* The hairline itself draws across before the pillars land. */
      const rule = root.current?.querySelector("[data-about-rule]");
      if (rule) {
        gsap.set(rule, { visibility: "visible" });
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.3,
          ease: EASE.out,
          scrollTrigger: { trigger: rule, start: "top 92%", once: true },
        });
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-[#050505] py-28 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 md:grid-cols-12 md:px-10">

        {/* Image col */}
        <div className="md:col-span-4">
          <span className="label">(01) — The House</span>
          <div
            data-about-frame
            data-anim
            className="mt-8 aspect-3/4 overflow-hidden"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-about-photo
              src={EXP1}
              alt="Trainer coaching an athlete"
              className="h-full w-full scale-110 object-cover"
            />
          </div>
        </div>

        {/* Copy col */}
        <div className="md:col-span-8 md:pl-12">
          <SplitReveal as="h2" type="lines" className="text-display" stagger={0.1}>
            <>
              Not a gym.
              <br />A <span className="accent-serif">standard.</span>
            </>
          </SplitReveal>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <SplitReveal as="p" type="lines" className="body-lg" stagger={0.045} duration={0.9}>
              Most gyms sell you a card and forget your name. We do the opposite.
              Every member gets their form checked, their numbers logged, and a
              coach who notices when you skip a week. That is the entire
              difference, and it is harder than it sounds.
            </SplitReveal>
            <SplitReveal
              as="p"
              type="lines"
              className="body-lg"
              stagger={0.045}
              duration={0.9}
              delay={0.12}
            >
              The floor is built to match. Calibrated plates that actually weigh
              what they say. Racks bolted into concrete. Air conditioning that
              holds through a July session. Nothing here is decorative —
              if it is on the floor, it is because it works.
            </SplitReveal>
          </div>

          <div data-about-rule data-anim className="mt-16 h-px w-full bg-[#1a1a1a]" />

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {pillars.map(([n, t]) => (
              <div key={t} data-pillar data-anim>
                <div className="font-display text-3xl text-[#BFE01D] md:text-4xl">{n}</div>
                <div className="mt-2 label">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
