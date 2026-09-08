const list = [
  { name: "Rakib Hasan",   role: "Head Strength Coach",  cert: "NASM-CPT · 8 yrs",    note: "Competed at national powerlifting twice. Will make you deload.",          img: "https://iron-house.lovable.app/assets/trainer-1-DzcfQTt4.jpg" },
  { name: "Ayesha Rahman", role: "Women's Fitness Lead", cert: "ACE · Pre/Post-natal", note: "Ten years coaching women who had never touched a barbell.",              img: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg" },
  { name: "Tanveer Ahmed", role: "Conditioning Coach",   cert: "ISSA · Nutrition",     note: "Ex-footballer. Builds the intervals nobody enjoys and everybody needs.", img: "https://iron-house.lovable.app/assets/trainer-3-3mi-LptE.jpg" },
];

export default function Trainers() {
  return (
    <section id="trainers" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-2">(04) — The Coaches</p>
            <h2 className="text-display">
              They will<br />
              correct <span className="accent-serif">you.</span>
            </h2>
          </div>
          <span className="label">03 of 12 shown</span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((c, i) => (
            <div key={c.name} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                  <span className="label text-[#BFE01D]">0{i + 1}</span>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-1 text-sm text-[#bdbdbd]">{c.role}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[#bdbdbd]">
                    {c.cert}
                  </span>
                </div>
                <p className="mt-4 border-t border-[#1a1a1a] pt-4 text-sm leading-relaxed text-white/45">
                  {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
