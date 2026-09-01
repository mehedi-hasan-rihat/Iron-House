"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";

/* Retention and attendance say more than a satisfaction score nobody audits. */
const items = [
  { n: 3240, s: "+", label: "Members trained"       },
  { n: 71,   s: "%", label: "Still here after a year" },
  { n: 12,   s: "",  label: "Coaches on the floor"  },
  { n: 8,    s: "",  label: "Years in Dhaka"        },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>("[data-stat]");
      if (!cells.length) return;

      gsap.set(cells, { visibility: "visible" });

      /* One pinned timeline runs the whole block: the rules draw, the numbers
         count, the labels rise — all scrubbed, so the figures land exactly as
         the user scrolls rather than racing ahead on a fixed duration. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      cells.forEach((cell, i) => {
        const rule  = cell.querySelector("[data-stat-rule]");
        const value = cell.querySelector<HTMLElement>("[data-stat-value]");
        const label = cell.querySelector("[data-stat-label]");
        const target = items[i].n;
        const counter = { v: 0 };

        const at = i * 0.12;

        tl.fromTo(rule, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 0.5 }, at)
          .to(
            counter,
            {
              v: target,
              ease: "none",
              duration: 0.85,
              onUpdate: () => {
                if (value) value.textContent = Math.round(counter.v).toLocaleString();
              },
            },
            at
          )
          .from(label, { yPercent: 100, autoAlpha: 0, ease: EASE.out, duration: 0.5 }, at + 0.3);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="border-y border-[#1a1a1a] bg-[#050505] py-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-14 px-5 md:grid-cols-4 md:px-10">
        {items.map((it) => (
          <div key={it.label} data-stat data-anim className="relative pl-6">
            {/* Rule draws downward as the counter runs */}
            <span
              data-stat-rule
              className="absolute left-0 top-0 h-full w-px origin-top bg-[#1a1a1a]"
            />
            <div className="font-display text-6xl leading-none md:text-8xl">
              <span data-stat-value className="tabular-nums">0</span>
              <span className="text-[#BFE01D]">{it.s}</span>
            </div>
            <div className="mt-4 overflow-hidden">
              <div data-stat-label className="label">{it.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
