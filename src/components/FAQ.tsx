"use client";
import { useState, useEffect, useRef } from "react";

const faqs = [
  { q: "What is the monthly membership fee?",   a: "Monthly membership starts at BDT 3,500. Quarterly and annual plans reduce the effective monthly cost significantly." },
  { q: "Do you have separate ladies' timing?",  a: "Yes. Female-only hours every morning 06:00–09:00 and evening 19:00–21:00." },
  { q: "Are there female personal trainers?",   a: "Ayesha Rahman leads our women's fitness program. Additional certified female coaches are on staff." },
  { q: "What are your opening hours?",          a: "Saturday–Thursday: 06:00–23:00. Friday: 15:00–22:00." },
  { q: "Do you provide diet plans?",            a: "All Quarterly and above memberships include a nutrition consultation. Custom diet plans available à la carte." },
  { q: "Is parking available?",                 a: "Yes. Secured on-site parking, free for all members." },
];

export default function FAQ() {
  const [open, setOpen]       = useState<number | null>(null);
  const ref                   = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 md:py-40 px-8 md:px-16">

      {/* Two-col header */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 border-b border-[#141414] pb-14 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
      >
        <div>
          <p className="text-[8px] tracking-[0.55em] text-[#c8a96e] mb-5">08 — FAQ</p>
          <h2
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em" }}
          >
            ANSWERS,<br />
            <span className="text-[#1e1e1e]">NO FLUFF.</span>
          </h2>
        </div>
      </div>

      {/* Accordion — full width, no container cap */}
      <div>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border-b border-[#111] transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transitionDelay: visible ? `${i * 60}ms` : "0ms",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-7 text-left group"
              aria-expanded={open === i}
            >
              <span
                className={`text-sm leading-6 transition-colors duration-300 max-w-lg ${
                  open === i ? "text-white" : "text-[#3a3a3a] group-hover:text-[#888]"
                }`}
              >
                {faq.q}
              </span>
              <span
                className={`ml-6 shrink-0 text-base font-light transition-all duration-400 ${
                  open === i ? "rotate-45 text-[#c8a96e]" : "text-[#2a2a2a] group-hover:text-[#444]"
                }`}
              >
                +
              </span>
            </button>
            <div className={`accordion-content ${open === i ? "open" : ""}`}>
              <p className="text-sm text-[#444] leading-7 pb-7 max-w-lg">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
