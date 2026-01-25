import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium Indigo Brand Palette - Deep, Trustworthy, Sophisticated
        primary: {
          50: "#f4f7ff",
          100: "#e2e8ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b", // Very deep indigo for backgrounds
        },
        // Brand Indigo - Explicit scale
        brand: {
          indigo: {
            50: "#f4f7ff",
            100: "#e2e8ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b",
          },
          coral: {
            50: "#fff4f1",
            100: "#ffe6de",
            200: "#fecdbe",
            300: "#fdaf95",
            400: "#fb9278",
            500: "#f97354",
            600: "#ef4444",
            700: "#dc3535",
            800: "#b93030",
            900: "#992d2d",
            950: "#521a1a",
          },
        },
        // Accent - Warm Coral (Energy)
        accent: {
          50: "#fff4f1",
          100: "#ffe6de",
          200: "#fecdbe",
          300: "#fdaf95",
          400: "#fb9278",
          500: "#f97354",
          600: "#ef4444",
          700: "#dc3535",
          800: "#b93030",
          900: "#992d2d",
          950: "#521a1a",
        },
        // Semantic - Muted & Sophisticated
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Premium Dark Mode Grays (Slate-based for coolness)
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617", // Almost black, very premium
        },
        // Gamification Colors
        xp: {
          DEFAULT: "#06b6d4", // Electric Cyan
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        streak: "#f59e0b", // Amber
        gems: "#0ea5e9", // Sky
        reward: "#6366f1", // Indigo
        achievement: "#eab308", // Yellow
        level: "#3b82f6", // Blue

        // Achievement Rarity Colors
        rarity: {
          common: {
            DEFAULT: "#94a3b8",      // slate-400
            bg: "#f1f5f9",           // slate-100
            text: "#334155",         // slate-700
            border: "#cbd5e1",       // slate-300
          },
          uncommon: {
            DEFAULT: "#22c55e",      // green-500
            bg: "#dcfce7",           // green-100
            text: "#166534",         // green-800
            border: "#86efac",       // green-300
          },
          rare: {
            DEFAULT: "#3b82f6",      // blue-500
            bg: "#dbeafe",           // blue-100
            text: "#1e40af",         // blue-800
            border: "#93c5fd",       // blue-300
          },
          epic: {
            DEFAULT: "#8b5cf6",      // violet-500
            bg: "#ede9fe",           // violet-100
            text: "#5b21b6",         // violet-800
            border: "#c4b5fd",       // violet-300
          },
          legendary: {
            DEFAULT: "#f59e0b",      // amber-500
            bg: "#fef3c7",           // amber-100
            text: "#92400e",         // amber-800
            border: "#fcd34d",       // amber-300
          },
        },

        // Semantic vars
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Premium Brand Gradients
        "gradient-primary": "linear-gradient(135deg, #4338ca 0%, #312e81 100%)", // Deep Indigo
        "gradient-premium": "linear-gradient(135deg, #6366f1 0%, #ef4444 100%)", // Indigo to Coral
        "gradient-accent": "linear-gradient(135deg, #f97354 0%, #dc3535 100%)", // Warm Coral
        "gradient-success": "radial-gradient(circle at top right, #10b981 0%, #06b6d4 100%)", // Emerald to Cyan
        "gradient-xp": "linear-gradient(135deg, #22d3ee 0%, #10b981 100%)", // Cyan to Emerald
        "gradient-dark": "linear-gradient(to bottom, #0f172a, #020617)", // Night Sky
        "gradient-glass":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "gradient-glass-dark":
          "linear-gradient(135deg, rgba(30, 27, 75, 0.6), rgba(30, 27, 75, 0.4))",
        "gradient-glow":
          "radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
        "gradient-subtle":
          "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-arabic)", "system-ui", "sans-serif"],
        arabic: ["var(--font-noto-sans-arabic)", "system-ui", "sans-serif"],
        display: ["var(--font-cairo)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": [
          "0.625rem",
          { lineHeight: "0.875rem", letterSpacing: "0.01em" },
        ],
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.02em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.16", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "7xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        // Multi-layered soft shadows for depth
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        // Custom Premium Shadows
        "soft-sm":
          "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
        soft: "0 8px 30px rgba(0,0,0,0.12)",
        "soft-lg":
          "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)",
        "soft-xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(124, 58, 237, 0.3)",
        "glow-lg": "0 0 40px rgba(124, 58, 237, 0.4)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        "inner-light": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)",
      },
      animation: {
        // Refined animations with proper easing
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in-bounce":
          "scaleInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        // Interactive
        "bounce-subtle": "bounceSubtle 0.6s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        // Gamification
        "xp-gain": "xpGain 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        confetti: "confettiFall 3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleInBounce: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1", filter: "brightness(1) blur(0px)" },
          "50%": { opacity: "0.8", filter: "brightness(1.2) blur(2px)" },
        },
        xpGain: {
          "0%": { transform: "scale(0.5) translateY(20px)", opacity: "0" },
          "50%": { transform: "scale(1.2) translateY(-10px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(100vh) rotate(360deg)",
            opacity: "0",
          },
        },
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
    // RTL support plugin
    function ({
      addUtilities,
      addComponents,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
      addComponents: (
        components: Record<string, Record<string, string>>,
      ) => void;
    }) {
      const newUtilities = {
        ".rtl": {
          direction: "rtl",
        },
        ".ltr": {
          direction: "ltr",
        },
        ".start-0": {
          "inset-inline-start": "0px",
        },
        ".end-0": {
          "inset-inline-end": "0px",
        },
        ".ms-auto": {
          "margin-inline-start": "auto",
        },
        ".me-auto": {
          "margin-inline-end": "auto",
        },
        ".ps-4": {
          "padding-inline-start": "1rem",
        },
        ".pe-4": {
          "padding-inline-end": "1rem",
        },
        ".border-s": {
          "border-inline-start-width": "1px",
        },
        ".border-e": {
          "border-inline-end-width": "1px",
        },
        // Text gradient utility
        ".text-gradient-primary": {
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".text-gradient-accent": {
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
      };
      addUtilities(newUtilities);

      // Typography component classes
      const typographyComponents = {
        ".heading-1": {
          "font-family": "var(--font-cairo), system-ui, sans-serif",
          "font-size": "2.25rem",
          "font-weight": "700",
          "line-height": "1.2",
          "letter-spacing": "-0.02em",
        },
        ".heading-2": {
          "font-family": "var(--font-cairo), system-ui, sans-serif",
          "font-size": "1.875rem",
          "font-weight": "700",
          "line-height": "1.25",
          "letter-spacing": "-0.01em",
        },
        ".heading-3": {
          "font-family": "var(--font-cairo), system-ui, sans-serif",
          "font-size": "1.5rem",
          "font-weight": "600",
          "line-height": "1.3",
        },
        ".heading-4": {
          "font-family": "var(--font-cairo), system-ui, sans-serif",
          "font-size": "1.25rem",
          "font-weight": "600",
          "line-height": "1.4",
        },
        ".body-large": {
          "font-size": "1.125rem",
          "line-height": "1.75",
        },
        ".body": {
          "font-size": "1rem",
          "line-height": "1.625",
        },
        ".body-small": {
          "font-size": "0.875rem",
          "line-height": "1.5",
        },
        ".caption": {
          "font-size": "0.75rem",
          "line-height": "1.4",
          "letter-spacing": "0.01em",
        },
        ".label": {
          "font-size": "0.875rem",
          "font-weight": "500",
          "line-height": "1.4",
        },
      };
      addComponents(typographyComponents);
    },
  ],
};

export default config;
