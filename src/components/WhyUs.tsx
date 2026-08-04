"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import SplitReveal from "./motion/SplitReveal";

const items = [
  { t: "International Equipment",  d: "Rogue · Technogym · Hammer Strength.", n: "01", img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg" },
  { t: "Certified Trainers",       d: "ACE, NASM & ISSA certified coaches.",  n: "02", img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg" },
  { t: "Women's Fitness",          d: "Female-only hours, female trainers.",  n: "03", img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg" },
  { t: "Functional Training",      d: "TRX, rigs, plyo, mobility zone.",      n: "04", img: "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg" },
  { t: "Nutrition Planning",       d: "Custom diet plans by dietitians.",     n: "05", img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg" },
  { t: "Locker · Steam · Parking", d: "Full amenities, secured parking.",     n: "06", img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg" },
  { t: "24/7 Security",            d: "CCTV, keycard access, on-site staff.", n: "07", img: "https://iron-house.lovable.app/assets/trainer-3-3mi-LptE.jpg" },
];

export default function WhyUs() {
  const root    = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");

      /* Rows rise in sequence as the list scrolls through — reads as the list
         assembling itself rather than seven independent fades. */
      rows.forEach((row) => {
        gsap.set(row, { visibility: "visible" });
        gsap.from(row, {
          yPercent: 45,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.out,
          scrollTrigger: { trigger: row, start: "top 92%", once: true },
        });
      });

      /* ── Cursor-following image preview (pointer devices only) ── */
      const card = preview.current;
      const list = rowsRef.current;
      if (!card || !list || !window.matchMedia("(pointer: fine)").matches) return;

      const imgs = gsap.utils.toArray<HTMLElement>("[data-preview-img]");

      const toX = gsap.quickTo(card, "x", { duration: 0.55, ease: "power3.out" });
      const toY = gsap.quickTo(card, "y", { duration: 0.55, ease: "power3.out" });
      /* Tilt is driven by pointer speed, so a fast sweep whips the card. */
      const toR = gsap.quickTo(card, "rotate", { duration: 0.7, ease: "power3.out" });

      let lastX = 0;
      let active = -1;

      const onMove = (e: PointerEvent) => {
        const r = list.getBoundingClientRect();
        toX(e.clientX - r.left + 28);
        toY(e.clientY - r.top - 130);
        toR(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };

      const show = (i: number) => {
        if (i === active) return;
        active = i;
        gsap.to(imgs, { autoAlpha: 0, duration: 0.25, overwrite: true });
        gsap.to(imgs[i], { autoAlpha: 1, duration: 0.35, overwrite: true });
        gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE.out, overwrite: "auto" });
      };

      const hide = () => {
        active = -1;
        gsap.to(card, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: "power2.out", overwrite: "auto" });
      };

      const cleanups = rows.map((row, i) => {
        const label = row.querySelector<HTMLElement>("[data-row-title]");
        const rule  = row.querySelector<HTMLElement>("[data-row-rule]");

        const enter = () => {
          show(i);
          gsap.to(label, { x: 28, color: "#BFE01D", duration: 0.5, ease: EASE.out });
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: EASE.out });
        };
        const leave = () => {
          gsap.to(label, { x: 0, color: "#ffffff", duration: 0.5, ease: EASE.out });
          gsap.to(rule, { scaleX: 0, duration: 0.4, ease: "power2.in" });
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
        return () => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        };
      });

      list.addEventListener("pointermove", onMove);
      list.addEventListener("pointerleave", hide);

      return () => {
        cleanups.forEach((fn) => fn());
        list.removeEventListener("pointermove", onMove);
        list.removeEventListener("pointerleave", hide);
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-[#050505] py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label">(03) — Why FIT GYM Center</span>
            <SplitReveal as="h2" type="lines" className="mt-3 text-display" stagger={0.09}>
              <>
                Everything you
                <br />
                expect. And <span className="accent-serif">more</span>
                <br />
                you don&apos;t.
              </>
            </SplitReveal>
          </div>
          <SplitReveal as="p" type="lines" className="max-w-sm body-lg" stagger={0.05}>
            Seven reasons Dhaka&apos;s most committed athletes call this home.
          </SplitReveal>
        </div>

        {/* List + floating preview share a positioning context */}
        <div ref={rowsRef} className="relative">
          {/* Preview card — sits under the pointer, above the rows */}
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[260px] w-[200px] overflow-hidden opacity-0 md:block"
            style={{ scale: 0.9 }}
          >
            {items.map((it) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={it.n}
                data-preview-img
                src={it.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0"
                loading="lazy"
              />
            ))}
          </div>

          <div className="border-y border-[#1a1a1a]">
            {items.map((it) => (
              <div
                key={it.n}
                data-row
                data-anim
                className="group relative flex cursor-default items-center justify-between gap-8 border-b border-[#1a1a1a] py-8 last:border-b-0 md:py-10"
              >
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className="label w-8 shrink-0">{it.n}</span>
                  <h3
                    data-row-title
                    className="font-display text-4xl leading-none md:text-7xl"
                  >
                    {it.t}
                  </h3>
                </div>
                <div className="hidden max-w-[220px] text-right text-sm leading-relaxed text-[#bdbdbd] md:block">
                  {it.d}
                </div>
                <span
                  data-row-rule
                  className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-[#BFE01D]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
