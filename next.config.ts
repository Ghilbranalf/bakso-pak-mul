import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.18.20:3000",
    "192.168.18.20",
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "0.0.0.0:3000"
  ],
};

export default nextConfig;
