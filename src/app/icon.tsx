import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

const ACC = "#BFE01D";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          32,
          height:         32,
          background:     "transparent",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        {/*
          Dumbbell drawn already rotated 45°.
          We draw it in a 24×24 coordinate space,
          rotated so the bar runs NW→SE.

          Bar centre: (12,12), length 16px along X before rotation.
          After rotate(45deg): bar runs diagonally.
        */}
        <div
          style={{
            transform:  "rotate(315deg)",
            display:    "flex",
            alignItems: "center",
          }}
        >
          <svg width="28" height="28" viewBox="-2 7 32 14" fill="none">
            {/* ── left head (2 stacked circles) ── */}
            <circle cx="0"  cy="14" r="6"   fill={ACC} />
            <circle cx="0"  cy="14" r="3.5" fill="#050505" fillOpacity="0.35" />

            {/* ── left collar ── */}
            <rect x="5"  y="11.5" width="4" height="5" rx="1" fill={ACC} fillOpacity="0.8" />

            {/* ── bar ── */}
            <rect x="9"  y="12.5" width="10" height="3" rx="1.5" fill={ACC} fillOpacity="0.95" />

            {/* ── right collar ── */}
            <rect x="19" y="11.5" width="4" height="5" rx="1" fill={ACC} fillOpacity="0.8" />

            {/* ── right head ── */}
            <circle cx="28" cy="14" r="6"   fill={ACC} />
            <circle cx="28" cy="14" r="3.5" fill="#050505" fillOpacity="0.35" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
