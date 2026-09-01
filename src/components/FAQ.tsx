"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

/* Answers commit to specifics — a number, a time, a yes or a no. Vague FAQ
   copy is the fastest way to lose someone who is nearly ready to sign up. */
const faqs = [
  { q: "I have never lifted before. Will I look stupid?", a: "Everyone here started somewhere, and a coach walks the floor every hour precisely so nobody is left guessing. Your first session is a walkthrough — no weight, no pressure. Book the free trial and see." },
  { q: "What does it actually cost?",                     a: "BDT 3,500 a month, dropping to about 2,670 a month if you pay annually. That is everything: floor, classes, locker, steam, parking. Personal training is separate." },
  { q: "Can I cancel?",                                   a: "Yes, with 30 days notice, and we refund unused full months on the longer plans. No cancellation fee and no retention phone call." },
  { q: "Is there a women-only space?",                    a: "Yes — a separate studio with its own entrance and frosted glass, staffed by female coaches, 10 AM to 4 PM every day." },
  { q: "How busy does it get at 7pm?",                    a: "Busy, but we cap peak-hour entry so the six racks stay usable. If you want an empty floor, come before 9 AM or after 9:30 PM." },
  { q: "When are you open?",                              a: "Saturday to Thursday, 6 AM to 11 PM. Friday, 3 PM to 10 PM." },
];

export default function FAQ() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-faq]");
      gsap.set(rows, { visibility: "visible" });
      gsap.from(rows, {
        yPercent: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.out,
        stagger: 0.08,
        scrollTrigger: { trigger: rows[0]?.parentElement, start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  /* Animate the panel open/closed on height, then tell ScrollTrigger the page
     got taller — otherwise every trigger below this section is off by the
     delta once an answer expands. */
  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);

    const panels = root.current?.querySelectorAll<HTMLElement>("[data-faq-panel]");
    if (!panels) return;

    panels.forEach((panel, idx) => {
      const body = panel.firstElementChild;
      if (idx === next) {
        gsap.to(panel, {
          height: "auto",
          duration: 0.55,
          ease: EASE.out,
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.fromTo(
          body,
          { yPercent: 25, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, delay: 0.1, ease: EASE.out }
        );
      } else if (panel.offsetHeight > 0) {
        gsap.to(panel, {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
    });
  };

  return (
    <section ref={root} className="relative bg-[#050505] py-28 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        <div className="md:col-span-4">
          <span className="label">(08) — FAQ</span>
          <SplitReveal as="h2" type="lines" className="mt-3 text-display" stagger={0.09}>
            <>
              Straight
              <br />
              <span className="accent-serif">answers.</span>
            </>
          </SplitReveal>
          <p className="mt-8 max-w-xs body-lg">
            Still unsure? Ring the front desk. A person picks up.
          </p>
        </div>

        <div className="md:col-span-8">
          <div className="border-y border-[#1a1a1a]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  data-faq
                  data-anim
                  className="border-b border-[#1a1a1a] py-6 last:border-b-0"
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="text-section">{f.q}</span>
                    <span
                      className={`shrink-0 text-2xl text-[#BFE01D] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    data-faq-panel
                    className="overflow-hidden"
                    style={{ height: i === 0 ? "auto" : 0 }}
                  >
                    <p className="max-w-2xl pt-4 body-lg">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
