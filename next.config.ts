import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hbuhygygmbvpfixkbhso.supabase.co'
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
