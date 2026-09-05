const panels = [
  { n: "01", title: "Reception",      meta: "Ground floor",  copy: "Keycard in, bag in a locker, phone on silent. You are training in under four minutes.",         img: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg"  },
  { n: "02", title: "Strength Floor", meta: "8,400 sq ft",   copy: "Six power racks, four platforms, calibrated plates to 25 kg. Chalk is allowed.",               img: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg" },
  { n: "03", title: "Cardio Deck",    meta: "Level 2",       copy: "Eighteen machines facing the window. Intervals programmed, not guessed.",                      img: "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg"  },
  { n: "04", title: "Combat Room",    meta: "Sprung floor",  copy: "Six heavy bags, a full ring, and pad work with a coach who has actually fought.",               img: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg" },
  { n: "05", title: "Women's Studio", meta: "10:00 – 16:00", copy: "Separate entrance, frosted glass, female coaches only. No one is watching you learn.",         img: "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg" },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <p className="label mb-2">(02) — Step Inside</p>
        <h2 className="text-section mb-12">The Experience</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {panels.map((p) => (
            <div key={p.n} className="group relative overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="label text-[#BFE01D]">{p.n} · {p.meta}</p>
                <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#bdbdbd] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {p.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
