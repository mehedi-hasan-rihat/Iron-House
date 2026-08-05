import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Photography lives on the shared asset host. Only that origin goes through
       the optimizer — a looser pattern would let the endpoint be used to resize
       arbitrary remote images. */
    remotePatterns: [new URL("https://iron-house.lovable.app/assets/**")],
    /* AVIF first, WebP for browsers without it. The hero is a grainy grayscale
       photo, which is exactly where AVIF wins biggest. */
    formats: ["image/avif", "image/webp"],
    /* Required from Next 16 — an allowlist, not a default. */
    qualities: [70, 75],
    /* Upstream filenames are content-hashed, so derivatives never go stale. */
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
