"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** How far the element chases the cursor, as a fraction of the offset. */
  strength?: number;
  /** Inner elements shift further than the box for a bit of parallax. */
  innerStrength?: number;
}

/**
 * Wraps any control — link, button, icon — and pulls it toward the cursor,
 * springing back on leave. Unlike `components/Magnetic`, this one styles
 * nothing; the child keeps its own appearance.
 */
export default function MagneticBox({
  children,
  className = "",
  strength = 0.22,
  innerStrength = 0.12,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      /* Skip on touch — there is no hover, and the listeners would fire on tap. */
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const inner = el.firstElementChild as HTMLElement | null;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const ixTo = inner && gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" });
      const iyTo = inner && gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" });

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        ixTo?.(dx * innerStrength);
        iyTo?.(dy * innerStrength);
      };

      const reset = () => {
        xTo(0);
        yTo(0);
        ixTo?.(0);
        iyTo?.(0);
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", reset);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", reset);
      };
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
