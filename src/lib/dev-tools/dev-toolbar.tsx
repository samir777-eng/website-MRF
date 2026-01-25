"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DebugPanel } from "./debug-panel";
import { errorLogger } from "./error-logger";
import { performanceProfiler } from "./performance-profiler";

interface DevToolbarProps {
  enabled?: boolean;
}

export function DevToolbar({
  enabled = process.env.NODE_ENV === "development",
}: DevToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [performanceStats, setPerformanceStats] = useState<any>({});

  useEffect(() => {
    if (!enabled) return;

    // Update error count periodically
    const updateStats = () => {
      const stats = errorLogger.getStats();
      setErrorCount(stats.lastHour);
      setPerformanceStats(performanceProfiler.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    // Keyboard shortcut to toggle toolbar (Ctrl/Cmd + Shift + D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  if (!enabled) return null;

  const toggleToolbar = () => setIsVisible(!isVisible);

  const clearAllData = () => {
    errorLogger.clearLogs();
    performanceProfiler.clear();
    localStorage.clear();
    sessionStorage.clear();
    setErrorCount(0);
    setPerformanceStats({});
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  if (!isVisible) {
    return (
      <>
        <Button
          onClick={toggleToolbar}
          className="fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          🛠️ Dev
          {errorCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
              {errorCount}
            </Badge>
          )}
        </Button>
        <DebugPanel
          isVisible={showDebugPanel}
          onToggle={() => setShowDebugPanel(!showDebugPanel)}
        />
      </>
    );
  }

  return (
    <>
      <Card className="fixed bottom-4 left-4 z-50 w-80 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">🛠️ Developer Toolbar</h3>
            <Button
              onClick={toggleToolbar}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-2">
            {/* Quick Stats */}
            <div className="flex gap-2 text-xs">
              <Badge variant={errorCount > 0 ? "destructive" : "secondary"}>
                {errorCount} errors/hr
              </Badge>
              <Badge variant="outline">
                {performanceStats.totalEntries || 0} perf entries
              </Badge>
              <Badge variant="outline">
                {performanceStats.activeTimers || 0} active timers
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setShowDebugPanel(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🐛 Debug Panel
              </Button>
              <Button
                onClick={() => {
                  const logs = errorLogger.exportLogs();
                  const blob = new Blob([logs], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `error-logs-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                📥 Export Logs
              </Button>
              <Button
                onClick={() => {
                  const perfData = performanceProfiler.export();
                  const blob = new Blob([JSON.stringify(perfData, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `performance-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                📊 Export Perf
              </Button>
              <Button
                onClick={reloadPage}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🔄 Reload
              </Button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => openInNewTab("/api/health")}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                🏥 Health Check
              </Button>
              <Button
                onClick={() => openInNewTab("/_next/static/chunks/")}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                📦 Chunks
              </Button>
              <Button
                onClick={() => {
                  console.log("🔍 Current State:", {
                    url: window.location.href,
                    localStorage: Object.keys(localStorage),
                    sessionStorage: Object.keys(sessionStorage),
                    cookies: document.cookie,
                    userAgent: navigator.userAgent,
                  });
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                🔍 Log State
              </Button>
              <Button
                onClick={clearAllData}
                variant="ghost"
                size="sm"
                className="text-xs text-red-600"
              >
                🗑️ Clear All
              </Button>
            </div>

            {/* Environment Info */}
            <div className="text-xs text-gray-500 border-t pt-2">
              <div>Node: {process.env.NODE_ENV}</div>
              <div>
                Next: {process.env.NEXT_PUBLIC_APP_VERSION || "unknown"}
              </div>
              <div>
                Build: {process.env.NEXT_PUBLIC_BUILD_TIME || "unknown"}
              </div>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="text-xs text-gray-400 text-center">
              Press Ctrl+Shift+D to toggle
            </div>
          </div>
        </CardContent>
      </Card>

      <DebugPanel
        isVisible={showDebugPanel}
        onToggle={() => setShowDebugPanel(!showDebugPanel)}
      />
    </>
  );
}
