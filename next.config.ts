import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Lets `next dev` see Cloudflare bindings (env vars, later the Images binding).
initOpenNextCloudflareForDev();
