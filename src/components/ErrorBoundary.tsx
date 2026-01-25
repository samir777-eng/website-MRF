"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                حدث خطأ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
              </p>
              {this.state.error && (
                <details className="text-sm text-muted-foreground">
                  <summary className="cursor-pointer font-medium">تفاصيل الخطأ</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-sm overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full"
              >
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

