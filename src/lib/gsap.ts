"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/* Client components are still rendered on the server, so plugin registration
   has to be window-guarded — ScrollTrigger touches the DOM as it registers. */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/* Shared easing vocabulary. Every section pulls from this so the whole page
   decelerates with the same character instead of each block inventing its own. */
export const EASE = {
  /** Long, heavy settle — headlines and large reveals. */
  out: "expo.out",
  /** Slightly softer; panels, cards, images. */
  soft: "power3.out",
  /** Symmetric — for scrubbed timelines that read in both directions. */
  scrub: "none",
  /** Overshoot for small accents only. */
  pop: "back.out(1.7)",
} as const;

/** Duration scale, so timing stays consistent across sections. */
export const DUR = {
  fast: 0.45,
  base: 0.9,
  slow: 1.4,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
