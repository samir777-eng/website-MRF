import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
}

interface PerformanceAlert {
  metric: string;
  threshold: number;
  value: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
}

interface RUMData {
  sessionId: string;
  userId?: string;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  errorRate: number;
  performanceScore: number;
}

interface PerformancePayload {
  sessionId: string;
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  rumData: RUMData;
  isFinal: boolean;
  timestamp: number;
}

// In-memory storage for demo (use database in production)
const performanceData: Map<string, PerformancePayload[]> = new Map();
const alertsData: PerformanceAlert[] = [];

export async function POST(request: NextRequest) {
  try {
    const payload: PerformancePayload = await request.json();

    // Validate payload
    if (!payload.sessionId || !Array.isArray(payload.metrics)) {
      return NextResponse.json(
        { error: "Invalid payload structure" },
        { status: 400 },
      );
    }

    // Store metrics
    const sessionData = performanceData.get(payload.sessionId) || [];
    sessionData.push(payload);
    performanceData.set(payload.sessionId, sessionData);

    // Store alerts
    if (payload.alerts && payload.alerts.length > 0) {
      alertsData.push(...payload.alerts);

      // Keep only last 1000 alerts
      if (alertsData.length > 1000) {
        alertsData.splice(0, alertsData.length - 1000);
      }
    }

    // Log critical alerts
    const criticalAlerts =
      payload.alerts?.filter((a) => a.severity === "critical") || [];
    if (criticalAlerts.length > 0) {
      console.warn("🚨 Critical Performance Alerts:", criticalAlerts);
    }

    // Calculate aggregated metrics for monitoring
    const aggregatedMetrics = calculateAggregatedMetrics(payload.metrics);

    // Log performance summary
    if (payload.isFinal) {
      logger.info("Performance Session Summary", {
        context: "PerformanceMetrics",
        data: {
          sessionId: payload.sessionId,
          duration: payload.rumData.avgSessionDuration,
          performanceScore: payload.rumData.performanceScore,
          errorRate: payload.rumData.errorRate,
          metricsCount: payload.metrics.length,
          alertsCount: payload.alerts.length,
          aggregatedMetrics,
        },
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: payload.sessionId,
      metricsReceived: payload.metrics.length,
      alertsReceived: payload.alerts.length,
      aggregatedMetrics,
    });
  } catch (error) {
    console.error("Error processing performance metrics:", error);
    return NextResponse.json(
      { error: "Failed to process metrics" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const metric = searchParams.get("metric");

    if (sessionId) {
      // Get specific session data
      const sessionData = performanceData.get(sessionId) || [];
      return NextResponse.json({
        sessionId,
        data: sessionData.slice(-limit),
      });
    }

    // Get aggregated data across all sessions
    const allMetrics: PerformanceMetric[] = [];
    const allSessions: string[] = [];

    for (const [sessionId, payloads] of performanceData.entries()) {
      allSessions.push(sessionId);
      for (const payload of payloads) {
        allMetrics.push(...payload.metrics);
      }
    }

    // Filter by metric if specified
    const filteredMetrics = metric
      ? allMetrics.filter((m) => m.name === metric)
      : allMetrics;

    // Calculate statistics
    const stats = calculateMetricStatistics(filteredMetrics);

    return NextResponse.json({
      totalSessions: allSessions.length,
      totalMetrics: filteredMetrics.length,
      recentAlerts: alertsData.slice(-20),
      statistics: stats,
      recentMetrics: filteredMetrics.slice(-limit),
    });
  } catch (error) {
    console.error("Error retrieving performance metrics:", error);
    return NextResponse.json(
      { error: "Failed to retrieve metrics" },
      { status: 500 },
    );
  }
}

function calculateAggregatedMetrics(metrics: PerformanceMetric[]) {
  const metricGroups: Record<string, number[]> = {};

  for (const metric of metrics) {
    if (!metricGroups[metric.name]) {
      metricGroups[metric.name] = [];
    }
    metricGroups[metric.name].push(metric.value);
  }

  const aggregated: Record<string, any> = {};

  for (const [name, values] of Object.entries(metricGroups)) {
    if (values.length > 0) {
      aggregated[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p50: percentile(values, 0.5),
        p95: percentile(values, 0.95),
        p99: percentile(values, 0.99),
      };
    }
  }

  return aggregated;
}

function calculateMetricStatistics(metrics: PerformanceMetric[]) {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const recentMetrics = metrics.filter((m) => m.timestamp > oneHourAgo);
  const dailyMetrics = metrics.filter((m) => m.timestamp > oneDayAgo);

  return {
    total: metrics.length,
    lastHour: recentMetrics.length,
    lastDay: dailyMetrics.length,
    uniqueUrls: new Set(metrics.map((m) => m.url)).size,
    uniqueUserAgents: new Set(metrics.map((m) => m.userAgent)).size,
    metricTypes: Object.keys(
      metrics.reduce((acc, m) => ({ ...acc, [m.name]: true }), {}),
    ),
  };
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, index)];
}
