"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { useMinuteTick } from "@/lib/use-minute-tick";
import { asFullDate, countdownFor, isRunning, type Countdown } from "@/lib/offer-time";
import type { Offer } from "@/content/offers";
import SplitReveal from "./motion/SplitReveal";

/** The right-hand clock cell. Inverts to black while its row is filled. */
function Deadline({ c }: { c: Countdown }) {
  if (c.state === "ongoing") {
    return (
      <span className="font-mono text-[11px] tracking-[0.22em] text-white/30 transition-colors duration-300 group-hover:text-black/50 group-data-[open=true]:text-black/50">
        No end date
      </span>
    );
  }

  if (c.state === "closed") {
    return (
      <span className="font-mono text-[11px] tracking-[0.22em] text-white/25 transition-colors duration-300 group-hover:text-black/40 group-data-[open=true]:text-black/40">
        Closed
      </span>
    );
  }

  const urgent = c.state === "running" && c.urgent;

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em]">
      {urgent && (
        <span className="accent-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#BFE01D] transition-colors duration-300 group-hover:bg-black group-data-[open=true]:bg-black" />
      )}
      <span
        className={`transition-colors duration-300 group-hover:text-black group-data-[open=true]:text-black ${
          urgent ? "text-[#BFE01D]" : "text-white/45"
        }`}
      >
        {c.state === "date" ? `Ends ${c.text}` : `${c.text} left`}
      </span>
    </span>
  );
}

