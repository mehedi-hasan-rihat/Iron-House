"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Drives Lenis from GSAP's ticker rather than its own rAF loop, and feeds every
 * Lenis scroll event into ScrollTrigger.update(). Without this bridge the
 * smoothed scroll position and ScrollTrigger's idea of scroll drift apart, and
 * pinned sections judder.
 *
 * Also flips `.gsap-ready` on <html>, which is what un-hides `[data-anim]`
 * elements — see globals.css.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion()) {
      root.classList.add("gsap-ready");
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      /* Native scroll on touch — smoothing a touch drag fights the OS. */
      syncTouch: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    /* GSAP throttles after a lag spike; that desyncs Lenis. Disable it. */
    gsap.ticker.lagSmoothing(0);

    root.classList.add("gsap-ready");

    /* Late-loading images change section heights and invalidate every trigger. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      root.classList.remove("gsap-ready");
    };
  }, []);

  return null;
}
