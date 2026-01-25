"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error reporting service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Report:", errorReport);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry integration would go here
      // Example: Sentry.captureException(error, { extra: errorReport });
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">
                عذراً، حدث خطأ غير متوقع
              </CardTitle>
              <CardDescription className="text-lg">
                نعتذر عن هذا الإزعاج. فريقنا التقني تم إشعاره بالمشكلة وسيتم
                حلها قريباً.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة المحاولة
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </div>

              {this.props.showDetails &&
                process.env.NODE_ENV === "development" && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      تفاصيل الخطأ (للمطورين فقط)
                    </summary>
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm font-mono">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error?.message}
                      </div>
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-sm mt-1">
                          {this.state.error?.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap text-sm mt-1">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for error reporting in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    // Report error to monitoring service
    console.error("Manual error report:", error, errorInfo);

    // TODO: Send to error reporting service
    // errorReportingService.captureException(error, { extra: errorInfo });
  };
}
