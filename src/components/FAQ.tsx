"use client";
import { useState } from "react";

const faqs = [
  { q: "I have never lifted before. Will I look stupid?",
    a: "Everyone here started somewhere, and a coach walks the floor every hour. Your first session is a walkthrough — no weight, no pressure. Book the free trial and see." },
  { q: "What does it actually cost?",
    a: "BDT 3,500 a month, dropping to about 2,670 a month if you pay annually. That covers everything: floor, classes, locker, steam, parking. Personal training is separate." },
  { q: "Can I cancel?",
    a: "Yes, with 30 days notice. We refund unused full months on the longer plans. No cancellation fee, no retention phone call." },
  { q: "Is there a women-only space?",
    a: "Yes — a separate studio with its own entrance and frosted glass, staffed by female coaches, 10 AM to 4 PM every day." },
  { q: "How busy does it get at 7 pm?",
    a: "Busy, but we cap peak-hour entry so the six racks stay usable. Come before 9 AM or after 9:30 PM for an emptier floor." },
  { q: "When are you open?",
    a: "Saturday to Thursday, 6 AM to 11 PM. Friday, 3 PM to 10 PM." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        <div className="md:col-span-4">
          <p className="label mb-2">(08) — FAQ</p>
          <h2 className="text-display">
            Straight<br />
            <span className="accent-serif">answers.</span>
          </h2>
          <p className="mt-8 body-lg">Still unsure? Ring the front desk. A person picks up.</p>
        </div>

        <div className="md:col-span-8">
          <div className="border-t border-[#1a1a1a]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-[#1a1a1a]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-xl leading-snug md:text-2xl">{f.q}</span>
                    <span
                      className={`shrink-0 text-2xl text-[#BFE01D] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <p className="pb-6 body-lg max-w-2xl">{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
