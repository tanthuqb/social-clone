/** @type {import('next').NextConfig} */
import { rewritesConfig } from "../supabase/src/constants/constants.mjs";
const nextConfig = {
  experimental: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    loader: "custom",
    loaderFile: "../supabase/src/lib/supabase/supabase-image-loader.ts",
  },

  async rewrites() {
    return rewritesConfig;
  },
};

export default nextConfig;
