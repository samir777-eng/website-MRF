import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/config.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Allow network access from local IP for development
  allowedDevOrigins: ["192.168.1.46:3000"],

  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["src/app", "src/components", "src/lib", "src/hooks", "src/contexts"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// Apply plugins in correct order - bundle analyzer wraps nextIntl
// This order prevents the race condition in manifest generation
export default bundleAnalyzer(withNextIntl(nextConfig));
