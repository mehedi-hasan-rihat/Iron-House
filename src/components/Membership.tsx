"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import Magnetic from "./Magnetic";
import SplitReveal from "./motion/SplitReveal";

const plans = [
  { name: "Monthly",   price: "3,500",  per: "/ month",    perks: ["Full floor access", "Locker & steam", "Group classes"],                                    highlight: false },
  { name: "Quarterly", price: "9,600",  per: "/ 3 months", perks: ["Everything in Monthly", "1 free PT session", "Nutrition consult"],                          highlight: false },
  { name: "Half-Year", price: "18,000", per: "/ 6 months", perks: ["Everything in Quarterly", "3 PT sessions", "Body composition scan"], badge: "Most chosen",  highlight: true  },
  { name: "Annual",    price: "32,000", per: "/ year",     perks: ["Everything in Half-Year", "12 PT sessions", "Priority booking"],                           highlight: false },
];

export default function Membership() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-plan]");
      if (!cards.length) return;

      gsap.set(cards, { visibility: "visible" });

      const mm = gsap.matchMedia();

      /* ── Mobile: cards stack under one another and scale back as the next
         one slides over, so the column reads as a deck being dealt. ── */
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.9,
            autoAlpha: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 90%",
              end: "top 40%",
              scrub: true,
            },
          });
        });

        gsap.from(cards, {
          yPercent: 25,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.out,
          stagger: 0.1,
          scrollTrigger: { trigger: cards[0].parentElement, start: "top 85%", once: true },
        });
      });

      /* ── Desktop: the four columns rise in sequence, each clipped from the
         bottom, with the highlighted plan overshooting slightly higher. ── */
      mm.add("(min-width: 768px)", () => {
        gsap.from(cards, {
          yPercent: 22,
          autoAlpha: 0,
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.25,
          ease: EASE.out,
          stagger: 0.11,
          scrollTrigger: { trigger: cards[0].parentElement, start: "top 82%", once: true },
        });

        /* Columns drift at alternating rates while the section passes. */
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 0 },
            {
              y: i % 2 === 0 ? -34 : -12,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });

      /* Perk rows tick in one at a time inside each card. */
      cards.forEach((card) => {
        const perks = card.querySelectorAll("[data-perk]");
        if (!perks.length) return;
        gsap.from(perks, {
          x: -14,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE.out,
          stagger: 0.07,
          scrollTrigger: { trigger: card, start: "top 78%", once: true },
        });
      });

      /* Hover lifts the card off the page. */
      cards.forEach((card) => {
        const enter = () => gsap.to(card, { y: "-=14", duration: 0.5, ease: EASE.out, overwrite: "auto" });
        const leave = () => gsap.to(card, { y: "+=14", duration: 0.5, ease: EASE.out, overwrite: "auto" });
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
      });
    },
    { scope: root }
  );

  return (
    <section id="membership" ref={root} className="relative bg-[#050505] py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="label">(07) — Membership</span>
            <SplitReveal as="h2" type="lines" className="mt-3 text-display" stagger={0.09}>
              <>
                Pick your <span className="accent-serif">pace.</span>
              </>
            </SplitReveal>
          </div>
          <SplitReveal
            as="p"
            type="lines"
            className="self-end body-lg md:col-span-4 md:col-start-8"
            stagger={0.05}
          >
            Prices in BDT. No hidden fees. Cancel anytime with 30 days notice.
          </SplitReveal>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              data-plan
              data-anim
              className={`group relative flex flex-col justify-between border p-6 md:p-8 ${
                p.highlight
                  ? "border-[#BFE01D] bg-[#0b0b0b]"
                  : "border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/30"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-6 bg-[#BFE01D] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-black">
                  {p.badge}
                </div>
              )}
              <div>
                <div className="label">{p.name}</div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-xs text-[#bdbdbd]">৳</span>
                  <span className="font-display text-6xl md:text-7xl">{p.price}</span>
                </div>
                <div className="mt-1 font-mono text-xs text-[#bdbdbd]">{p.per}</div>
                <ul className="mt-8 space-y-3 text-sm text-[#bdbdbd]">
                  {p.perks.map((k) => (
                    <li key={k} data-perk className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-3 shrink-0 bg-[#BFE01D]" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <SplitReveal as="p" type="lines" className="max-w-md body-lg" stagger={0.05}>
            The best way to decide is to feel it. Come tour the floor before you commit.
          </SplitReveal>
          <Magnetic href="#contact" variant="primary">Visit Our Gym</Magnetic>
        </div>
      </div>
    </section>
  );
}
