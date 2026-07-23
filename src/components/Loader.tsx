"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ACC = "#BFE01D";

/* ─────────────────────────────────────
   Dumbbell — proper gym dumbbell shape
   with a progress glow on the bar
───────────────────────────────────── */
function DumbbellIcon({ pct }: { pct: number }) {
  return (
    <svg width="160" height="56" viewBox="0 0 160 56" fill="none" aria-hidden>

      {/* ── LEFT SIDE ── */}
      {/* outer plate (largest) */}
      <rect x="0" y="8"  width="14" height="40" rx="4" fill={ACC} fillOpacity="0.9" />
      {/* middle plate */}
      <rect x="14" y="13" width="10" height="30" rx="3" fill={ACC} fillOpacity="0.75" />
      {/* inner plate (smallest) */}
      <rect x="24" y="19" width="7"  height="18" rx="2" fill={ACC} fillOpacity="0.55" />
      {/* collar */}
      <rect x="31" y="22" width="8"  height="12" rx="2" fill="white" fillOpacity="0.18" />

      {/* ── BAR ── */}
      {/* track */}
      <rect x="39" y="25" width="82" height="6" rx="3" fill="white" fillOpacity="0.06" />
      {/* fill — grows with pct */}
      <rect
        x="39" y="25"
        width={Math.max(0, (pct / 100) * 82)}
        height="6" rx="3"
        fill={ACC}
        fillOpacity="0.9"
      />
      {/* glow on fill end */}
      {pct > 2 && (
        <rect
          x={Math.max(36, 36 + (pct / 100) * 82 - 6)}
          y="24"
          width="8" height="8" rx="4"
          fill={ACC}
          fillOpacity="0.6"
          style={{ filter: "blur(4px)" }}
        />
      )}

      {/* ── RIGHT SIDE ── */}
      {/* collar */}
      <rect x="121" y="22" width="8"  height="12" rx="2" fill="white" fillOpacity="0.18" />
      {/* inner plate */}
      <rect x="129" y="19" width="7"  height="18" rx="2" fill={ACC} fillOpacity="0.55" />
      {/* middle plate */}
      <rect x="136" y="13" width="10" height="30" rx="3" fill={ACC} fillOpacity="0.75" />
      {/* outer plate */}
      <rect x="146" y="8"  width="14" height="40" rx="4" fill={ACC} fillOpacity="0.9" />

    </svg>
  );
}


/* ─────────────────────────────────────
   Slot-machine digit — each digit rolls
   upward as the value changes
───────────────────────────────────── */
function Digit({ value }: { value: number }) {
  return (
    <div className="relative overflow-hidden" style={{ width: "0.62em", height: "1em" }}>
      <motion.div
        className="absolute inset-x-0 top-0"
        animate={{ y: `-${value * 10}%` }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <div
            key={d}
            className="flex items-center justify-center"
            style={{ height: "1em", lineHeight: 1 }}
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function RollingCounter({ value }: { value: number }) {
  /* pad to 3 digits max: "  7" → ["", "", "7"] */
  const str  = String(value).padStart(3, " ");
  const digits = str.split("").map((ch) => (ch === " " ? null : parseInt(ch)));

  return (
    <div
      className="flex items-end font-display tabular-nums"
      style={{
        fontSize: "clamp(4.5rem, 16vw, 12rem)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: ACC,
      }}
    >
      {digits.map((d, i) => (
        d === null ? (
          <div key={i} style={{ width: "0.62em", height: "1em", opacity: 0 }}>0</div>
        ) : (
          <Digit key={i} value={d} />
        )
      ))}
      <span
        className="text-white/25 self-end"
        style={{ fontSize: "0.38em", marginLeft: "0.12em", marginBottom: "0.08em", lineHeight: 1 }}
      >
        %
      </span>
    </div>
  );
}


/* ─────────────────────────────────────
   Main Loader
───────────────────────────────────── */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct]     = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "gone">("loading");
  const rafRef = useRef<number>(0);
  const pRef   = useRef(0);

  /* progress ticker */
  useEffect(() => {
    const tick = () => {
      const p = pRef.current;
      const spd = p < 55 ? 1.3 : p < 80 ? 0.65 : p < 95 ? 0.28 : 0.07;
      pRef.current = Math.min(100, p + spd);
      setPct(Math.round(pRef.current));

      if (pRef.current < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPct(100);
        setTimeout(() => setPhase("done"), 350);
      }
    };
    const t = setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 80);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* curtain exit duration */
  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => { setPhase("gone"); onDone(); }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  if (phase === "gone") return null;

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden" aria-hidden>

      {/* ── loading screen ── */}
      <motion.div
        className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center gap-10"
        animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* top progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            className="h-full origin-left"
            style={{ backgroundColor: ACC, scaleX: pct / 100 }}
          />
        </div>

        {/* dumbbell */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <DumbbellIcon pct={pct} />
        </motion.div>

        {/* wordmark */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACC }} />
          <span className="font-display text-white tracking-[0.45em] text-sm md:text-base">
            IRON HOUSE
          </span>
        </motion.div>

        {/* rolling counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          <RollingCounter value={pct} />
        </motion.div>

        {/* thin progress line */}
        <div className="w-40 md:w-56 h-px bg-white/8 relative overflow-hidden -mt-4">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: ACC, width: `${pct}%` }}
          />
        </div>

        {/* label */}
        <motion.p
          className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.55em]"
          style={{ color: `${ACC}66`, marginTop: "-0.5rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Loading
        </motion.p>

        {/* bottom ghost text */}
        <p
          className="absolute bottom-8 font-display text-[9px] tracking-[0.55em] uppercase"
          style={{ color: "rgba(255,255,255,0.05)" }}
        >
          Discipline begins here
        </p>
      </motion.div>

      {/* ── curtain exit ── */}
      {phase === "done" && (
        <>
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#050505]"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050505]"
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}
    </div>
  );
}
