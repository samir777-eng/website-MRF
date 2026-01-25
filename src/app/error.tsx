"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">حدث خطأ ما</h1>
          <p className="text-muted-foreground mt-2">
            عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-right text-sm">
              <p className="font-mono text-destructive">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4 ml-2" />
            حاول مرة أخرى
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/ar")}>
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}

