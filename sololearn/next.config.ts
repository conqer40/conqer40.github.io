import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a plain static site that can live under /sololearn on another host.
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic
    ? { output: "export", basePath: "/sololearn", trailingSlash: true, images: { unoptimized: true } }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isStatic ? "/sololearn" : "",
  },
  cacheComponents: !isStatic,
  partialPrefetching: !isStatic,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
