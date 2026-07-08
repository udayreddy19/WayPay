import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone output for Docker container builds (e.g. Railway), not Vercel
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
};

export default nextConfig;