export default function Offers({ offers }: { offers: Offer[] }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  /* One clock for the whole board — every row derives its countdown from this
     single subscription rather than each running its own interval. */
  const now = useMinuteTick();
  const nowMs = now === null ? null : now * 60_000;

  const running = offers.filter((o) => isRunning(o, nowMs)).length;

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-offer]");
      if (!rows.length) return;

      /* Rows wipe up out of their own overflow box, so the board assembles
         top-down like a results sheet being printed. */
      gsap.set(rows, { visibility: "visible" });
      gsap.from(rows, {
        yPercent: 30,
        autoAlpha: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        ease: EASE.out,
        stagger: 0.08,
        scrollTrigger: { trigger: rows[0].parentElement, start: "top 82%", once: true },
      });
    },
    { scope: root }
  );

  /* Height-animate the panel, then tell ScrollTrigger the page got taller —
     otherwise every trigger below this section is off by the delta. Same
     approach as the FAQ accordion. */
  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);

    const panels = root.current?.querySelectorAll<HTMLElement>("[data-offer-panel]");
    if (!panels) return;

    panels.forEach((panel, idx) => {
      if (idx === next) {
        gsap.to(panel, {
          height: "auto",
          duration: 0.55,
          ease: EASE.out,
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.fromTo(
          panel.firstElementChild,
          { yPercent: 12, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, delay: 0.08, ease: EASE.out }
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
    /* Lighter than its neighbours on purpose — sitting this high in the page,
       the band needs to read as a break in the story rather than more of it.
       Deliberately unnumbered too: the other sections are chapters, this is a
       standing promo that can move without renumbering everything below it. */
    <section
      id="offers"
      ref={root}
      className="relative border-y border-[#1a1a1a] bg-[#0b0b0b] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        {/* ── Header ── */}
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-6">
            {/* The live count leads, rather than sitting at the bottom of the
                column where it was doing no work. */}
            <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]">
              <span className="accent-dot h-1.5 w-1.5 rounded-full bg-[#BFE01D]" />
              <span className="text-[#BFE01D]">{running} offers running</span>
            </span>
            <SplitReveal as="h2" type="lines" className="mt-4 text-display" stagger={0.09}>
              <>
                Running now.
                <br />
                Not for <span className="accent-serif">long.</span>
              </>
            </SplitReveal>
          </div>

          <SplitReveal
            as="p"
            type="lines"
            className="self-end body-lg md:col-span-5 md:col-start-8"
            stagger={0.05}
          >
            We run a handful of things at a time and we publish the end date on
            every one of them. When a date passes, the offer comes off the board.
          </SplitReveal>
        </div>

        {/* ── Board ── */}
        <div className="border-t border-[#1a1a1a]">
          {offers.map((o, i) => {
            const isOpen = open === i;
            const c = countdownFor(o.endsAt, nowMs);

            return (
              <div
                key={o.id}
                data-offer
                data-anim
                className="border-b border-[#1a1a1a]"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`offer-panel-${o.id}`}
                  data-open={isOpen}
                  className="group relative block w-full overflow-hidden text-left"
                >
                  {/* Accent wipe. Fills on hover, stays filled while open — the
                      open row reads as a solid bar rather than a hairline. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-[#BFE01D] transition-transform duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100 group-data-[open=true]:scale-x-100"
                  />

                  <span className="relative flex items-center gap-5 px-3 py-7 md:gap-10 md:px-6 md:py-9">
                    <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-[#BFE01D] transition-colors duration-300 group-hover:text-black group-data-[open=true]:text-black">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 transition-colors duration-300 group-hover:text-black/60 group-data-[open=true]:text-black/60">
                        {o.kicker}
                      </span>
                      <span className="mt-2 block font-display text-3xl leading-[0.95] text-white transition-colors duration-300 group-hover:text-black group-data-[open=true]:text-black md:text-5xl">
                        {o.title}
                      </span>

                      {/* Phone: price and clock ride under the title instead of
                          fighting it for horizontal room. */}
                      <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:hidden">
                        {o.price && (
                          <span className="font-display text-lg text-white transition-colors duration-300 group-hover:text-black group-data-[open=true]:text-black">
                            {o.price}
                          </span>
                        )}
                        <Deadline c={c} />
                      </span>
                    </span>

                    <span className="hidden shrink-0 text-right md:block">
                      {o.was && (
                        <span className="block font-mono text-[11px] text-white/25 line-through transition-colors duration-300 group-hover:text-black/40 group-data-[open=true]:text-black/40">
                          {o.was}
                        </span>
                      )}
                      <span className="block font-display text-2xl text-white transition-colors duration-300 group-hover:text-black group-data-[open=true]:text-black">
                        {o.price ?? "—"}
                      </span>
                    </span>

                    <span className="hidden w-[180px] shrink-0 justify-end md:flex">
                      <Deadline c={c} />
                    </span>

                    <span
                      aria-hidden
                      className={`shrink-0 text-2xl leading-none text-[#BFE01D] transition-[transform,color] duration-300 group-hover:text-black group-data-[open=true]:text-black ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>

                <div
                  id={`offer-panel-${o.id}`}
                  data-offer-panel
                  className="overflow-hidden"
                  style={{ height: i === 0 ? "auto" : 0 }}
                >
                  <div className="grid gap-8 px-3 pb-12 pt-9 md:grid-cols-12 md:px-6">
                    <div className="relative aspect-[5/3] overflow-hidden md:col-span-4 md:aspect-[4/3]">
                      <Image
                        src={o.image}
                        alt=""
                        fill
                        quality={70}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover grayscale"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <p className="body-lg">{o.blurb}</p>
                      <ul className="mt-7 flex flex-col gap-3">
                        {o.terms.map((t) => (
                          <li key={t} className="flex gap-3 text-sm text-white/45">
                            <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-[#BFE01D]" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* The price is already on the row above, so this column
                        carries the deadline instead — the thing that actually
                        decides whether someone acts today. */}
                    <div className="flex flex-col justify-between gap-8 md:col-span-3">
                      <div>
                        <span className="label block">
                          {o.endsAt ? "Closes in" : "No end date"}
                        </span>
                        <span
                          className={`mt-2 block font-display text-4xl leading-none md:text-5xl ${
                            c.state === "running" && c.urgent ? "text-[#BFE01D]" : "text-white"
                          }`}
                        >
                          {c.state === "running"
                            ? c.text
                            : c.state === "date"
                              ? c.text
                              : c.state === "closed"
                                ? "Closed"
                                : "Open"}
                        </span>
                        {o.endsAt && (
                          <span className="mt-3 block text-sm text-white/35">
                            {asFullDate(o.endsAt)}
                          </span>
                        )}
                      </div>
                      <a
                        href={o.ctaHref}
                        className="group/cta inline-flex items-center justify-between gap-3 bg-[#BFE01D] px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-opacity duration-300 hover:opacity-85"
                      >
                        {o.ctaLabel}
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover/cta:translate-x-1">
                          <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
