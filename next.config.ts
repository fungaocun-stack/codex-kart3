import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep local development assets separate from production builds.
  // Running `npm run build` while `npm run dev` is open must not replace
  // the CSS and JavaScript files used by the active development server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
