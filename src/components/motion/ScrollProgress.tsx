"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface Props {
  /** id of the scrolling element. Omit to track the window. */
  targetId?: string;
  variant?: "bar" | "ring";
  className?: string;
}

/**
 * Progress through the current page's scroll. Reads from an inner scroll
 * container when given one, because the admin shell scrolls `<main>` rather
 * than the document.
 */
export default function ScrollProgress({
  targetId,
  variant = "bar",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const bar = el.querySelector<HTMLElement>("[data-bar]");
      const ring = el.querySelector<SVGCircleElement>("[data-ring]");
      const scroller = targetId ? document.getElementById(targetId) : null;
      if (targetId && !scroller) return;

      const CIRC = 2 * Math.PI * 9;

      const setBar = bar && gsap.quickTo(bar, "scaleX", { duration: 0.35, ease: "power2.out" });
      const setRing =
        ring && gsap.quickTo(ring, "strokeDashoffset", { duration: 0.35, ease: "power2.out" });

      const read = () => {
        const top = scroller ? scroller.scrollTop : window.scrollY;
        const max = scroller
          ? scroller.scrollHeight - scroller.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;
        return max > 0 ? gsap.utils.clamp(0, 1, top / max) : 0;
      };

      const update = () => {
        const p = read();
        setBar?.(p);
        setRing?.(CIRC * (1 - p));
      };

      update();
      const target: HTMLElement | Window = scroller ?? window;
      target.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);

      return () => {
        target.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    },
    { scope: ref, dependencies: [targetId, variant] }
  );

  if (variant === "ring") {
    const CIRC = 2 * Math.PI * 9;
    return (
      <div ref={ref} className={className} aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
          <circle cx="11" cy="11" r="9" fill="none" stroke="rgb(191 224 29 / 0.18)" strokeWidth="2" />
          <circle
            data-ring
            cx="11"
            cy="11"
            r="9"
            fill="none"
            stroke="#BFE01D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} aria-hidden>
      <div
        data-bar
        className="h-full w-full origin-left bg-[#BFE01D]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
