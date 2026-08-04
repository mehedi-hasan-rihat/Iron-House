"use client";
import { useRef, useCallback, useSyncExternalStore } from "react";
import { gsap, SplitText, useGSAP, EASE } from "@/lib/gsap";

/* Five vertical slabs instead of one full-bleed photo. Alternating drift is
   what turns a flat background into something with depth. */
const COLUMNS = [
  { src: "https://iron-house.lovable.app/assets/hero-1-Bht4wyUw.jpg", dir: -1 },
  { src: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg", dir:  1 },
  { src: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg", dir: -1 },
  { src: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg", dir:  1 },
  { src: "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg",  dir: -1 },
];

const OPEN_HOURS: Record<number, [number, number] | null> = {
  0: [6, 23], 1: [6, 23], 2: [6, 23], 3: [6, 23], 4: [6, 23],
  5: [15, 22],           // Friday
  6: [6, 23],
};

/**
 * The wall clock as an external store. Subscribing this way (rather than
 * setState-in-effect) keeps the server snapshot `null`, so the first client
 * render matches the HTML and hydration stays quiet.
 */
function useMinuteTick(): number | null {
  const subscribe = useCallback((onChange: () => void) => {
    const id = setInterval(onChange, 30_000);
    return () => clearInterval(id);
  }, []);

  return useSyncExternalStore(
    subscribe,
    /* Bucketed to the minute so the snapshot is referentially stable between
       ticks — returning Date.now() here would re-render on every check. */
    () => Math.floor(Date.now() / 60_000),
    () => null
  );
}

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

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      /* ─────────── Entry ───────────
         Runs on mount, not on scroll. Slabs wipe up, then the headline's
         characters cascade out from behind them. */
      const heading = q("[data-hero-title]")[0];
      const split = SplitText.create(heading, {
        type: "chars",
        mask: "chars",
        aria: "auto",
      });

      gsap.set([heading, ...q("[data-hero-meta]"), ...q("[data-col]")], { visibility: "visible" });

      const intro = gsap.timeline({ defaults: { ease: EASE.out } });

      intro
        .from(q("[data-col]"), {
          yPercent: 104,
          duration: 1.5,
          stagger: { each: 0.09, from: "center" },
        })
        .from(q("[data-col-img]"), { scale: 1.45, duration: 1.9 }, 0)
        .from(split.chars, {
          yPercent: 118,
          duration: 1.3,
          stagger: 0.035,
        }, 0.55)
        .from(q("[data-hero-rule]"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
        }, 0.8)
        .from(q("[data-hero-meta]"), {
          y: 26,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.09,
        }, 0.95);

      /* ─────────── Scroll ───────────
         Everything below is scrubbed off the section's own scroll range. */
      const st = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 };

      /* Slabs drift apart at alternating rates and spread horizontally. */
      q("[data-col]").forEach((col, i) => {
        const dir = COLUMNS[i % COLUMNS.length].dir;
        gsap.to(col, {
          yPercent: dir * 14,
          ease: "none",
          scrollTrigger: st,
        });
      });

      /* Headline recedes — scales back and drifts up as you leave. */
      gsap.to(heading, {
        yPercent: -22,
        scale: 0.82,
        autoAlpha: 0.12,
        ease: "none",
        scrollTrigger: { ...st, end: "60% bottom" },
      });

      /* Meta clears out early so it doesn't collide with the manifesto. */
      gsap.to(q("[data-hero-meta]"), {
        autoAlpha: 0,
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "35% bottom", scrub: 1 },
      });

      /* Manifesto fades up in the back half — the payoff for scrolling. */
      gsap.fromTo(
        q("[data-manifesto]"),
        { autoAlpha: 0, yPercent: 40 },
        {
          autoAlpha: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "42% bottom", end: "78% bottom", scrub: 1 },
        }
      );

      /* Scrim deepens as the manifesto arrives, so the type stays readable. */
      gsap.fromTo(
        q("[data-scrim]"),
        { opacity: 0.42 },
        { opacity: 0.78, ease: "none", scrollTrigger: st }
      );

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative h-[230vh] bg-[#050505] md:h-[260vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Image slabs ── */}
        <div className="absolute inset-0 flex">
          {COLUMNS.map((c, i) => (
            <div
              key={c.src + i}
              data-col
              data-anim
              className={`relative h-full flex-1 overflow-hidden ${
                /* Only three slabs fit legibly on a phone. */
                i > 2 ? "hidden md:block" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-col-img
                src={c.src}
                alt=""
                className="h-full w-full scale-110 object-cover grayscale"
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              {/* Hairline between slabs */}
              <span className="absolute inset-y-0 right-0 w-px bg-white/8" />
            </div>
          ))}
        </div>

        {/* Scrim */}
        <div data-scrim className="absolute inset-0 bg-[#050505]" style={{ opacity: 0.42 }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.5) 18%, transparent 45%)," +
              "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, transparent 22%)",
          }}
        />

        {/* ── Headline ──
            mix-blend-difference makes the type invert against whatever slab
            passes behind it. This is the hero's signature. */}
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12">
          <h1
            data-hero-title
            data-anim
            className="text-hero mix-blend-difference"
            style={{ color: "#ffffff" }}
          >
            FIT GYM
            <br />
            CENTER
          </h1>

          <div data-hero-rule className="mt-8 h-px w-full bg-white/15" />

          {/* Meta row */}
          <div className="mt-7 flex flex-wrap items-start justify-between gap-8">
            <div data-hero-meta data-anim className="max-w-md">
              <p className="text-base leading-[1.75] text-white/70 md:text-lg">
                Dhaka&apos;s most serious training floor.{" "}
                <span className="text-white/35">
                  23,000 sq ft, 40+ machines, and twelve coaches who will actually
                  correct your form.
                </span>
              </p>
            </div>

            <div data-hero-meta data-anim className="flex flex-col gap-3">
              <OpenStatus />
              <span className="label">Est. 2016 · Sabujbag, Dhaka</span>
            </div>

            <div data-hero-meta data-anim className="flex flex-wrap items-center gap-4">
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

        {/* ── Manifesto — scrolls in over the slabs ── */}
        <div
          data-manifesto
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 opacity-0"
        >
          <p className="max-w-4xl text-center text-display">
            No shortcuts.
            <br />
            Just <span className="accent-serif">work.</span>
          </p>
        </div>

        {/* ── Scroll cue ── */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="label tracking-[0.4em] text-white/30">Scroll</span>
          <span className="h-10 w-px overflow-hidden bg-white/10">
            <span className="block h-1/2 w-full animate-[scroll-cue_1.9s_ease-in-out_infinite] bg-[#BFE01D]" />
          </span>
        </div>
      </div>
    </section>
  );
}
