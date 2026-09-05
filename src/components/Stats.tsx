const items = [
  { n: "3,240+", label: "Members trained"        },
  { n: "71%",    label: "Still here after a year" },
  { n: "12",     label: "Coaches on the floor"   },
  { n: "8",      label: "Years in Dhaka"         },
];

export default function Stats() {
  return (
    <section className="border-y border-[#1a1a1a] bg-[#050505] py-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-12 px-5 md:grid-cols-4 md:px-10">
        {items.map((it) => (
          <div key={it.label} className="pl-6 border-l border-[#1a1a1a]">
            <div className="font-display text-5xl leading-none text-[#BFE01D] md:text-7xl">{it.n}</div>
            <p className="mt-3 label">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
