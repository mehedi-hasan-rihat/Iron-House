"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "What is the monthly membership fee?",  a: "Monthly membership starts at BDT 3,500. Quarterly and annual plans reduce the effective monthly cost significantly." },
  { q: "Do you have separate ladies' timing?", a: "Yes. Our women-only studio operates daily between 10 AM – 4 PM, with dedicated female trainers." },
  { q: "Are there female personal trainers?",  a: "Absolutely. Our female coaches are ACE / NASM certified, including pre & post-natal specialisations." },
  { q: "What are your opening hours?",         a: "Saturday to Thursday, 6 AM – 11 PM. Friday, 3 PM – 10 PM." },
  { q: "Do you provide diet plans?",           a: "Yes. Every member gets a baseline nutrition plan. Personalised plans are included in Half-Year and Annual memberships." },
  { q: "Is parking available?",               a: "Yes — secure, camera-monitored parking for cars and bikes on-site." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-[#050505] py-24 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        <div className="md:col-span-4">
          <span className="label">(08) — FAQ</span>
          <h2 className="mt-3 text-display">Answers,<br />no fluff.</h2>
        </div>

        <div className="md:col-span-8">
          <div className="divide-y divide-[#1a1a1a] border-y border-[#1a1a1a]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="py-6">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="font-display text-2xl md:text-4xl leading-tight">{f.q}</span>
                    <span className={`text-[#BFE01D] text-2xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 max-w-2xl text-[#bdbdbd]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
