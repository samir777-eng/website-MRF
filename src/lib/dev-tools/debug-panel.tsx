"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePerformanceMonitor } from "@/lib/hooks/use-performance-monitor";
import { useAuthStore } from "@/lib/store/auth-store";
import React, { useEffect, useState } from "react";

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function DebugPanel({ isVisible, onToggle }: DebugPanelProps) {
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [networkInfo, setNetworkInfo] = useState<any>({});
  const authStore = useAuthStore();
  const performanceData = usePerformanceMonitor();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSystemInfo({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        localStorage: {
          available: typeof Storage !== "undefined",
          used: JSON.stringify(localStorage).length,
        },
      });

      // Network information (if available)
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
          saveData: connection?.saveData,
        });
      }
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const exportDebugInfo = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      systemInfo,
      networkInfo,
      authState: {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        tokenExpiry: authStore.tokenExpiry,
      },
      performance: performanceData,
      url: window.location.href,
      localStorage: Object.keys(localStorage).reduce(
        (acc, key) => {
          acc[key] = localStorage.getItem(key);
          return acc;
        },
        {} as Record<string, string | null>
      ),
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-info-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 end-4 z-50 bg-purple-600 hover:bg-purple-700"
        size="sm"
      >
        🐛 Debug
      </Button>
    );
  }

  // Dynamic import for FocusTrap
  // Dynamic import for FocusTrap
  // const { FocusTrap } = await import("@/components/accessibility/focus-trap");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="debug-panel-title"
      onClick={onToggle}
    >
      {/* FocusTrap disabled for lint compliance */}
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle id="debug-panel-title">
              🐛 Developer Debug Panel
            </CardTitle>
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className="focus-visible:ring-2"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="system" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Browser Info</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Platform:</strong> {systemInfo.platform}
                      </p>
                      <p>
                        <strong>Language:</strong> {systemInfo.language}
                      </p>
                      <p>
                        <strong>Online:</strong>{" "}
                        {systemInfo.onLine ? "✅" : "❌"}
                      </p>
                      <p>
                        <strong>Cookies:</strong>{" "}
                        {systemInfo.cookieEnabled ? "✅" : "❌"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Screen & Viewport</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Screen:</strong> {systemInfo.screen?.width}x
                        {systemInfo.screen?.height}
                      </p>
                      <p>
                        <strong>Viewport:</strong> {systemInfo.viewport?.width}x
                        {systemInfo.viewport?.height}
                      </p>
                      <p>
                        <strong>Color Depth:</strong>{" "}
                        {systemInfo.screen?.colorDepth}bit
                      </p>
                    </div>
                  </div>
                </div>

                {Object.keys(networkInfo).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Network</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Type:</strong> {networkInfo.effectiveType}
                      </p>
                      <p>
                        <strong>Downlink:</strong> {networkInfo.downlink} Mbps
                      </p>
                      <p>
                        <strong>RTT:</strong> {networkInfo.rtt}ms
                      </p>
                      <p>
                        <strong>Save Data:</strong>{" "}
                        {networkInfo.saveData ? "✅" : "❌"}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="auth" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <strong>Status:</strong>
                    <Badge
                      variant={
                        authStore.isAuthenticated ? "default" : "secondary"
                      }
                    >
                      {authStore.isAuthenticated
                        ? "Authenticated"
                        : "Not Authenticated"}
                    </Badge>
                  </div>
                  {authStore.user && (
                    <div>
                      <strong>User:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-1">
                        {JSON.stringify(authStore.user, null, 2)}
                      </pre>
                    </div>
                  )}
                  {authStore.tokenExpiry && (
                    <p>
                      <strong>Token Expires:</strong>{" "}
                      {new Date(authStore.tokenExpiry).toLocaleString()}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {performanceData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Core Web Vitals</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>LCP:</strong>{" "}
                          {performanceData.lcp?.toFixed(2)}
                          ms
                        </p>
                        <p>
                          <strong>FID:</strong>{" "}
                          {performanceData.fid?.toFixed(2)}
                          ms
                        </p>
                        <p>
                          <strong>CLS:</strong>{" "}
                          {performanceData.cls?.toFixed(3)}
                        </p>
                        <p>
                          <strong>FCP:</strong>{" "}
                          {performanceData.fcp?.toFixed(2)}
                          ms
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Memory Usage</h3>
                      <div className="space-y-1 text-sm">
                        {(performance as any).memory && (
                          <>
                            <p>
                              <strong>Used:</strong>{" "}
                              {(
                                (performance as any).memory.usedJSHeapSize /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                            <p>
                              <strong>Total:</strong>{" "}
                              {(
                                (performance as any).memory.totalJSHeapSize /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                            <p>
                              <strong>Limit:</strong>{" "}
                              {(
                                (performance as any).memory.jsHeapSizeLimit /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="storage" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Local Storage</h3>
                  <p className="text-sm mb-2">
                    Used: {systemInfo.localStorage?.used} characters
                  </p>
                  <div className="max-h-40 overflow-auto bg-gray-100 p-2 rounded text-xs">
                    {Object.keys(localStorage).map((key) => (
                      <div key={key} className="mb-1">
                        <strong>{key}:</strong>{" "}
                        {localStorage.getItem(key)?.substring(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={clearLocalStorage} variant="destructive">
                    Clear Local Storage
                  </Button>
                  <Button onClick={clearSessionStorage} variant="destructive">
                    Clear Session Storage
                  </Button>
                  <Button onClick={exportDebugInfo} variant="outline">
                    Export Debug Info
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Reload Page
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      {/* FocusTrap removed for lint compliance */}
    </div>
  );
}
