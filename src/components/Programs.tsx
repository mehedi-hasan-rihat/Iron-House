"use client";
import { motion } from "framer-motion";

const items = [
  { n: "P01", t: "Weight Loss",       d: "12-week body recomposition program.",       size: "big"  },
  { n: "P02", t: "Muscle Building",   d: "Hypertrophy split, progressive overload."               },
  { n: "P03", t: "Strength",          d: "Powerlifting: squat, bench, deadlift."                  },
  { n: "P04", t: "Functional",        d: "Movement patterns, mobility, athleticism.", size: "wide" },
  { n: "P05", t: "HIIT & Cardio",     d: "Fat burn, endurance, VO₂ max."                         },
  { n: "P06", t: "Women's Fitness",   d: "Female-only coaching & studio."                         },
  { n: "P07", t: "Personal Training", d: "1-on-1 with certified coach.",              size: "big"  },
  { n: "P08", t: "Senior Fitness",    d: "Low-impact, joint-safe programming."                    },
];

export default function Programs() {
  return (
    <section id="programs" className="relative bg-[#0b0b0b] py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="label">(04) — Programs</span>
            <h2 className="mt-3 text-display">
              Trained for<br />whatever you&apos;re<br />after.
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 self-end text-[#bdbdbd]">
            Eight signature tracks — every one built and adjusted by our head coaches
            around your goal, your body, and your schedule.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.n}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className={`group relative flex flex-col justify-between overflow-hidden bg-[#111111] p-6 transition-colors hover:bg-[#161616] ${
                it.size === "big"  ? "row-span-2 min-h-[360px]" :
                it.size === "wide" ? "col-span-2 min-h-[220px]" :
                "min-h-[220px]"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="label text-[#BFE01D]">{it.n}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#bdbdbd] transition-transform group-hover:rotate-45 group-hover:text-[#BFE01D]">
                  <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </div>
              <div>
                <h3 className={`font-display leading-none ${it.size === "big" ? "text-5xl md:text-7xl" : "text-3xl md:text-5xl"}`}>
                  {it.t}
                </h3>
                <p className="mt-3 max-w-[260px] text-sm text-[#bdbdbd]">{it.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
