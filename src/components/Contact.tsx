"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import Magnetic from "./Magnetic";
import SplitReveal from "./motion/SplitReveal";

const channels = [
  { l: "Call",      v: "+880 1700 000 000", href: "tel:+8801700000000"                     },
  { l: "WhatsApp",  v: "+880 1700 000 000", href: "https://wa.me/8801700000000"            },
  { l: "Instagram", v: "@fitgymcenter.dhk", href: "https://instagram.com/fitgymcenter.dhk" },
  { l: "Facebook",  v: "/fitgymcenterbd",   href: "https://facebook.com/fitgymcenterbd"    },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* Channel rows: each underline draws in, then the row content settles. */
      const rows = gsap.utils.toArray<HTMLElement>("[data-channel]");
      gsap.set(rows, { visibility: "visible" });

      rows.forEach((row, i) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } })
          .from(row, { yPercent: 45, autoAlpha: 0, duration: 0.9, ease: EASE.out, delay: i * 0.06 })
          .from(
            row.querySelector("[data-channel-rule]"),
            { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: EASE.out },
            0.1
          );

        /* Hover: value slides right and the arrow chases it. */
        const value = row.querySelector("[data-channel-value]");
        const arrow = row.querySelector("[data-channel-arrow]");
        row.addEventListener("pointerenter", () => {
          gsap.to(value, { x: 12, color: "#BFE01D", duration: 0.45, ease: EASE.out });
          gsap.to(arrow, { x: 6, y: -6, color: "#BFE01D", duration: 0.45, ease: EASE.out });
        });
        row.addEventListener("pointerleave", () => {
          gsap.to(value, { x: 0, color: "#ffffff", duration: 0.45, ease: EASE.out });
          gsap.to(arrow, { x: 0, y: 0, color: "#bdbdbd", duration: 0.45, ease: EASE.out });
        });
      });

      /* Address card wipes in from its top edge. */
      const card = root.current?.querySelector("[data-address]");
      if (card) {
        gsap.set(card, { visibility: "visible" });
        gsap.from(card, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.3,
          ease: EASE.out,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      }

      /* The closing headline drifts up faster than the page scrolls — the last
         thing you see before the footer, so it gets the strongest treatment. */
      const head = root.current?.querySelector("[data-closer]");
      if (head) {
        gsap.fromTo(
          head,
          { yPercent: 12 },
          {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    },
    { scope: root }
  );

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-[#050505] py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <span className="label">(09) — Come In</span>

        <div data-closer>
          <SplitReveal as="h2" type="chars" className="mt-3 text-hero" stagger={0.028} skew>
            <>
              Discipline
              <br />
              begins <span className="accent-serif">here.</span>
            </>
          </SplitReveal>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-12">

          {/* Channels */}
          <div className="md:col-span-7">
            <div className="grid gap-6 md:grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.l}
                  data-channel
                  data-anim
                  href={c.href}
                  className="group relative flex items-center justify-between py-6"
                >
                  <div>
                    <div className="label">{c.l}</div>
                    <div data-channel-value className="mt-2 font-display text-2xl md:text-3xl">
                      {c.v}
                    </div>
                  </div>
                  <svg
                    data-channel-arrow
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    className="text-[#bdbdbd]"
                  >
                    <path d="M4 14L14 4M14 4H6M14 4V12" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                  <span
                    data-channel-rule
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#1a1a1a] transition-colors group-hover:bg-[#BFE01D]"
                  />
                </a>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Magnetic href="https://wa.me/8801700000000" variant="primary">Book Free Trial</Magnetic>
              <Magnetic href="https://maps.google.com/?q=Sabujbag+2+Dhaka" variant="ghost">Get Directions</Magnetic>
            </div>
          </div>

          {/* Address card */}
          <div className="md:col-span-5">
            <div data-address data-anim className="border border-[#1a1a1a] bg-[#0b0b0b] p-8">
              <div className="label">Address</div>
              <div className="mt-3 font-display text-2xl leading-tight">
                House 42, Road 11
                <br />
                Sabujbag 2, Dhaka 1212
                <br />
                Bangladesh
              </div>

              <div className="mt-8 label">Hours</div>
              <div className="mt-3 space-y-2 font-mono text-sm text-[#bdbdbd]">
                <div className="flex justify-between border-b border-[#1a1a1a] pb-2">
                  <span>Sat – Thu</span>
                  <span>06:00 — 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>15:00 — 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
