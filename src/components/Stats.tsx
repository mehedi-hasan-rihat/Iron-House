"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const start = performance.now();
        const dur   = 1600;
        const step  = (t: number) => {
          const p     = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref} className="tabular-nums">{val.toLocaleString()}{suffix}</span>;
}

const items = [
  { n: 3240, s: "+", label: "Happy Members"       },
  { n: 12,   s: "",  label: "Certified Trainers"  },
  { n: 8,    s: "+", label: "Years in Dhaka"      },
  { n: 98,   s: "%", label: "Member Satisfaction" },
];

export default function Stats() {
  return (
    <section className="border-y border-[#1a1a1a] bg-[#050505] py-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-12 px-5 md:grid-cols-4 md:px-10">
        {items.map((it) => (
          <div key={it.label} className="border-l border-[#1a1a1a] pl-6">
            <div className="font-display text-6xl md:text-8xl">
              <Counter to={it.n} suffix={it.s} />
            </div>
            <div className="mt-3 label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
