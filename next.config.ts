import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Allow mobile access to Next.js dev resources in development
  allowedDevOrigins: ["192.168.1.5", "192.168.1.5:3000"],
};

export default nextConfig;

