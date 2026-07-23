"use client";
import { motion } from "framer-motion";

const list = [
  { name: "Rakib Hasan",   role: "Head Strength Coach",  cert: "NASM-CPT · 8 yrs",     img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg" },
  { name: "Ayesha Rahman", role: "Women's Fitness Lead", cert: "ACE · Pre/Post-natal",  img: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg" },
  { name: "Tanveer Ahmed", role: "Performance Coach",    cert: "ISSA · Nutrition",      img: "https://iron-house.lovable.app/assets/trainer-3-3mi-LptE.jpg" },
];

export default function Trainers() {
  return (
    <section id="trainers" className="relative bg-[#050505] py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label">(05) — The Coaches</span>
            <h2 className="mt-3 text-display">The people<br />behind the reps.</h2>
          </div>
          <span className="label">03 / 12 shown</span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-[#111]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5">
                  <div className="label text-[#BFE01D]">0{i + 1}</div>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl">{c.name}</h3>
                  <div className="mt-1 text-sm text-[#bdbdbd]">{c.role}</div>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.24em] text-[#bdbdbd]">{c.cert}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
