import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  // Required: RainbowKit accesses localStorage during SSR, which breaks
  // static prerender in Next.js 15. `output: "standalone"` disables static
  // generation project-wide so the build succeeds. Pages also carry
  // `export const dynamic = "force-dynamic"` as belt-and-suspenders.
  output: "standalone",
};

export default nextConfig;
