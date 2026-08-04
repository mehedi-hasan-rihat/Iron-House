"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, EASE } from "@/lib/gsap";

type SplitUnit = "lines" | "words" | "chars";

interface Props {
  children: ReactNode;
  /** Rendered element. Use a real heading tag so the DOM stays semantic. */
  as?: ElementType;
  className?: string;
  /** Granularity of the reveal. `lines` for paragraphs, `chars` for big type. */
  type?: SplitUnit;
  /** Per-unit stagger in seconds. */
  stagger?: number;
  delay?: number;
  duration?: number;
  /** Scrub the reveal to scroll position instead of firing once on enter. */
  scrub?: boolean;
  /** ScrollTrigger start. Defaults to "top 85%". */
  start?: string;
  /** Adds a slight rotation to each unit — reads more physical on big type. */
  skew?: boolean;
}

/**
 * Masked SplitText reveal: each line/word/char rises out of its own overflow
 * box. This is the single effect that most defines the page's scroll feel, so
 * it lives in one place rather than being re-implemented per section.
 */
export default function SplitReveal({
  children,
  as: Tag = "div",
  className = "",
  type = "lines",
  stagger = 0.08,
  delay = 0,
  duration = 1.1,
  scrub = false,
  start = "top 85%",
  skew = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      /* autoSplit re-splits on font load and container resize; returning the
         tween from onSplit lets SplitText tear it down before each re-split. */
      const split = SplitText.create(el, {
        type,
        mask: type,
        autoSplit: true,
        aria: "auto",
        onSplit: (self) => {
          const targets =
            type === "chars" ? self.chars : type === "words" ? self.words : self.lines;

          gsap.set(el, { visibility: "visible" });

          return gsap.from(targets, {
            yPercent: 115,
            rotate: skew ? 4 : 0,
            duration,
            delay: scrub ? 0 : delay,
            ease: EASE.out,
            stagger: scrub ? { each: stagger, from: "start" } : stagger,
            scrollTrigger: {
              trigger: el,
              start,
              end: scrub ? "bottom 55%" : undefined,
              scrub: scrub ? 1 : false,
              once: !scrub,
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-anim className={className}>
      {children}
    </Tag>
  );
}
