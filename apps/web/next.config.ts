import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // The portal lives at apps/web but consumes the library from the repo
    // root, so Turbopack must resolve modules from the repository root.
    root: path.resolve(import.meta.dirname, "..", "..")
  }
};

export default nextConfig;
