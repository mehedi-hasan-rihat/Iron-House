"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  /* dot follows instantly */
  const dotX = useSpring(cursorX, { stiffness: 1000, damping: 60, mass: 0.1 });
  const dotY = useSpring(cursorY, { stiffness: 1000, damping: 60, mass: 0.1 });

  /* ring lags behind — that's the trail effect */
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 22, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 22, mass: 0.5 });

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden]   = useState(true);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        setHidden(false);
      });
    };

    const enter = () => setHidden(false);
    const leave = () => setHidden(true);
    const down  = () => setClicking(true);
    const up    = () => setClicking(false);

    /* detect hoverable elements */
    const trackHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isHoverable = el.closest("a, button, [data-cursor-hover]");
      setHovering(!!isHoverable);
    };

    window.addEventListener("mousemove", move,       { passive: true });
    window.addEventListener("mousemove", trackHover, { passive: true });
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown",  down);
    window.addEventListener("mouseup",    up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", trackHover);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY]);

  /* don't render on touch devices */
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* ── trailing ring ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full border border-[#BFE01D]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
        animate={{
          width:   hovering ? 56 : clicking ? 20 : 36,
          height:  hovering ? 56 : clicking ? 20 : 36,
          opacity: hidden ? 0 : hovering ? 0.6 : 0.35,
          borderColor: hovering ? "#BFE01D" : "rgba(191,224,29,0.5)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* ── sharp dot ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full bg-[#BFE01D]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width:   clicking ? 6 : hovering ? 10 : 7,
          height:  clicking ? 6 : hovering ? 10 : 7,
          opacity: hidden ? 0 : 1,
          backgroundColor: hovering ? "#BFE01D" : "#ffffff",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </>
  );
}
