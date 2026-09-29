import type { NextConfig } from "next";

// Статическая сборка для показа на GitHub Pages: https://vladislav-jb.github.io/coworking/
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/coworking",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
