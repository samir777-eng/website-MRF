/**
 * Gamification Module Index
 *
 * Re-exports all gamification functionality for convenient imports.
 */

// Client-side gamification utilities (shared between client and server)
export * from "../gamification";

// Server-side types and validation
export * from "./server-types";

// Server-side utilities (for API routes only)
// Import with namespace to avoid conflicts
export * as serverUtils from "./server-utils";

// Client-side API for communicating with server
// Import with namespace to avoid conflicts
export * as apiClient from "./api-client";
