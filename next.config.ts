import type { NextConfig } from "next";

// `STATIC_EXPORT=1 npm run build` emits a fully static site in ./out that can be
// hosted anywhere (Netlify, Vercel, Cloudflare Pages, S3). Normal builds are unaffected.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  ...(staticExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
