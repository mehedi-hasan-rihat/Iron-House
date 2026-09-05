const items = [
  { n: "01", t: "Your form gets fixed",    d: "A coach walks the floor every hour. Unasked." },
  { n: "02", t: "Plates that weigh right", d: "Calibrated to ±10g. Your log is honest." },
  { n: "03", t: "Women train in peace",    d: "Separate studio, own entrance, 10–4 daily." },
  { n: "04", t: "No equipment queue",      d: "Six racks. We cap peak-hour entry." },
  { n: "05", t: "Food advice that fits",   d: "Plans built on rice and dal, not almond flour." },
  { n: "06", t: "It stays clean",          d: "Full wipe-down twice daily. Steam room included." },
  { n: "07", t: "Your bike is safe",       d: "Covered parking, CCTV, guard on shift till close." },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-2">(03) — Why Iron House</p>
            <h2 className="text-display">
              Seven things<br />
              we actually<br />
              <span className="accent-serif">guarantee.</span>
            </h2>
          </div>
          <p className="max-w-sm body-lg">
            Not features. Promises — the kind you can hold us to on any given Tuesday at 7 pm.
          </p>
        </div>

        <div className="border-t border-[#1a1a1a]">
          {items.map((it) => (
            <div
              key={it.n}
              className="group flex items-center justify-between gap-8 border-b border-[#1a1a1a] py-7 transition-colors hover:border-[#BFE01D]/40"
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="label w-8 shrink-0 text-[#BFE01D]">{it.n}</span>
                <h3 className="font-display text-3xl leading-none transition-colors group-hover:text-[#BFE01D] md:text-5xl">
                  {it.t}
                </h3>
              </div>
              <p className="hidden max-w-[240px] text-right text-sm leading-relaxed text-[#bdbdbd] md:block">
                {it.d}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
