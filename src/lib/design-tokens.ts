/**
 * Design Tokens for MRF Educational Platform
 *
 * This file defines the design system tokens for consistent styling.
 * All tokens use TailwindCSS v4 utility classes.
 *
 * @rules
 * - Use TailwindCSS v4 color utilities only (no custom colors)
 * - Use logical properties for RTL support (ms-, me-, ps-, pe-, start-, end-)
 * - Support both light and dark modes via system preference
 */

// =============================================================================
// PAGE ACCENT COLORS
// =============================================================================
// Each page has a primary accent color for visual consistency

export const PAGE_ACCENTS = {
  dashboard: {
    light: "purple-600",
    dark: "purple-400",
    gradient: "from-purple-500 to-purple-600",
    gradientDark: "from-purple-400 to-purple-500",
  },
  lectures: {
    light: "blue-600",
    dark: "blue-400",
    gradient: "from-blue-500 to-blue-600",
    gradientDark: "from-blue-400 to-blue-500",
  },
  quizzes: {
    light: "cyan-600",
    dark: "cyan-400",
    gradient: "from-cyan-500 to-cyan-600",
    gradientDark: "from-cyan-400 to-cyan-500",
  },
  corners: {
    light: "amber-600",
    dark: "amber-400",
    gradient: "from-amber-500 to-amber-600",
    gradientDark: "from-amber-400 to-amber-500",
  },
  shop: {
    light: "amber-600",
    dark: "amber-400",
    gradient: "from-amber-500 to-amber-600",
    gradientDark: "from-amber-400 to-amber-500",
  },
  achievements: {
    light: "yellow-600",
    dark: "yellow-400",
    gradient: "from-yellow-500 to-yellow-600",
    gradientDark: "from-yellow-400 to-yellow-500",
  },
  forum: {
    light: "green-600",
    dark: "green-400",
    gradient: "from-green-500 to-green-600",
    gradientDark: "from-green-400 to-green-500",
  },
} as const;

// =============================================================================
// CORNER SYSTEM COLORS
// =============================================================================
// Each corner has its own accent color

export const CORNER_COLORS = {
  questions: {
    icon: "❓",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/10",
    text: "text-blue-500 dark:text-blue-400",
  },
  mistakes: {
    icon: "❌",
    gradient: "from-red-500 to-red-600",
    bg: "bg-red-500/10",
    text: "text-red-500 dark:text-red-400",
  },
  evaluation: {
    icon: "📊",
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-500/10",
    text: "text-purple-500 dark:text-purple-400",
  },
  tasks: {
    icon: "⏱️",
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-500/10",
    text: "text-orange-500 dark:text-orange-400",
  },
  achievement: {
    icon: "🏆",
    gradient: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500 dark:text-yellow-400",
  },
} as const;

// =============================================================================
// SPACING SCALE (Consistent across all pages)
// =============================================================================

export const SPACING = {
  pageX: "px-4 sm:px-6 lg:px-8",
  pageY: "py-6 sm:py-8 lg:py-10",
  sectionGap: "space-y-6 sm:space-y-8",
  cardGap: "gap-4 sm:gap-6",
  contentGap: "space-y-4",
} as const;

// =============================================================================
// COMMON COMPONENT CLASSES
// =============================================================================

export const COMPONENT_CLASSES = {
  // Page header pattern (centered icon + title + subtitle)
  pageHeader: "text-center space-y-4 mb-8",
  pageIcon: "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center",
  pageTitle: "text-3xl sm:text-4xl font-bold",
  pageSubtitle: "text-gray-600 dark:text-gray-400 max-w-lg mx-auto",

  // Card styles
  card: "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
  cardHover:
    "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200",

  // Filter pills
  filterPill: "px-4 py-2 rounded-full text-sm font-medium transition-all",
  filterPillActive: "bg-purple-500 text-white",
  filterPillInactive:
    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",

  // Stats display
  statBox: "text-center p-4",
  statValue: "text-2xl sm:text-3xl font-bold",
  statLabel: "text-sm text-gray-500 dark:text-gray-400",

  // Empty state
  emptyState: "text-center py-12",
  emptyIcon: "w-16 h-16 mx-auto mb-4 text-gray-400",
  emptyTitle: "text-xl font-semibold text-gray-600 dark:text-gray-300",
  emptyDescription: "text-gray-500 dark:text-gray-400 mt-2",
} as const;

// =============================================================================
// RTL UTILITIES
// =============================================================================

/**
 * Helper to get RTL-aware margin/padding classes
 * Use these instead of ml-/mr-/pl-/pr-
 */
