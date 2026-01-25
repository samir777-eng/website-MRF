"use client";

/**
 * GamificationContext - Server-Validated Version
 * 
 * This file re-exports the server-validated gamification context for backward
 * compatibility. All components importing from this file will automatically
 * use the secure, server-validated implementation.
 * 
 * The old localStorage-based implementation has been moved to 
 * GamificationContextLocal.tsx for reference/rollback if needed.
 */

// Re-export everything from the server-validated context
export {
  GamificationProviderServer as GamificationProvider,
  useGamificationServer as useGamification,
} from "./GamificationContextServer";
