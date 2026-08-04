"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const list = [
  { name: "Rakib Hasan",   role: "Head Strength Coach",  cert: "NASM-CPT · 8 yrs",     img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg" },
  { name: "Ayesha Rahman", role: "Women's Fitness Lead", cert: "ACE · Pre/Post-natal", img: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg" },
  { name: "Tanveer Ahmed", role: "Performance Coach",    cert: "ISSA · Nutrition",     img: "https://iron-house.lovable.app/assets/trainer-3-3mi-LptE.jpg" },
];

/* Each column drifts at its own rate — that offset is what makes the row read
   as three planes at different depths instead of one flat grid. */
const DRIFT = [90, -40, 60];

export default function Trainers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-trainer]");

      cards.forEach((card, i) => {
        const frame = card.querySelector("[data-trainer-frame]");
        const photo = card.querySelector<HTMLImageElement>("[data-trainer-photo]");
        const meta  = card.querySelector("[data-trainer-meta]");

        gsap.set(card, { visibility: "visible" });

        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 84%", once: true } })
          .from(frame, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.4,
            ease: EASE.out,
          })
          .from(photo, { scale: 1.4, duration: 1.6, ease: EASE.out }, 0)
          .from(meta, { yPercent: 60, autoAlpha: 0, duration: 0.9, ease: EASE.out }, 0.35);

        /* Column parallax — desktop only, where there's room for it to read. */
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            card,
            { y: 0 },
            {
              y: -DRIFT[i % DRIFT.length],
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        /* Hover: desaturate → colour, with a slow push-in. */
        if (photo) {
          const enter = () =>
            gsap.to(photo, { filter: "grayscale(0)", scale: 1.06, duration: 0.9, ease: "power3.out" });
          const leave = () =>
            gsap.to(photo, { filter: "grayscale(1)", scale: 1, duration: 0.9, ease: "power3.out" });
          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
        }
      });
    },
    { scope: root }
  );

  return (
    <section id="trainers" ref={root} className="relative bg-[#050505] py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label">(05) — The Coaches</span>
            <SplitReveal as="h2" type="lines" className="mt-3 text-display" stagger={0.09}>
              <>
                The people
                <br />
                behind the <span className="accent-serif">reps.</span>
              </>
            </SplitReveal>
          </div>
          <span className="label">03 / 12 shown</span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((c, i) => (
            <div key={c.name} data-trainer data-anim className="group">
              <div
                data-trainer-frame
                className="relative aspect-3/4 overflow-hidden bg-[#111]"
                style={{ clipPath: "inset(0% 0% 0% 0%)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-trainer-photo
                  src={c.img}
                  alt={c.name}
                  className="h-full w-full object-cover"
                  style={{ filter: "grayscale(1)" }}
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5">
                  <div className="label text-[#BFE01D]">0{i + 1}</div>
                </div>
              </div>
              <div data-trainer-meta className="mt-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl">{c.name}</h3>
                  <div className="mt-1 text-sm text-[#bdbdbd]">{c.role}</div>
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-[0.24em] text-[#bdbdbd]">
                  {c.cert}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
