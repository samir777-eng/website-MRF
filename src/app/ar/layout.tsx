import { BottomNav } from "@/components/layout/bottom-nav";
import { Navigation } from "@/components/layout/navigation";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { WebVitalsReporter } from "@/components/performance/web-vitals";
import { SearchModal } from "@/components/search/search-modal";
import {
  OrganizationSchema,
  PersonSchema,
  WebsiteSchema,
} from "@/components/seo/structured-data";
import SkipNavigation from "@/components/SkipNavigation";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerScript } from "@/lib/security/nonce-provider";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "منصة الأستاذ رضا الفاروق التعليمية - تعلم اللغة العربية للثانوية العامة",
    template: "%s | منصة الأستاذ رضا الفاروق",
  },
  description:
    "منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية مع الأستاذ رضا الفاروق. دروس تفاعلية، اختبارات ذكية، ومتابعة مستمرة لتحقيق التفوق في الثانوية العامة.",
  keywords: [
    "تعليم اللغة العربية",
    "الثانوية العامة",
    "رضا الفاروق",
    "دروس عربي",
    "نحو",
    "بلاغة",
    "أدب عربي",
    "امتحانات الثانوية",
    "تعليم أونلاين",
    "منصة تعليمية",
    "مصر",
    "تعليم إلكتروني",
  ],
  authors: [{ name: "الأستاذ رضا الفاروق" }],
  creator: "الأستاذ رضا الفاروق",
  publisher: "منصة الأستاذ رضا الفاروق التعليمية",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mrredaelfarouk.com"),
  alternates: {
    canonical: "/ar",
    languages: {
      ar: "/ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://mrredaelfarouk.com/ar",
    title: "منصة الأستاذ رضا الفاروق التعليمية",
    description:
      "منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية. دروس تفاعلية، اختبارات ذكية، ومتابعة مستمرة.",
    siteName: "منصة الأستاذ رضا الفاروق",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "منصة الأستاذ رضا الفاروق التعليمية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة الأستاذ رضا الفاروق التعليمية",
    description: "منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

type Props = {
  children: React.ReactNode;
};

export default function ArabicLayout({ children }: Props) {
  // Import AppProviders dynamically to prevent IDE from removing unused import
import { AppProviders } from "@/components/providers/app-providers";

  return (
    <AppProviders>
      {/* Structured Data for SEO */}
      <OrganizationSchema
        name="منصة الأستاذ رضا الفاروق التعليمية"
        url="https://mrredaelfarouk.com"
        logo="https://mrredaelfarouk.com/logo.png"
        description="منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية في مصر"
        founder="الأستاذ رضا الفاروق"
        foundingDate="2020-01-01"
        address={{
          streetAddress: "",
          addressLocality: "القاهرة",
          addressRegion: "القاهرة",
          postalCode: "",
          addressCountry: "EG",
        }}
        sameAs={[
          "https://facebook.com/mrredaelfarouk",
          "https://youtube.com/mrredaelfarouk",
          "https://twitter.com/mrredaelfarouk",
        ]}
      />
      <WebsiteSchema
        name="منصة الأستاذ رضا الفاروق"
        url="https://mrredaelfarouk.com"
        description="منصة تعليمية متكاملة لتعلم اللغة العربية للمرحلة الثانوية"
      />
      <PersonSchema
        name="الأستاذ رضا الفاروق"
        jobTitle="مدرس لغة عربية - خبير تعليم الثانوية العامة"
        description="مدرس لغة عربية متخصص في تعليم طلاب الثانوية العامة مع خبرة تزيد عن 15 عاماً"
        url="https://mrredaelfarouk.com/ar/about"
        sameAs={[
          "https://facebook.com/mrredaelfarouk",
          "https://youtube.com/mrredaelfarouk",
        ]}
      />

      <SkipNavigation />
      <header role="banner" className="overflow-visible">
        <Navigation />
      </header>
      <div className="relative flex min-h-screen flex-col">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 pt-16 pb-24 lg:pb-0"
          role="main"
          aria-label="المحتوى الرئيسي"
        >
          {children}
        </main>
        <BottomNav />
        <footer
          id="footer"
          role="contentinfo"
          className="border-t border-border/40 bg-muted/30 pb-20 lg:pb-0"
          aria-label="تذييل الصفحة"
        >
          <div className="container mx-auto px-4 py-6">
            {/* Compact Footer Layout */}
            <div className="flex flex-col gap-4">
              {/* Top Row - Brand + Links */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="h-7 w-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">ر.ف</span>
                  </div>
                  <span className="font-semibold text-sm">
                    الأستاذ رضا الفاروق
                  </span>
                </div>

                {/* Navigation Links - Horizontal */}
                <nav
                  className="flex flex-wrap items-center justify-center gap-1 md:gap-2"
                  aria-label="روابط سريعة"
                >
                  <a
                    href="/ar"
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    الرئيسية
                  </a>
                  <span className="text-muted-foreground/30">|</span>
                  <a
                    href="/ar/lectures"
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    المحاضرات
                  </a>
                  <span className="text-muted-foreground/30">|</span>
                  <a
                    href="/ar/dashboard"
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    لوحة التحكم
                  </a>
                  <span className="text-muted-foreground/30">|</span>
                  <a
                    href="/ar/help"
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    المساعدة
                  </a>
                  <span className="text-muted-foreground/30">|</span>
                  <a
                    href="/ar/contact"
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    اتصل بنا
                  </a>
                </nav>
              </div>

              {/* Bottom Row - Copyright + Legal */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground/60 text-center md:text-right">
                  © {new Date().getFullYear()} جميع الحقوق محفوظة - الأستاذ رضا
                  الفاروق
                </p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="/ar/privacy"
                    className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    الخصوصية
                  </a>
                  <span className="text-muted-foreground/20">•</span>
                  <a
                    href="/ar/terms"
                    className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    الشروط
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <SearchModal />
      <CookieConsent />
      <Toaster />
      <ServiceWorkerScript swPath="/sw.js" scope="/" />
      <WebVitalsReporter />
    </AppProviders>
  );
}
