import Magnetic from "./Magnetic";

const channels = [
  { l: "Call",      v: "+880 1700 000 000", href: "tel:+8801601797188"                     },
  { l: "WhatsApp",  v: "+880 1700 000 000", href: "https://wa.me/8801601797188"            },
  { l: "Instagram", v: "@ironhouse.dhk", href: "https://instagram.com/ironhouse.dhk" },
  { l: "Facebook",  v: "/ironhousebd",   href: "https://facebook.com/ironhousebd"    },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-[#050505] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <p className="label mb-2">(08) — Come In</p>
        <h2 className="text-hero mb-14">
          Discipline<br />
          begins <span className="accent-serif">here.</span>
        </h2>

        <div className="grid gap-12 md:grid-cols-12">

          {/* Channels */}
          <div className="md:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.l}
                  href={c.href}
                  className="group flex items-center justify-between border-b border-[#1a1a1a] py-5 transition-colors hover:border-[#BFE01D]/50"
                >
                  <div>
                    <p className="label">{c.l}</p>
                    <p className="mt-2 font-display text-xl transition-colors group-hover:text-[#BFE01D] md:text-2xl">
                      {c.v}
                    </p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" className="text-[#bdbdbd] transition-colors group-hover:text-[#BFE01D]">
                    <path d="M4 14L14 4M14 4H6M14 4V12" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic href="https://wa.me/8801601797188" variant="primary">Book Free Trial</Magnetic>
              <Magnetic href="https://maps.google.com/?q=Sabujbag+2+Dhaka" variant="ghost">Get Directions</Magnetic>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-5">
            <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-8">
              <p className="label">Address</p>
              <p className="mt-3 font-display text-2xl leading-tight">
                House 42, Road 11<br />
                Sabujbag 2, Dhaka 1212<br />
                Bangladesh
              </p>

              <p className="mt-8 label">Hours</p>
              <div className="mt-3 space-y-2 font-mono text-sm text-[#bdbdbd]">
                <div className="flex justify-between border-b border-[#1a1a1a] pb-2">
                  <span>Sat – Thu</span>
                  <span>06:00 — 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>15:00 — 22:00</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
