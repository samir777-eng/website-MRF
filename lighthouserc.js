module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/en",
        "http://localhost:3000/ar",
        "http://localhost:3000/en/dashboard",
        "http://localhost:3000/en/lessons",
        "http://localhost:3000/en/quizzes",
      ],
      startServerCommand: "npm start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
        "categories:pwa": ["warn", { minScore: 0.6 }],

        // Core Web Vitals
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "first-input-delay": ["warn", { maxNumericValue: 100 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],

        // Performance metrics
        "speed-index": ["warn", { maxNumericValue: 3000 }],
        interactive: ["warn", { maxNumericValue: 3000 }],

        // Best practices
        "uses-https": "error",
        "uses-http2": "warn",
        "uses-responsive-images": "warn",
        "efficient-animated-content": "warn",
        "unused-javascript": "warn",
        "modern-image-formats": "warn",

        // Accessibility
        "color-contrast": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        "button-name": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
