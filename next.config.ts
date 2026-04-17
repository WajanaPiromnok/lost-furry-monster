import type { NextConfig } from "next";

const productionBasePath = "/mrkreme/thailandtour/lost-furry-monster";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProduction ? productionBasePath : "",
  assetPrefix: isProduction ? productionBasePath : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
