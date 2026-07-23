"use client";
import Magnetic from "./Magnetic";

const plans = [
  { name: "Monthly",   price: "3,500",  per: "/ month",   perks: ["Full floor access", "Locker & steam", "Group classes"],                                   highlight: false },
  { name: "Quarterly", price: "9,600",  per: "/ 3 months", perks: ["Everything in Monthly", "1 free PT session", "Nutrition consult"],                       highlight: false },
  { name: "Half-Year", price: "18,000", per: "/ 6 months", perks: ["Everything in Quarterly", "3 PT sessions", "Body composition scan"], badge: "Most chosen", highlight: true  },
  { name: "Annual",    price: "32,000", per: "/ year",     perks: ["Everything in Half-Year", "12 PT sessions", "Priority booking"],                         highlight: false },
];

export default function Membership() {
  return (
    <section id="membership" className="relative bg-[#050505] py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="label">(07) — Membership</span>
            <h2 className="mt-3 text-display">Pick your pace.</h2>
          </div>
          <p className="md:col-span-4 md:col-start-8 self-end text-[#bdbdbd]">
            Prices in BDT. No hidden fees. Cancel anytime with 30 days notice.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`group relative flex flex-col justify-between border p-6 md:p-8 transition-colors ${
                p.highlight
                  ? "border-[#BFE01D] bg-[#0b0b0b]"
                  : "border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/30"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-6 bg-[#BFE01D] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-black">
                  {p.badge}
                </div>
              )}
              <div>
                <div className="label">{p.name}</div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-xs text-[#bdbdbd]">৳</span>
                  <span className="font-display text-6xl md:text-7xl">{p.price}</span>
                </div>
                <div className="mt-1 text-xs text-[#bdbdbd]">{p.per}</div>
                <ul className="mt-8 space-y-3 text-sm text-[#bdbdbd]">
                  {p.perks.map((k) => (
                    <li key={k} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-3 shrink-0 bg-[#BFE01D]" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[#bdbdbd] max-w-md">
            The best way to decide is to feel it. Come tour the floor before you commit.
          </p>
          <Magnetic href="#contact" variant="primary">Visit Our Gym</Magnetic>
        </div>
      </div>
    </section>
  );
}
