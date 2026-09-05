const items = [
  { n: "P01", t: "Weight Loss",       meta: "12 weeks",    d: "4 sessions a week, weekly weigh-in, built around what you already eat." },
  { n: "P02", t: "Muscle Building",   meta: "16 weeks",    d: "Upper/lower split, load logged every set." },
  { n: "P03", t: "Powerlifting",      meta: "Ongoing",     d: "Squat, bench, deadlift. Meet prep if you want it." },
  { n: "P04", t: "Functional",        meta: "8 weeks",     d: "Carries, sled, mobility — for people whose back hurts from a desk." },
  { n: "P05", t: "Conditioning",      meta: "6 weeks",     d: "Intervals on the deck. Heart rate capped, not guessed." },
  { n: "P06", t: "Women's Fitness",   meta: "Ongoing",     d: "Own studio, own coaches, 10–4 daily." },
  { n: "P07", t: "Personal Training", meta: "Per session", d: "One coach, one hour, your programme revised every fortnight." },
  { n: "P08", t: "Over-50s",          meta: "Ongoing",     d: "Joint-safe loading, balance and bone density." },
];

export default function Programs() {
  return (
    <section id="programs" className="bg-[#0b0b0b] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-2">(04) — Programs</p>
            <h2 className="text-display">
              Pick a track.<br />
              Then <span className="accent-serif">finish</span> it.
            </h2>
          </div>
          <p className="max-w-sm body-lg">
            Eight programmes with a start date and an end date. Your coach writes it down, reviews it every fortnight.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.n}
              className="group flex flex-col justify-between border border-[#1a1a1a] bg-[#111] p-6 transition-colors hover:border-[#BFE01D]/50"
            >
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <span className="label text-[#BFE01D]">{it.n}</span>
                  <span className="ml-3 label text-white/30">{it.meta}</span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl leading-tight md:text-3xl">{it.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#bdbdbd]">{it.d}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
