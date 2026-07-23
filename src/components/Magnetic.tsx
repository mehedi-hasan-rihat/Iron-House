"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "ghost";
}

export default function Magnetic({
  children,
  className = "",
  href = "#contact",
  variant = "primary",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width  / 2)) * 0.25);
    y.set((e.clientY - (r.top  + r.height / 2)) * 0.25);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base =
    variant === "primary"
      ? "bg-[#BFE01D] text-black hover:bg-[#dbbf7f]"
      : "border border-white/20 text-white hover:border-white";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-xs font-semibold uppercase tracking-[0.24em] transition-colors ${base} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="relative z-10 transition-transform group-hover:translate-x-1">
        <path d="M1 5h16m0 0L13 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </motion.a>
  );
}
