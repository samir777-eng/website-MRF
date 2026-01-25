"use client";

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
 * Consolidated App Providers
 *
 * This component consolidates all context providers into a single component
 * to reduce deep nesting (was 8 levels, now 1 level from consumer perspective).
 *
 * Benefits:
 * - Reduced re-render propagation through provider chain
 * - Cleaner layout.tsx
 * - Easier provider management
 * - Better performance with useMemo for children
 *
 * Provider Order (dependencies):
 * 1. ThemeProvider - No deps, handles theme
 * 2. AuthProvider - No deps, handles authentication
 * 3. GamificationProvider - Depends on Auth (for user stats)
 * 4. SpacedRepetitionProvider - Depends on Auth
 * 5. StoreProvider - Depends on Auth (for cart/purchases)
 * 6. SearchProvider - No deps, handles search state
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
  children: React.ReactNode
): React.ReactNode {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  // Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(() => children, [children]);

  // Import ScreenReaderAnnouncerProvider dynamically to avoid SSR issues
  const ScreenReaderAnnouncerProvider =
    // require() not allowed in strict TypeScript mode

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
    SoundProvider, // Phase 1: Sound effects system
    CelebrationProvider, // Phase 1: Enhanced celebrations with confetti, XP animations
    ErrorBoundaryProvider,
    AnalyticsProvider,
    ScreenReaderAnnouncerProvider, // Accessibility announcements
  ];

  return <>{composeProviders(providers, memoizedChildren)}</>;
}

export default AppProviders;
