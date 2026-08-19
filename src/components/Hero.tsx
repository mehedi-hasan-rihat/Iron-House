"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, EASE } from "@/lib/gsap";
import { useMinuteTick } from "@/lib/use-minute-tick";

/* One backdrop instead of five slabs. The old hero shipped five full-bleed
   JPEGs straight from the asset host; this ships a single optimised derivative
   plus a thumbnail-sized chip, which is where almost all of the LCP win is. */
const BACKDROP = "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg";
const CHIP     = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";

/* Concrete figures, same set the rest of the page quotes. */
const FACTS = [
  ["23,000", "Sq ft floor"],
  ["40+",    "Machines"],
  ["12",     "Coaches"],
] as const;

const OPEN_HOURS: Record<number, [number, number] | null> = {
  0: [6, 23], 1: [6, 23], 2: [6, 23], 3: [6, 23], 4: [6, 23],
  5: [15, 22],           // Friday
  6: [6, 23],
};

/** Live open/closed pill. A small real-time detail the eye lands on. */
function OpenStatus() {
  const tick = useMinuteTick();

  /* Server and first paint: show the schedule rather than a guessed state. */
  if (tick === null) return <span className="label">Sat–Thu 06:00–23:00</span>;

  const now   = new Date(tick * 60_000);
  const range = OPEN_HOURS[now.getDay()];
  const open  = !!range && now.getHours() >= range[0] && now.getHours() < range[1];

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${open ? "accent-dot bg-[#BFE01D]" : "bg-white/30"}`}
      />
      <span className={open ? "text-[#BFE01D]" : "text-white/40"}>
        {open ? "Open now" : "Closed"}
      </span>
      {range && (
        <span className="text-white/30">
          · {open ? `until ${range[1]}:00` : `opens ${range[0]}:00`}
        </span>
      )}
    </span>
  );
}

/** Accent tick at one corner of the poster frame. */
function CornerTick({ className }: { className: string }) {
  return (
    <span className={`absolute h-3 w-3 border-[#BFE01D]/60 ${className}`} />
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      /* Reduced-motion users get the finished layout and no timelines at all —
         globals.css already forces [data-anim] visible for them. */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Split the two text lines only. The headline also contains the image
           chip, and handing that element to SplitText would shred it. */
        const split = SplitText.create(q("[data-hero-line]"), {
          type: "chars",
          mask: "chars",
          aria: "auto",
        });

        gsap.set(q("[data-anim]"), { visibility: "visible" });

        /* ─────────── Entry ───────────
           Backdrop settles first, then the headline characters cascade out
           from behind their masks, then the frame and the data strip.

           Every target here is distinct from the scrubbed timeline's targets.
           They have to be: a `from` tween writes its start value the moment it
           is created, so a scrubbed tween built afterwards on the same property
           would record that start value as its own resting state. */
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .from(q("[data-hero-img]"), { scale: 1.24, duration: 2 }, 0)
          .from(split.chars, {
            yPercent: 115,
            duration: 1.25,
            stagger: 0.03,
          }, 0.25)
          .from(q("[data-hero-chip]"), {
            clipPath: "inset(0% 100% 0% 0%)",
            duration: 1.1,
          }, 0.75)
          .from(q("[data-hero-frame] > *"), {
            scaleX: 0,
            scaleY: 0,
            duration: 1.1,
            stagger: 0.05,
          }, 0.5)
          .from(q("[data-hero-meta]"), {
            y: 24,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.08,
          }, 0.8)
          .from(q("[data-hero-cell]"), {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.07,
          }, 0.95);

        /* ─────────── Scroll ───────────
           One scrubbed timeline for the whole section. The previous version
           created nine independent ScrollTriggers, all firing on every frame
           of the same scroll range; this is a single set of callbacks with
           tween positions expressed as fractions of the range. */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl
          /* Backdrop drifts down and pushes in — depth against the fixed type. */
          .to(q("[data-hero-photo]"), { yPercent: 9, scale: 1.14, duration: 1 }, 0)
          /* Scrim deepens so the manifesto lands on near-black. */
          .to(q("[data-scrim]"), { opacity: 0.86, duration: 1 }, 0)
          /* Headline recedes rather than scrolling away. Fully out by 0.44 —
             a lingering ghost would sit right underneath the manifesto. */
          .to(q("[data-hero-title]"), {
            yPercent: -14,
            scale: 0.88,
            autoAlpha: 0,
            duration: 0.44,
          }, 0)
          /* Chrome clears early so nothing collides with the manifesto. */
          .to(q("[data-hero-rail]"), { autoAlpha: 0, y: -26, duration: 0.3 }, 0)
          .to(q("[data-hero-strip]"), { autoAlpha: 0, y: 34, duration: 0.34 }, 0)
          .to([...q("[data-hero-frame]"), ...q("[data-hero-cue]")], {
            autoAlpha: 0,
            duration: 0.4,
          }, 0)
          /* Manifesto fades up in the back half — the payoff for scrolling. */
          .fromTo(
            q("[data-manifesto]"),
            { autoAlpha: 0, yPercent: 24 },
            { autoAlpha: 1, yPercent: 0, duration: 0.3 },
            0.46
          );

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative h-[190svh] bg-[#050505]">
      <div className="sticky top-0 h-svh w-full overflow-hidden">

        {/* ── Backdrop ──
            `preload` is the Next 16 replacement for the deprecated `priority`
            prop; it emits the <link rel=preload> for the LCP element. */}
        <div data-hero-photo className="absolute inset-0 will-change-transform">
          <div data-hero-img className="absolute inset-0">
            <Image
              src={BACKDROP}
              alt=""
              fill
              preload
              quality={70}
              sizes="100vw"
              className="object-cover object-center grayscale"
            />
          </div>
        </div>

        {/* Flat scrim — GSAP ramps its opacity across the scroll range. */}
        <div data-scrim className="absolute inset-0 bg-[#050505]" style={{ opacity: 0.5 }} />

        {/* Edge falloff + a low accent bloom, both pure CSS. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.55) 20%, transparent 52%)," +
              "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 26%)," +
              "radial-gradient(80% 60% at 12% 88%, rgba(191,224,29,0.13), transparent 60%)",
          }}
        />

        {/* Grain. Inlined rather than using .grain-overlay, which sets
            position:relative and would fight the absolute placement. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
          }}
        />

        {/* ── Poster frame ──
            Four hairlines plus corner ticks. Draws the eye to a crop the way a
            contact sheet does, and gives the content column its gutters. */}
        <div
          data-hero-frame
          data-anim
          className="pointer-events-none absolute inset-4 z-10 md:inset-7"
        >
          <span className="absolute inset-x-0 top-0 h-px origin-left bg-white/12" />
          <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-white/12" />
          <span className="absolute inset-y-0 left-0 w-px origin-top bg-white/12" />
          <span className="absolute inset-y-0 right-0 w-px origin-bottom bg-white/12" />
          <CornerTick className="left-0 top-0 border-l border-t" />
          <CornerTick className="right-0 top-0 border-r border-t" />
          <CornerTick className="bottom-0 left-0 border-b border-l" />
          <CornerTick className="bottom-0 right-0 border-b border-r" />
        </div>

        {/* ── Content ── */}
        {/* Top padding clears the navbar, which OfferBar pushes down by
            `--offer-bar-h` when it is showing. */}
        <div className="relative z-20 flex h-full flex-col px-6 pb-8 pt-[calc(5rem+var(--offer-bar-h,0px))] md:px-16 md:pb-14 md:pt-[calc(7rem+var(--offer-bar-h,0px))]">

          {/* Top rail. The wrapper is the scrub target, the children are the
              entry targets — see the note on the entry timeline. */}
          <div data-hero-rail className="flex items-start justify-between gap-6">
            <span data-hero-meta data-anim className="label">
              Est. 2016 · Sabujbag, Dhaka
            </span>
            <span data-hero-meta data-anim>
              <OpenStatus />
            </span>
          </div>

          {/* Headline — the chip on the second line is the composition's hinge:
              a photographic object sitting inside the type block. */}
          <div className="flex min-h-0 flex-1 items-center">
            <h1 data-hero-title className="text-hero text-white">
              <span data-hero-line data-anim className="block">
                Fit Gym
              </span>
              <span className="flex items-center gap-[0.16em]">
                <span data-hero-line data-anim className="block">
                  Center
                </span>
                <span
                  data-hero-chip
                  data-anim
                  className="relative hidden h-[0.46em] w-[1.05em] shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-white/15 md:block"
                >
                  <Image
                    src={CHIP}
                    alt=""
                    fill
                    quality={75}
                    sizes="15vw"
                    className="object-cover grayscale brightness-125 contrast-110"
                  />
                </span>
              </span>
            </h1>
          </div>

          {/* ── Data strip ──
              Replaces the old three-block meta row, which wrapped into an
              uneven stack at most widths. A fixed grid keeps the copy, the
              numbers and the CTA on one baseline. */}
          <div
            data-hero-strip
            className="grid shrink-0 grid-cols-2 border-t border-white/12 md:grid-cols-[1.6fr_repeat(3,auto)_1.3fr]"
          >
            <div data-hero-cell data-anim className="col-span-2 py-6 md:col-span-1 md:pr-12">
              <p className="max-w-md text-[0.95rem] leading-[1.7] text-white/70">
                Dhaka&apos;s most serious training floor.{" "}
                <span className="text-white/35">
                  Open seventeen hours a day, with coaches who will actually
                  correct your form.
                </span>
              </p>
            </div>

            {FACTS.map(([value, label], i) => (
              <div
                key={label}
                data-hero-cell
                data-anim
                className={`border-t border-white/12 py-6 md:border-l md:border-t-0 md:px-7 ${
                  /* Phone lays these out two-up, so the right cell needs its own
                     divider; at md every cell gets one. */
                  i === 1 ? "border-l pl-6" : ""
                } ${
                  /* Third fact would orphan on a two-column phone layout. */
                  i === 2 ? "hidden md:block" : ""
                }`}
              >
                <span className="block font-display text-[clamp(1.4rem,2.2vw,2.1rem)] text-white">
                  {value}
                </span>
                <span className="label mt-1.5 block text-[0.6rem]">{label}</span>
              </div>
            ))}

            <div
              data-hero-cell
              data-anim
              className="col-span-2 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/12 py-6 md:col-span-1 md:justify-end md:border-l md:border-t-0 md:pl-10"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-[#BFE01D] px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-opacity duration-300 hover:opacity-85"
              >
                Book free trial
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
              <a
                href="#experience"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                See the floor
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Scroll cue ──
            Moved to the right edge; the data strip now owns the bottom. */}
        <div
          data-hero-cue
          className="pointer-events-none absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
        >
          <span className="label text-[0.6rem] tracking-[0.4em] text-white/30 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="h-14 w-px overflow-hidden bg-white/10">
            <span className="block h-1/2 w-full animate-[scroll-cue_1.9s_ease-in-out_infinite] bg-[#BFE01D]" />
          </span>
        </div>

        {/* ── Manifesto — scrolls in over the backdrop. Deliberately not
            [data-anim]: that flag force-shows elements under reduced motion,
            which would leave this permanently stacked on the headline. ── */}
        <div
          data-manifesto
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 opacity-0"
        >
          <p className="max-w-4xl text-center text-display">
            No shortcuts.
            <br />
            Just <span className="accent-serif">work.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
