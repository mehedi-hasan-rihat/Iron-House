"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Direction the content travels in from. */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Travel distance in px. */
  distance?: number;
  delay?: number;
  duration?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number;
  start?: string;
  /** Wipe in with a clip-path instead of translating. Good for images. */
  clip?: boolean;
}

/**
 * The workhorse enter animation. Handles the common "come in on scroll" case so
 * sections only hand-roll a timeline when the effect is genuinely bespoke.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  from = "up",
  distance = 60,
  delay = 0,
  duration = 1.1,
  stagger,
  start = "top 85%",
  clip = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? Array.from(el.children) : el;
      if (stagger && !(targets as Element[]).length) return;

      gsap.set(el, { visibility: "visible" });

      const offset =
        from === "up"    ? { y:  distance } :
        from === "down"  ? { y: -distance } :
        from === "left"  ? { x: -distance } :
        from === "right" ? { x:  distance } :
        {};

      gsap.from(targets, {
        ...offset,
        autoAlpha: 0,
        ...(clip ? { clipPath: "inset(0% 0% 100% 0%)" } : {}),
        duration,
        delay,
        ease: EASE.soft,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-anim className={className}>
      {children}
    </Tag>
  );
}
