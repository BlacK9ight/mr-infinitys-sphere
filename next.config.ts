import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    // Posts with images are sent to the server as one form submission.
    // Vercel itself caps requests at about 4.5 MB.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
