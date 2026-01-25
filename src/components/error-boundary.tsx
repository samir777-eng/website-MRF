"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs error information and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console and external service
    logger.error("Error Boundary caught an error", error, {
      context: "ErrorBoundary",
      data: {
        componentStack: errorInfo.componentStack,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to error reporting service (e.g., Sentry)
    // errorReportingService.logError(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = "/ar";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">حدث خطأ غير متوقع</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                عذراً، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono text-destructive mb-2">
                    {this.state.error.message}
                  </p>
                  <details className="text-sm font-mono text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      عرض التفاصيل التقنية
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </details>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="ml-2 h-4 w-4" />
                  إعادة المحاولة
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="ml-2 h-4 w-4" />
                  العودة للرئيسية
                </Button>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
): React.ComponentType<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;

