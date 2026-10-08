import type { NextConfig } from "next";
// Static export: GitHub Pages serves it under /projects/eidolon/demo, nginx/Docker serves it at /.
const config: NextConfig = {
  output: "export", basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "", trailingSlash: true, images: { unoptimized: true },
  transpilePackages: ["@eidolon/domain", "@eidolon/schemas"], typescript: { ignoreBuildErrors: true }, productionBrowserSourceMaps: false,
};
export default config;
