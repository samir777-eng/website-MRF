"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Activity,
  Zap,
  Eye,
  Clock as _Clock,
  Gauge,
} from "lucide-react";
import {
  performanceMonitor,
  type PerformanceMetric,
  type PerformanceAlert,
} from "@/lib/monitoring/performance-monitor";

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({
  className = "",
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setMetrics(performanceMonitor.getMetrics());
      setAlerts(performanceMonitor.getAlerts());
      setPerformanceScore(performanceMonitor.getPerformanceScore());
    };

    // Initial load
    updateData();

    // Update every 5 seconds
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLatestMetric = (name: string): PerformanceMetric | undefined => {
    return metrics.filter((m) => m.name === name).pop();
  };

  const formatValue = (value: number, unit: string = "ms"): string => {
    if (unit === "ms") {
      return `${Math.round(value)}ms`;
    } else if (unit === "score") {
      return `${Math.round(value)}/100`;
    } else if (unit === "bytes") {
      return formatBytes(value);
    }
    return `${Math.round(value)}${unit}`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricStatus = (
    value: number,
    thresholds: { warning: number; critical: number },
  ): "good" | "warning" | "critical" => {
    if (value > thresholds.critical) return "critical";
    if (value > thresholds.warning) return "warning";
    return "good";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const coreWebVitals = [
    {
      name: "First Contentful Paint",
      key: "fcp",
      icon: Eye,
      thresholds: { warning: 2000, critical: 3000 },
      unit: "ms",
    },
    {
      name: "Largest Contentful Paint",
      key: "lcp",
      icon: Activity,
      thresholds: { warning: 2500, critical: 4000 },
      unit: "ms",
    },
    {
      name: "First Input Delay",
      key: "fid",
      icon: Zap,
      thresholds: { warning: 100, critical: 300 },
      unit: "ms",
    },
    {
      name: "Cumulative Layout Shift",
      key: "cls",
      icon: Activity,
      thresholds: { warning: 0.1, critical: 0.25 },
      unit: "",
    },
  ];

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <Gauge className="w-4 h-4 me-2" />
          Performance
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto ${className}`}
    >
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              <CardTitle className="text-lg">Performance Monitor</CardTitle>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
            >
              ×
            </Button>
          </div>
          <CardDescription>
            Real-time performance metrics and alerts
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Performance Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div
              className={`text-3xl font-bold ${getScoreColor(performanceScore)}`}
            >
              {Math.round(performanceScore)}
            </div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Core Web Vitals</h3>
            {coreWebVitals.map((vital) => {
              const metric = getLatestMetric(vital.key);
              const value = metric?.value || 0;
              const status = getMetricStatus(value, vital.thresholds);
              const Icon = vital.icon;

              return (
                <div
                  key={vital.key}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{vital.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {formatValue(value, vital.unit)}
                    </span>
                    <Badge className={`text-sm ${getStatusColor(status)}`}>
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Recent Alerts ({alerts.length})
              </h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {alerts
                  .slice(-5)
                  .reverse()
                  .map((alert, index) => (
                    <div
                      key={index}
                      className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-200"
                    >
                      <div className="font-medium">{alert.metric}</div>
                      <div className="text-gray-600">
                        {formatValue(alert.value)} (threshold:{" "}
                        {formatValue(alert.threshold)})
                      </div>
                      <div className="text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Session Info */}
          <div className="text-sm text-gray-500 pt-2 border-t">
            <div>Session: {performanceMonitor.getSessionId().slice(-8)}</div>
            <div>Metrics: {metrics.length}</div>
            <div>Updated: {new Date().toLocaleTimeString()}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => {
                setMetrics([]);
                setAlerts([]);
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                const data = {
                  metrics: metrics,
                  alerts: alerts,
                  score: performanceScore,
                  timestamp: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `performance-report-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
