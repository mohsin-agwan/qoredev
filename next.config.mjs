import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias["@qoredev/engine"] = path.resolve(
      __dirname,
      "src/lib/engine/index.ts"
    );
    return config;
  },
};

export default nextConfig;
