"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** What to stagger. Defaults to the wrapper's direct children. */
  selector?: string;
  /** Per-item delay. */
  stagger?: number;
  delay?: number;
  duration?: number;
  /** Travel distance in px. */
  y?: number;
  /** Start blurred and resolve into focus. */
  blur?: boolean;
  /** Start slightly small. 1 disables. */
  scale?: number;
  /** Fire when this fraction of the wrapper is on screen. */
  threshold?: number;
}

/**
 * The dashboard's enter animation.
 *
 * Deliberately IntersectionObserver-driven rather than ScrollTrigger: dashboard
 * content scrolls inside `<main>`, not the window, and every ScrollTrigger would
 * need a matching `scroller` — one wrong scroller and the trigger never fires.
 * An observer against the viewport works for both shells unchanged.
 */
export default function Stagger({
  children,
  as: Tag = "div",
  className = "",
  selector,
  stagger = 0.06,
  delay = 0,
  duration = 0.75,
  y = 22,
  blur = true,
  scale = 1,
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = selector
        ? Array.from(el.querySelectorAll(selector))
        : Array.from(el.children);

      if (!targets.length || prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      /* Hide the items, then reveal the wrapper — otherwise the wrapper flips
         visible for a frame with its children still at final position. */
      gsap.set(targets, {
        y,
        autoAlpha: 0,
        scale,
        ...(blur ? { filter: "blur(8px)" } : {}),
      });
      gsap.set(el, { visibility: "visible" });

      const play = () =>
        gsap.to(targets, {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ...(blur ? { filter: "blur(0px)" } : {}),
          duration,
          delay,
          ease: EASE.soft,
          stagger,
          clearProps: "filter,scale",
        });

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          play();
        },
        { threshold }
      );

      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [selector] }
  );

  return (
    <Tag ref={ref} data-anim className={className}>
      {children}
    </Tag>
  );
}
