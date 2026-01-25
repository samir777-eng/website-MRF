"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface ErrorBoundaryProviderProps {
  children: ReactNode;
}

/**
 * Client-side Error Boundary Provider
 * Wraps the application with error boundary to catch runtime errors
 */
export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

