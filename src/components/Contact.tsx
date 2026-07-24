"use client";
import Magnetic from "./Magnetic";

const channels = [
  { l: "Call",      v: "+880 1700 000 000", href: "tel:+8801700000000"              },
  { l: "WhatsApp",  v: "+880 1700 000 000", href: "https://wa.me/8801700000000"     },
  { l: "Instagram", v: "@fitgymcenter.dhk",    href: "https://instagram.com/fitgymcenter.dhk" },
  { l: "Facebook",  v: "/fitgymcenterbd",      href: "https://facebook.com/fitgymcenterbd"    },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#050505] py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <span className="label">(09) — Come In</span>
        <h2 className="mt-3 text-hero">Discipline<br />begins here.</h2>

        <div className="mt-16 grid gap-12 md:grid-cols-12">

          {/* Channels */}
          <div className="md:col-span-7">
            <div className="grid gap-6 md:grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.l}
                  href={c.href}
                  className="group flex items-center justify-between border-b border-[#1a1a1a] py-6 transition-colors hover:border-[#BFE01D]"
                >
                  <div>
                    <div className="label">{c.l}</div>
                    <div className="mt-2 font-display text-2xl md:text-3xl transition-colors group-hover:text-[#BFE01D]">
                      {c.v}
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" className="text-[#bdbdbd] transition-transform group-hover:translate-x-1 group-hover:text-[#BFE01D]">
                    <path d="M4 14L14 4M14 4H6M14 4V12" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic href="https://wa.me/8801700000000" variant="primary">Book Free Trial</Magnetic>
              <Magnetic href="https://maps.google.com/?q=Gulshan+2+Dhaka" variant="ghost">Get Directions</Magnetic>
            </div>
          </div>

          {/* Address card */}
          <div className="md:col-span-5">
            <div className="border border-[#1a1a1a] p-8 bg-[#0b0b0b]">
              <div className="label">Address</div>
              <div className="mt-3 font-display text-2xl leading-tight">
                House 42, Road 11<br />
                Gulshan 2, Dhaka 1212<br />
                Bangladesh
              </div>
              <div className="mt-8 label">Hours</div>
              <div className="mt-3 space-y-2 text-[#bdbdbd]">
                <div className="flex justify-between border-b border-[#1a1a1a] pb-2">
                  <span>Sat – Thu</span><span>06:00 — 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span><span>15:00 — 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
