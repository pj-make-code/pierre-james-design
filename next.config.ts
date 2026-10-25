import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // The dev-only Next.js badge defaults to bottom-left, where our Menu pill lives.
  devIndicators: { position: "bottom-right" },
};

// Compiles content/**/*.mdx into regular JS at build time. Plugins are named as
// strings because Turbopack can't receive JS functions from this config.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
});

export default withMDX(nextConfig);

// Lets `next dev` see Cloudflare bindings (env vars, later the Images binding).
initOpenNextCloudflareForDev();
