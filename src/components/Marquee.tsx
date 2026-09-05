const items = [
  "SHOW UP", "LIFT HEAVY", "EAT ENOUGH",
  "SLEEP MORE", "NO SHORTCUTS", "EARN IT",
];

export default function Marquee() {
  return (
    <div className="border-y border-[#1a1a1a] bg-[#050505] py-7 overflow-hidden">
      <div className="marquee-track whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center px-7">
                <span className="font-display text-4xl md:text-6xl" style={{ fontVariationSettings: '"wdth" 104, "wght" 800' }}>
                  {t}
                </span>
                <span className="mx-7 h-1.5 w-1.5 rotate-45 bg-[#BFE01D]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
