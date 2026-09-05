"use client";

const EXP1 = "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg";

const pillars = [
  ["23,000", "Sq ft of floor"],
  ["40+", "Machines & racks"],
  ["17h", "Open daily"],
  ["1:8", "Coach to member"],
];

export default function About() {
  return (
    <section id="about" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        {/* Image */}
        <div className="md:col-span-4">
          <p className="label mb-6">(01) — The House</p>
          <div className="aspect-[3/4] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EXP1}
              alt="Trainer coaching an athlete"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="md:col-span-8 md:pl-12">
          <h2 className="text-display">
            Not a gym.<br />
            A <span className="accent-serif">standard.</span>
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <p className="body-lg">
              Most gyms sell you a card and forget your name. We do the opposite.
              Every member gets their form checked, their numbers logged, and a
              coach who notices when you skip a week.
            </p>
            <p className="body-lg">
              Calibrated plates that actually weigh what they say. Racks bolted
              into concrete. Air conditioning that holds through a July session.
              Nothing here is decorative.
            </p>
          </div>

          <div className="mt-14 h-px w-full bg-[#1a1a1a]" />

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {pillars.map(([n, t]) => (
              <div key={t}>
                <div className="font-display text-3xl text-[#BFE01D] md:text-4xl">{n}</div>
                <div className="mt-2 label">{t}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
