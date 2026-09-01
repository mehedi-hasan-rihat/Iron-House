"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  value: number;
  /** Rendered before the number — e.g. the taka sign. */
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Group thousands. Off for IDs and counts under four digits. */
  separator?: boolean;
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * The final value is what renders on the server, so the number is correct
 * before hydration and for anyone with reduced motion on — the animation only
 * ever rewinds it to zero and plays it forward.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className = "",
  separator = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    const out = separator
      ? Number(fixed).toLocaleString("en-BD", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : fixed;
    return `${prefix}${out}${suffix}`;
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || value === 0) return;

      const counter = { n: 0 };
      el.textContent = format(0);

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          gsap.to(counter, {
            n: value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = format(counter.n);
            },
            onComplete: () => {
              el.textContent = format(value);
            },
          });
        },
        { threshold: 0.4 }
      );

      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
