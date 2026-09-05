"use client";
import { useState } from "react";
import Image from "next/image";
import type { Offer } from "@/content/offers";

export default function Offers({ offers }: { offers: Offer[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="offers" className="border-y border-[#1a1a1a] bg-[#0b0b0b] py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#BFE01D] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BFE01D] accent-dot" />
              {offers.length} offers available
            </span>
            <h2 className="text-display">
              Running now.<br />
              Not for <span className="accent-serif">long.</span>
            </h2>
          </div>
          <p className="max-w-sm body-lg">
            We publish the end date on every offer. When it passes, it comes off the board.
          </p>
        </div>

        {/* Board */}
        <div className="border-t border-[#1a1a1a]">
          {offers.map((o, i) => {
            const isOpen = open === i;
            return (
              <div key={o.id} className="border-b border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 px-3 py-7 text-left transition-colors hover:bg-[#BFE01D]/5 md:px-6 md:py-8"
                >
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-[#BFE01D]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {o.kicker}
                    </span>
                    <span className="mt-1 block font-display text-2xl leading-tight md:text-4xl">
                      {o.title}
                    </span>
                  </span>

                  {o.price && (
                    <span className="hidden shrink-0 font-display text-xl text-white md:block">
                      {o.price}
                    </span>
                  )}

                  {o.endsAt && (
                    <span className="hidden shrink-0 font-mono text-[11px] tracking-[0.2em] text-white/40 md:block">
                      Ends {new Date(o.endsAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dhaka" })}
                    </span>
                  )}

                  <span
                    className={`shrink-0 text-2xl leading-none text-[#BFE01D] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="grid gap-8 px-3 pb-12 pt-6 md:grid-cols-12 md:px-6">
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
                      <ul className="mt-6 flex flex-col gap-3">
                        {o.terms.map((t) => (
                          <li key={t} className="flex gap-3 text-sm text-white/45">
                            <span className="mt-[0.55em] h-px w-4 shrink-0 bg-[#BFE01D]" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-6 md:col-span-3">
                      {o.price && (
                        <div>
                          {o.was && (
                            <p className="font-mono text-[11px] text-white/25 line-through">{o.was}</p>
                          )}
                          <p className="font-display text-4xl">{o.price}</p>
                        </div>
                      )}
                      <a
                        href={o.ctaHref}
                        className="inline-flex items-center justify-between gap-3 bg-[#BFE01D] px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-opacity hover:opacity-85"
                      >
                        {o.ctaLabel}
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                          <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
