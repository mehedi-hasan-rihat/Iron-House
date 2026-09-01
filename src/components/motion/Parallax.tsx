"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  className?: string;
  /** Positive drifts slower than scroll, negative overtakes it. */
  speed?: number;
  /** Scale the inner image up so the drift never exposes an edge. */
  overscan?: boolean;
}

/**
 * Scrub-linked vertical drift. Wraps content and moves it against the scroll,
 * which is what gives stacked sections depth instead of flat sliding.
 */
export default function Parallax({
  children,
  className = "",
  speed = 0.2,
  overscan = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const target = inner.current;
      if (!el || !target) return;

      gsap.fromTo(
        target,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        ref={inner}
        className="h-full w-full"
        style={overscan ? { scale: 1 + Math.abs(speed) } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
