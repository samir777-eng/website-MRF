// This file is required for the app directory to work.
// It will be overridden by the [locale]/layout.tsx file.

import type { Metadata } from "next";
import { Cairo, Noto_Sans_Arabic } from "next/font/google";
import "../styles/responsive-fixes.css";
import "./globals.css";

// Arabic-optimized fonts
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "منصة الأستاذ رضا الفاروق التعليمية - تعلم اللغة العربية للثانوية العامة",
    template: "%s | منصة الأستاذ رضا الفاروق",
  },
  description:
    "منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية مع الأستاذ رضا الفاروق",
};

// Critical CSS for above-the-fold content (LCP optimization)
const criticalCSS = `
  .hero-gradient{background:linear-gradient(to bottom right,#f8fafc,#eff6ff,#faf5ff)}
  @media(prefers-color-scheme:dark){.hero-gradient{background:linear-gradient(to bottom right,#020617,#172554,#581c87)}}
  .text-gradient{background:linear-gradient(to right,#2563eb,#9333ea,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      style={{ fontSize: "16px" }}
    >
      <head>
        {/* Preconnect to critical origins for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Critical CSS inline for LCP optimization */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body
        className={`min-h-screen bg-background antialiased ${cairo.variable} ${notoSansArabic.variable} font-arabic`}
      >
        {children}
      </body>
    </html>
  );
}