export const RTL = {
  // Margin start (right in RTL, left in LTR)
  ms: (size: string) => `ms-${size}`,
  // Margin end (left in RTL, right in LTR)
  me: (size: string) => `me-${size}`,
  // Padding start
  ps: (size: string) => `ps-${size}`,
  // Padding end
  pe: (size: string) => `pe-${size}`,
  // Position start
  start: (size: string) => `start-${size}`,
  // Position end
  end: (size: string) => `end-${size}`,
} as const;

export type PageAccent = keyof typeof PAGE_ACCENTS;
export type CornerType = keyof typeof CORNER_COLORS;

// =============================================================================
// CHART COLORS (Use these instead of hardcoded hex values)
// =============================================================================
// Maps to CSS custom properties for theme consistency

export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--color-xp))",
  warning: "hsl(var(--color-streak))",
  error: "hsl(var(--destructive))",
  info: "hsl(var(--color-level))",
  accent: "hsl(var(--color-achievement))",

  // Direct color values for charts that don't support CSS vars
  hex: {
    primary: "#6366f1", // Indigo-500
    success: "#06b6d4", // Cyan-500 (XP color)
    warning: "#f59e0b", // Amber-500 (Streak color)
    error: "#ef4444", // Red-500
    info: "#3b82f6", // Blue-500 (Level color)
    accent: "#eab308", // Yellow-500 (Achievement color)
  },

  // Array for multi-series charts
  series: [
    "#6366f1", // primary
    "#06b6d4", // success/xp
    "#f59e0b", // warning/streak
    "#3b82f6", // info/level
    "#8b5cf6", // violet
    "#ec4899", // pink
  ],
} as const;

// =============================================================================
// CELEBRATION/CONFETTI COLORS
// =============================================================================

export const CELEBRATION_COLORS = {
  confetti: [
    "#6366f1", // primary (indigo)
    "#8b5cf6", // accent (violet)
    "#eab308", // achievement (yellow)
    "#06b6d4", // xp (cyan)
    "#f59e0b", // streak (amber)
    "#ec4899", // bonus (pink)
  ],

  // For sparkle effects
  sparkle: ["#fbbf24", "#fcd34d", "#fef08a"], // Gold tones

  // Achievement unlock colors by rarity
  achievement: {
    common: "#94a3b8", // slate
    uncommon: "#22c55e", // green
    rare: "#3b82f6", // blue
    epic: "#8b5cf6", // violet
    legendary: "#f59e0b", // amber
  },
} as const;

// =============================================================================
// GAMIFICATION COLORS (Use for XP, streaks, gems, etc.)
// =============================================================================

export const GAMIFICATION_COLORS = {
  xp: {
    DEFAULT: "#06b6d4", // Cyan-500
    light: "#ecfeff", // Cyan-50
    dark: "#0e7490", // Cyan-700 (text-safe)
    gradient: "from-cyan-400 to-cyan-600",
  },
  streak: {
    DEFAULT: "#f59e0b", // Amber-500
    light: "#fffbeb", // Amber-50
    dark: "#b45309", // Amber-700 (text-safe)
    gradient: "from-orange-400 to-orange-600",
  },
  gems: {
    DEFAULT: "#0ea5e9", // Sky-500
    light: "#f0f9ff", // Sky-50
    dark: "#0369a1", // Sky-700 (text-safe)
    gradient: "from-sky-400 to-sky-600",
  },
  achievement: {
    DEFAULT: "#eab308", // Yellow-500
    light: "#fefce8", // Yellow-50
    dark: "#a16207", // Yellow-700 (text-safe)
    gradient: "from-yellow-400 to-yellow-600",
  },
  level: {
    DEFAULT: "#3b82f6", // Blue-500
    light: "#eff6ff", // Blue-50
    dark: "#1d4ed8", // Blue-700 (text-safe)
    gradient: "from-blue-400 to-blue-600",
  },
} as const;

// =============================================================================
// RARITY COLORS (For achievements and rewards)
// =============================================================================

export const RARITY_COLORS = {
  common: {
    DEFAULT: "#94a3b8",
    bg: "#f1f5f9",
    text: "#334155",
    border: "#cbd5e1",
  },
  uncommon: {
    DEFAULT: "#22c55e",
    bg: "#dcfce7",
    text: "#166534",
    border: "#86efac",
  },
  rare: {
    DEFAULT: "#3b82f6",
    bg: "#dbeafe",
    text: "#1e40af",
    border: "#93c5fd",
  },
  epic: {
    DEFAULT: "#8b5cf6",
    bg: "#ede9fe",
    text: "#5b21b6",
    border: "#c4b5fd",
  },
  legendary: {
    DEFAULT: "#f59e0b",
    bg: "#fef3c7",
    text: "#92400e",
    border: "#fcd34d",
    glow: "0 0 20px rgba(245, 158, 11, 0.5)",
  },
} as const;

export type RarityType = keyof typeof RARITY_COLORS;
