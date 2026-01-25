// Performance optimization utilities for MRF Educational Platform

// Image optimization
export const imageOptimization = {
  // Lazy loading configuration
  lazyLoadConfig: {
    rootMargin: "50px",
    threshold: 0.1,
  },

  // Image format preferences
  formats: ["avif", "webp", "jpg"] as const,

  // Responsive image sizes
  sizes: {
    mobile: "(max-width: 768px) 100vw",
    tablet: "(max-width: 1024px) 50vw",
    desktop: "33vw",
  },

  // Quality settings
  quality: {
    thumbnail: 60,
    medium: 75,
    high: 85,
  },
};

// Font optimization
export const fontOptimization = {
  // Preload critical fonts
  preloadFonts: [
    {
      href: "/fonts/NotoSansArabic-Regular.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      href: "/fonts/Cairo-Regular.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
  ],

  // Font display strategy
  fontDisplay: "swap" as const,

  // Font loading optimization
  loadingStrategy: {
    critical: "preload",
    important: "prefetch",
    optional: "lazy",
  },
};

// Code splitting configuration
export const codeSplitting = {
  // Route-based splitting
  routes: {
    home: () => import("@/app/ar/page"),
    lessons: () => import("@/app/ar/lessons/page"),
    challenges: () => import("@/app/ar/challenges/page"),
    dashboard: () => import("@/app/ar/dashboard/page"),
  },

  // Component-based splitting
  components: {
    videoPlayer: () => import("@/components/video/video-player"),
    quizEngine: () => import("@/components/quiz/quiz-engine"),
    rewardsModal: () => import("@/components/gamification/rewards-modal"),
  },

  // Library splitting
  libraries: {
    charts: () => import("recharts"),
    animations: () => import("framer-motion"),
    confetti: () => import("canvas-confetti"),
  },
};

// Caching strategies
export const cachingStrategies = {
  // Static assets
  static: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: true,
  },

  // API responses
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: true,
  },

  // User data
  userData: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: false,
  },

  // Images
  images: {
    maxAge: 86400, // 1 day
    staleWhileRevalidate: true,
  },
};

// Bundle optimization
export const bundleOptimization = {
  // Tree shaking configuration
  treeShaking: {
    sideEffects: false,
    usedExports: true,
  },

  // Minification settings
  minification: {
    removeComments: true,
    removeConsoleStatements: true,
    mangleProperties: true,
  },

  // Compression
  compression: {
    gzip: true,
    brotli: true,
    level: 9,
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100, // First Input Delay (ms)
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 600, // Time to First Byte (ms)
  },

  // Performance budget
  budget: {
    javascript: 250, // KB
    css: 100, // KB
    images: 500, // KB
    fonts: 150, // KB
    total: 1000, // KB
  },

  // Monitoring configuration
  monitoring: {
    sampleRate: 0.1, // 10% of users
    reportingEndpoint: "/api/performance",
    enableRUM: true, // Real User Monitoring
  },
};

// Lazy loading utilities
export class LazyLoader {
  private observer: IntersectionObserver | null = null;

  constructor(options = imageOptimization.lazyLoadConfig) {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        options
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        this.loadElement(target);
        this.observer?.unobserve(target);
      }
    });
  }

  private loadElement(element: HTMLElement) {
    if (element.tagName === "IMG") {
      const img = element as HTMLImageElement;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute("data-src");
      }
    } else if (element.tagName === "VIDEO") {
      const video = element as HTMLVideoElement;
      const src = video.dataset.src;
      if (src) {
        video.src = src;
        video.removeAttribute("data-src");
      }
    }
  }

  observe(element: HTMLElement) {
    this.observer?.observe(element);
  }

  disconnect() {
    this.observer?.disconnect();
  }
}

// Performance measurement utilities
export class PerformanceTracker {
  private metrics: Map<string, number> = new Map();

  startMeasure(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      this.metrics.set(name, measure.duration);

      return measure.duration;
    }
    return 0;
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  reportMetrics() {
    if (typeof window !== "undefined") {
      const metrics = this.getAllMetrics();

      // Report to analytics
      if (window.gtag) {
        Object.entries(metrics).forEach(([name, value]) => {
          window.gtag("event", "timing_complete", {
            name,
            value: Math.round(value),
          });
        });
      }

      // Report to custom endpoint
      fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics }),
      }).catch(() => {
        // Failed to report performance metrics - could implement retry logic here
      });
    }
  }
}

// Resource hints utilities
export const resourceHints = {
  // DNS prefetch for external domains
  dnsPrefetch: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://www.google-analytics.com",
  ],

  // Preconnect for critical resources
  preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],

  // Prefetch for likely next pages
  prefetch: ["/ar/lessons", "/ar/challenges", "/ar/dashboard"],

  // Preload for critical resources
  preload: [
    ...fontOptimization.preloadFonts,
    {
      href: "/icons/icon-192x192.png",
      as: "image",
      type: "image/png",
    },
  ],
};

// Critical CSS extraction
export const criticalCSS = {
  // Above-the-fold styles
  critical: `
    /* Critical styles for initial render */
    body { font-family: 'Noto Sans Arabic', Arial, sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .header { background: #1e40af; color: white; }
    .hero { min-height: 60vh; display: flex; align-items: center; }
  `,

  // Non-critical styles to load asynchronously
  nonCritical: [
    "/styles/components.css",
    "/styles/animations.css",
    "/styles/utilities.css",
  ],
};

// Initialize performance tracking
export const initPerformanceTracking = () => {
  if (typeof window === "undefined") return;

  const tracker = new PerformanceTracker();

  // Track page load performance
  window.addEventListener("load", () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      (tracker as any).metrics.set(
        "TTFB",
        navigation.responseStart - navigation.requestStart
      );
      (tracker as any).metrics.set(
        "DOMContentLoaded",
        navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart
      );
      (tracker as any).metrics.set(
        "LoadComplete",
        navigation.loadEventEnd - navigation.loadEventStart
      );

      // Get Core Web Vitals
      if (typeof window !== "undefined") {
        import("web-vitals")
          .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
            onCLS((metric: any) =>
              (tracker as any).metrics.set("CLS", metric.value)
            );
            onINP((metric: any) =>
              (tracker as any).metrics.set("INP", metric.value)
            );
            onFCP((metric: any) =>
              (tracker as any).metrics.set("FCP", metric.value)
            );
            onLCP((metric: any) =>
              (tracker as any).metrics.set("LCP", metric.value)
            );
            onTTFB((metric: any) =>
              (tracker as any).metrics.set("TTFB", metric.value)
            );

            // Report after all metrics are collected
            setTimeout(() => tracker.reportMetrics(), 1000);
          })
          .catch(() => {
            // Fallback if web-vitals is not available
            console.warn("Web Vitals not available");
          });
      }
    }, 0);
  });

  return tracker;
};
