import Magnetic from "./Magnetic";
import prisma from "@/lib/prisma";

/** Maps DB plan type → display config so the UI stays consistent with the landing copy */
const PLAN_META: Record<string, { per: string; eq: string; badge?: string; highlight?: boolean }> = {
  MONTHLY:    { per: "/ month",    eq: "৳3,500 a month"  },
  QUARTERLY:  { per: "/ 3 months", eq: "৳3,200 a month"  },
  HALF_YEARLY:{ per: "/ 6 months", eq: "৳3,000 a month",  badge: "Most chosen", highlight: true },
  YEARLY:     { per: "/ year",     eq: "৳2,670 a month"  },
};

/** Fallback static list so the section renders even without a DB connection */
const FALLBACK = [
  { id: null, name: "Monthly",   price: 3500,  type: "MONTHLY"     },
  { id: null, name: "Quarterly", price: 9600,  type: "QUARTERLY"   },
  { id: null, name: "Half-Year", price: 18000, type: "HALF_YEARLY" },
  { id: null, name: "Annual",    price: 32000, type: "YEARLY"      },
];

const PERKS: Record<string, string[]> = {
  MONTHLY:     ["Full floor access", "Locker, steam & parking", "All group classes"],
  QUARTERLY:   ["Everything in Monthly", "1 personal training session", "Nutrition consult"],
  HALF_YEARLY: ["Everything in Quarterly", "3 personal training sessions", "Body composition scan"],
  YEARLY:      ["Everything in Half-Year", "12 personal training sessions", "Priority class booking"],
};

export default async function Membership() {
  // Fetch live plans from DB — fall back to static if unavailable
  let plans: { id: string | null; name: string; price: number; type: string }[] = FALLBACK;
  try {
    const dbPlans = await prisma.membershipPlan.findMany({
      where:   { isActive: true, trialEnabled: false },
      orderBy: { price: "asc" },
    });
    if (dbPlans.length > 0) {
      plans = dbPlans.map((p) => ({
        id:    p.id,
        name:  p.name,
        price: Number(p.price),
        type:  p.type,
      }));
    }
  } catch {
    // DB not available during build — use fallback
  }

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
          {plans.map((p) => {
            const meta  = PLAN_META[p.type] ?? { per: "", eq: "" };
            const perks = PERKS[p.type]     ?? [];
            const ctaHref = p.id ? `/checkout?plan=${p.id}` : "/login";

            return (
              <div
                key={p.name}
                className={`relative flex flex-col justify-between border p-6 md:p-8 transition-colors ${
                  meta.highlight
                    ? "border-[#BFE01D] bg-[#0b0b0b]"
                    : "border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/30"
                }`}
              >
                {meta.badge && (
                  <div className="absolute -top-3 left-6 bg-[#BFE01D] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-black">
                    {meta.badge}
                  </div>
                )}

                <div>
                  <p className="label">{p.name}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-xs text-[#bdbdbd]">৳</span>
                    <span className="font-display text-5xl">{p.price.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#bdbdbd]">{meta.per}</p>
                  <p className="mt-3 border-t border-[#1a1a1a] pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#BFE01D]">
                    {meta.eq}
                  </p>
                  <ul className="mt-7 space-y-3 text-sm text-[#bdbdbd]">
                    {perks.map((k) => (
                      <li key={k} className="flex items-start gap-3">
                        <span className="mt-2 h-px w-3 shrink-0 bg-[#BFE01D]" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA — links to checkout (or login if no DB plan ID yet) */}
                <a
                  href={ctaHref}
                  className={`mt-8 flex items-center justify-center gap-2 border py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                    meta.highlight
                      ? "border-[#BFE01D] bg-[#BFE01D] text-black hover:opacity-85"
                      : "border-[#BFE01D]/40 text-[#BFE01D] hover:bg-[#BFE01D] hover:text-black"
                  }`}
                >
                  Get started
                  <svg width="14" height="7" viewBox="0 0 16 8" fill="none">
                    <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              </div>
            );
          })}
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
