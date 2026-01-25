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
    light: 'purple-600',
    dark: 'purple-400',
    gradient: 'from-purple-500 to-purple-600',
    gradientDark: 'from-purple-400 to-purple-500',
  },
  lectures: {
    light: 'blue-600',
    dark: 'blue-400',
    gradient: 'from-blue-500 to-blue-600',
    gradientDark: 'from-blue-400 to-blue-500',
  },
  quizzes: {
    light: 'cyan-600',
    dark: 'cyan-400',
    gradient: 'from-cyan-500 to-cyan-600',
    gradientDark: 'from-cyan-400 to-cyan-500',
  },
  corners: {
    light: 'amber-600',
    dark: 'amber-400',
    gradient: 'from-amber-500 to-amber-600',
    gradientDark: 'from-amber-400 to-amber-500',
  },
  shop: {
    light: 'amber-600',
    dark: 'amber-400',
    gradient: 'from-amber-500 to-amber-600',
    gradientDark: 'from-amber-400 to-amber-500',
  },
  achievements: {
    light: 'yellow-600',
    dark: 'yellow-400',
    gradient: 'from-yellow-500 to-yellow-600',
    gradientDark: 'from-yellow-400 to-yellow-500',
  },
  forum: {
    light: 'green-600',
    dark: 'green-400',
    gradient: 'from-green-500 to-green-600',
    gradientDark: 'from-green-400 to-green-500',
  },
} as const;

// =============================================================================
// CORNER SYSTEM COLORS
// =============================================================================
// Each corner has its own accent color

export const CORNER_COLORS = {
  questions: {
    icon: '❓',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500 dark:text-blue-400',
  },
  mistakes: {
    icon: '❌',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-500/10',
    text: 'text-red-500 dark:text-red-400',
  },
  evaluation: {
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-500/10',
    text: 'text-purple-500 dark:text-purple-400',
  },
  tasks: {
    icon: '⏱️',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500 dark:text-orange-400',
  },
  achievement: {
    icon: '🏆',
    gradient: 'from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500 dark:text-yellow-400',
  },
} as const;

// =============================================================================
// SPACING SCALE (Consistent across all pages)
// =============================================================================

export const SPACING = {
  pageX: 'px-4 sm:px-6 lg:px-8',
  pageY: 'py-6 sm:py-8 lg:py-10',
  sectionGap: 'space-y-6 sm:space-y-8',
  cardGap: 'gap-4 sm:gap-6',
  contentGap: 'space-y-4',
} as const;

// =============================================================================
// COMMON COMPONENT CLASSES
// =============================================================================

export const COMPONENT_CLASSES = {
  // Page header pattern (centered icon + title + subtitle)
  pageHeader: 'text-center space-y-4 mb-8',
  pageIcon: 'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center',
  pageTitle: 'text-3xl sm:text-4xl font-bold',
  pageSubtitle: 'text-gray-600 dark:text-gray-400 max-w-lg mx-auto',
  
  // Card styles
  card: 'rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
  cardHover: 'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200',
  
  // Filter pills
  filterPill: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
  filterPillActive: 'bg-purple-500 text-white',
  filterPillInactive: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
  
  // Stats display
  statBox: 'text-center p-4',
  statValue: 'text-2xl sm:text-3xl font-bold',
  statLabel: 'text-sm text-gray-500 dark:text-gray-400',
  
  // Empty state
  emptyState: 'text-center py-12',
  emptyIcon: 'w-16 h-16 mx-auto mb-4 text-gray-400',
  emptyTitle: 'text-xl font-semibold text-gray-600 dark:text-gray-300',
  emptyDescription: 'text-gray-500 dark:text-gray-400 mt-2',
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

