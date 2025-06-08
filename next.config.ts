import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false, // desliga aquele indicadorzinho do build no canto inferior direito
  },
  // outras configs que quiser colocar aqui...
};

export default nextConfig;
