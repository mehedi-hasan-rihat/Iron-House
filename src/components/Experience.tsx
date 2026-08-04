"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";

/* Each panel names something specific you'd notice walking through — a spec,
   a count, a rule. Generic adjectives were doing no work here. */
const panels = [
  { n: "01", title: "Reception",      meta: "Ground floor",  copy: "Keycard in, bag in a locker, phone on silent. You are training in under four minutes.", img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { n: "02", title: "Strength Floor", meta: "8,400 sq ft",   copy: "Six power racks, four platforms, calibrated plates to 25kg. Chalk is allowed.",         img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg" },
  { n: "03", title: "Cardio Deck",    meta: "Level 2",       copy: "Eighteen machines facing the window. Intervals programmed, not guessed.",               img: "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg"  },
  { n: "04", title: "Combat Room",    meta: "Sprung floor",  copy: "Six heavy bags, a full ring, and pad work with a coach who has actually fought.",       img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg" },
  { n: "05", title: "Women's Studio", meta: "10:00 – 16:00", copy: "Separate entrance, frosted glass, female coaches only. No one is watching you learn.",  img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg" },
];

export default function Experience() {
  const root  = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      /* Pin the viewport and translate the track by its real overflow width, so
         the last panel lands flush at the right edge on any screen size. */
      const distance = () => el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          /* Scroll length tracks horizontal distance — keeps the drag rate
             consistent whether there are 3 panels or 12. */
          end: () => "+=" + distance(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      /* Progress bar mirrors horizontal position. */
      if (bar.current) {
        gsap.fromTo(
          bar.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* Each panel's photo drifts horizontally inside its frame as the panel
         crosses the viewport — the parallax that sells the depth. */
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        const img = panel.querySelector("[data-panel-img]");
        if (!img) return;

        gsap.fromTo(
          img,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );

        /* Caption rises as the panel enters the middle of the screen. */
        const caption = panel.querySelector("[data-panel-caption]");
        if (caption) {
          gsap.set(caption, { visibility: "visible" });
          gsap.from(caption, {
            yPercent: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: EASE.out,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 78%",
              once: true,
            },
          });
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars.containerAnimation === tween) t.kill();
        });
      };
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="relative overflow-hidden bg-[#050505]">
      <div className="flex h-screen flex-col justify-center">

        {/* Header — stays put while the track slides underneath it */}
        <div className="absolute left-5 top-12 z-10 md:left-10 md:top-16">
          <span className="label">(02) — Step Inside</span>
          <h2 className="mt-3 text-section">The Experience</h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={track}
          className="flex h-[70vh] items-center gap-6 pl-[6vw] pr-[6vw] will-change-transform md:gap-8"
        >
          {panels.map((p) => (
            <article
              key={p.n}
              data-panel
              className="relative h-full w-[78vw] shrink-0 overflow-hidden md:w-[46vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-panel-img
                src={p.img}
                alt={p.title}
                className="h-full w-[126%] max-w-none object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

              <div
                data-panel-caption
                data-anim
                className="absolute inset-x-0 bottom-0 p-6 md:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="label text-[#BFE01D]">{p.n}</span>
                  <span className="h-px w-8 bg-white/20" />
                  <span className="label">{p.meta}</span>
                </div>
                <h3 className="mt-3 text-section">{p.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#bdbdbd]">{p.copy}</p>
              </div>

              <div className="absolute right-4 top-4 border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em]">
                {p.n} / {String(panels.length).padStart(2, "0")}
              </div>
            </article>
          ))}
        </div>

        {/* Horizontal progress */}
        <div className="absolute bottom-10 left-5 right-5 md:left-10 md:right-10">
          <div className="h-px w-full bg-[#1a1a1a]">
            <div ref={bar} className="h-px origin-left bg-[#BFE01D]" />
          </div>
        </div>
      </div>
    </section>
  );
}
