const words = [
  "DISCIPLINE", "·",
  "STRENGTH",   "·",
  "COMMUNITY",  "·",
  "PERFORMANCE","·",
  "CONFIDENCE", "·",
  "TRANSFORMATION", "·",
];

export default function Marquee() {
  const repeated = [...words, ...words, ...words];
  return (
    <div className="border-y border-[#1a1a1a] py-4 overflow-hidden bg-[#0a0a0a]">
      <div className="marquee-track">
        {repeated.map((w, i) => (
          <span
            key={i}
            className={`whitespace-nowrap mx-5 ${
              w === "·"
                ? "text-[#c8a96e] text-xs"
                : "text-[9px] tracking-[0.45em] text-[#333] font-medium"
            }`}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
