"use client";
import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  /** id of the scrolling element. Omit to scroll the window. */
  targetId?: string;
  className?: string;
}

/**
 * Fades in once there's meaningful scroll behind you, then eases back to the
 * top. Tweening `scrollTop` rather than `scrollTo({behavior:"smooth"})` so the
 * curve matches everything else on the page.
 */
export default function BackToTop({ targetId, className = "" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      scroller.current = targetId ? document.getElementById(targetId) : null;
      if (targetId && !scroller.current) return;

      const target: HTMLElement | Window = scroller.current ?? window;
      gsap.set(el, { autoAlpha: 0, y: 12 });

      let shown = false;
      const update = () => {
        const top = scroller.current ? scroller.current.scrollTop : window.scrollY;
        const next = top > 400;
        if (next === shown) return;
        shown = next;
        gsap.to(el, {
          autoAlpha: next ? 1 : 0,
          y: next ? 0 : 12,
          duration: prefersReducedMotion() ? 0 : 0.4,
          ease: "power3.out",
        });
      };

      update();
      target.addEventListener("scroll", update, { passive: true });
      return () => target.removeEventListener("scroll", update);
    },
    { scope: ref, dependencies: [targetId] }
  );

  const toTop = () => {
    const node = scroller.current;
    const read = () => (node ? node.scrollTop : window.scrollY);
    const write = (v: number) => (node ? (node.scrollTop = v) : window.scrollTo(0, v));

    if (prefersReducedMotion()) {
      write(0);
      return;
    }

    /* Tween a proxy and write the position each frame — same easing vocabulary
       as the rest of the page, and no ScrollToPlugin dependency. */
    const proxy = { y: read() };
    gsap.to(proxy, {
      y: 0,
      duration: 0.9,
      ease: "expo.inOut",
      onUpdate: () => write(proxy.y),
    });
  };

  return (
    <button
      ref={ref}
      onClick={toTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 h-11 w-11 flex items-center justify-center
        border border-[#BFE01D]/30 bg-[#0d0f08]/90 backdrop-blur text-[#BFE01D]
        hover:bg-[#BFE01D] hover:text-black transition-colors ${className}`}
    >
      <ArrowUp size={16} />
    </button>
  );
}
