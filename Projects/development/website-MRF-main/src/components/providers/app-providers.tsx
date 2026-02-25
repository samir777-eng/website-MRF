"use client";

import { ScreenReaderAnnouncerProvider } from "@/components/accessibility/screen-reader-announcer";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CelebrationProvider } from "@/components/celebrations";
import { FlyToCartProvider } from "@/components/ui/fly-to-cart-animation";
import { AuthProvider } from "@/contexts/AuthContext";
import { AvatarProvider } from "@/contexts/AvatarContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SpacedRepetitionProvider } from "@/contexts/SpacedRepetitionContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { SoundProvider } from "@/hooks/useSoundEffects";
import React, { useMemo } from "react";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { ThemeProvider } from "./theme-provider";

/**
 * Consolidated App Providers - Optimized for Performance
 *
 * This component consolidates all context providers into a single component
 * to reduce deep nesting (was 8 levels, now 1 level from consumer perspective).
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. GamificationProvider is now split into 3 sub-contexts (Stats, Streak, Achievements)
 *    - Components only re-render when their specific data changes
 *    - Selector hooks available for fine-grained subscriptions
 * 2. SearchProvider uses memoized context values
 *    - Selector hooks for query, modal, filters, history
 * 3. Children are memoized to prevent unnecessary re-renders
 *
 * MIGRATION GUIDE FOR CONSUMERS:
 * Instead of using the full useGamification() hook, use specific selectors:
 *   - useGamificationXP() - for XP displays only
 *   - useGamificationGems() - for gem displays only
 *   - useCurrentStreak() - for streak displays only
 *   - useSearchModal() - for search modal controls
 *   - useSearchResults() - for search results display
 *
 * Provider Order (dependencies):
 * 1. ThemeProvider - No deps, handles theme
 * 2. AuthProvider - No deps, handles authentication
 * 3. GamificationProvider - Depends on Auth (now split into 3 sub-contexts)
 * 4. SpacedRepetitionProvider - Depends on Auth
 * 5. StoreProvider - Depends on Auth (for cart/purchases)
 * 6. SearchProvider - No deps, handles search state (optimized with memoization)
 * 7. ErrorBoundaryProvider - Top-level error catching
 * 8. AnalyticsProvider - Depends on Auth (for user tracking)
 */

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Compose providers in a flat structure using a reducer pattern
 * This avoids the "pyramid of doom" nesting
 */
function composeProviders(
  providers: Array<React.ComponentType<{ children: React.ReactNode }>>,
  children: React.ReactNode,
): React.ReactNode {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  // Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(() => children, [children]);

  // Import ScreenReaderAnnouncerProvider dynamically to avoid SSR issues
  // Note: ScreenReaderAnnouncerProvider removed due to ESLint strict mode

  // Define providers in dependency order (innermost to outermost)
  // AnalyticsProvider wraps content last (innermost in the chain)
  const providers = [
    // Outermost providers (no dependencies)
    (props: { children: React.ReactNode }) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="mrf-theme"
      >
        {props.children}
      </ThemeProvider>
    ),
    AuthProvider,
    GamificationProvider,
    SpacedRepetitionProvider,
    StoreProvider,
    FlyToCartProvider, // Add fly-to-cart animation after StoreProvider
    SearchProvider,
    AvatarProvider, // Phase 3: Avatar customization system
    (props: { children: React.ReactNode }) => (
      <SoundProvider enabled={false}>{props.children}</SoundProvider>
    ), // Phase 1: Sound effects system (temporarily disabled)
    CelebrationProvider, // Phase 1: Enhanced celebrations with confetti, XP animations
    ErrorBoundaryProvider,
    AnalyticsProvider,
    ScreenReaderAnnouncerProvider, // Accessibility announcements
  ];

  return <>{composeProviders(providers, memoizedChildren)}</>;
}

export default AppProviders;
