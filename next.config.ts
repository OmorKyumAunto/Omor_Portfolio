import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Images are pre-optimised at build time by scripts/build-images.mjs:
    // masked, downscaled and encoded to WebP. Cloudflare's runtime optimiser
    // needs either the paid Images product or a zone with transformations
    // enabled, and neither is required when the files already ship optimised.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1280, 1536, 1920],
    // Next 16 only honours a `quality` prop whose value is declared here;
    // anything else silently falls back to 75, which visibly softens the text
    // inside dashboard screenshots.
    qualities: [75, 88, 90, 92, 95],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// Gives `next dev` access to the Cloudflare bindings defined in wrangler.jsonc.
initOpenNextCloudflareForDev();
