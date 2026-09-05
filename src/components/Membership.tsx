import Magnetic from "./Magnetic";

const plans = [
  {
    name: "Monthly",
    price: "3,500",
    per: "/ month",
    eq: "৳3,500 a month",
    perks: ["Full floor access", "Locker, steam & parking", "All group classes"],
    highlight: false,
  },
  {
    name: "Quarterly",
    price: "9,600",
    per: "/ 3 months",
    eq: "৳3,200 a month",
    perks: ["Everything in Monthly", "1 personal training session", "Nutrition consult"],
    highlight: false,
  },
  {
    name: "Half-Year",
    price: "18,000",
    per: "/ 6 months",
    eq: "৳3,000 a month",
    perks: ["Everything in Quarterly", "3 personal training sessions", "Body composition scan"],
    badge: "Most chosen",
    highlight: true,
  },
  {
    name: "Annual",
    price: "32,000",
    per: "/ year",
    eq: "৳2,670 a month",
    perks: ["Everything in Half-Year", "12 personal training sessions", "Priority class booking"],
    highlight: false,
  },
];

export default function Membership() {
  return (
    <section id="membership" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-2">(07) — Membership</p>
            <h2 className="text-display">
              One floor.<br />
              Four <span className="accent-serif">ways</span> in.
            </h2>
          </div>
          <p className="max-w-sm body-lg">
            Every plan includes the whole gym. Longer commitment costs less per month.
            Cancel with 30 days notice.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col justify-between border p-6 md:p-8 transition-colors ${
                p.highlight
                  ? "border-[#BFE01D] bg-[#0b0b0b]"
                  : "border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/30"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-6 bg-[#BFE01D] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-black">
                  {p.badge}
                </div>
              )}

              <div>
                <p className="label">{p.name}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-xs text-[#bdbdbd]">৳</span>
                  <span className="font-display text-5xl">{p.price}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-[#bdbdbd]">{p.per}</p>
                <p className="mt-3 border-t border-[#1a1a1a] pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#BFE01D]">
                  {p.eq}
                </p>
                <ul className="mt-7 space-y-3 text-sm text-[#bdbdbd]">
                  {p.perks.map((k) => (
                    <li key={k} className="flex items-start gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-[#BFE01D]" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md body-lg">
            Come in, walk the floor, try a session, then decide. The trial costs nothing.
          </p>
          <Magnetic href="#contact" variant="primary">Book a free trial</Magnetic>
        </div>

      </div>
    </section>
  );
}
