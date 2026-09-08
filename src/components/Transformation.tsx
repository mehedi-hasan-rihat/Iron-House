const BEFORE = "https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg";
const AFTER  = "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg";

export default function Transformation() {
  return (
    <section className="bg-[#0b0b0b] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        {/* Quote */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <p className="label mb-2">(05) — Transformation</p>
          <h2 className="text-display">
            &minus;18<span className="text-[#BFE01D]">kg</span><br />
            in 22<br />
            <span className="accent-serif">weeks.</span>
          </h2>

          <blockquote className="mt-10 body-lg max-w-md">
            &ldquo;I had quit two gyms before this one. The difference was that
            somebody here noticed when I stopped coming and messaged me. I did
            the work, but they made it hard to disappear.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFE01D]/30 bg-[#BFE01D]/10">
              <span className="font-display text-[#BFE01D]">S</span>
            </div>
            <div>
              <p className="font-medium">Sadia Karim</p>
              <p className="text-sm text-[#bdbdbd]">Member since 2023 · Weight Loss track</p>
            </div>
          </div>
        </div>

        {/* Before / After side by side */}
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BEFORE}
                alt="Before the program"
                className="h-full w-full object-cover grayscale"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 border border-white/20 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm">
                Before
              </span>
            </div>
            <div className="relative overflow-hidden aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AFTER}
                alt="After 22 weeks"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute right-3 top-3 border border-[#BFE01D]/40 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#BFE01D] backdrop-blur-sm">
                After
              </span>
            </div>
          </div>
          <p className="mt-3 label">22 weeks apart</p>
        </div>

      </div>
    </section>
  );
}
