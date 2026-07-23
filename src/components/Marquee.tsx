const items = [
  "DISCIPLINE","STRENGTH","COMMUNITY",
  "PERFORMANCE","CONFIDENCE","TRANSFORMATION",
];

export default function Marquee() {
  return (
    <div className="relative border-y border-[#1a1a1a] bg-[#050505] py-6 overflow-hidden">
      <div className="flex marquee-track whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center px-8">
                <span className="font-display text-4xl md:text-6xl tracking-tight">{t}</span>
                <span className="mx-8 h-2 w-2 rounded-full bg-[#BFE01D]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

