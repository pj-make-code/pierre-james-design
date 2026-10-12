import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // The dev-only Next.js badge defaults to bottom-left, where our Menu pill lives.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;

// Lets `next dev` see Cloudflare bindings (env vars, later the Images binding).
initOpenNextCloudflareForDev();
