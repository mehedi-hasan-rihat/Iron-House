"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const EXP1 = "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg";

const pillars = [
  ["01", "Discipline"],
  ["02", "Coaching"],
  ["03", "Equipment"],
  ["04", "Community"],
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
              We built FIT GYM CENTER for the people who show up when nobody&apos;s
              watching. For the ones who understand that transformation isn&apos;t
              loud — it&apos;s consistent. Every square meter of our floor is
              engineered around one idea: give you no excuse.
            </SplitReveal>
            <SplitReveal
              as="p"
              type="lines"
              className="body-lg"
              stagger={0.045}
              duration={0.9}
              delay={0.12}
            >
              International equipment. Certified coaches. A community that lifts
              each other — literally. From Sabujbag to the rest of Dhaka, we are
              raising the standard of what a fitness experience should feel like
              in Bangladesh.
            </SplitReveal>
          </div>

          <div data-about-rule data-anim className="mt-16 h-px w-full bg-[#1a1a1a]" />

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {pillars.map(([n, t]) => (
              <div key={n} data-pillar data-anim>
                <div className="label">{n}</div>
                <div className="mt-2 font-display text-2xl">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
