import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for Web Vitals metrics
const webVitalsSchema = z.object({
  name: z.enum(["LCP", "FCP", "CLS", "TTFB", "INP", "FID"]),
  value: z.number(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  delta: z.number(),
  id: z.string(),
  url: z.string().url(),
  timestamp: z.number(),
  userAgent: z.string().optional(),
});

// In-memory storage for development (replace with database in production)
const metricsStore: Array<{
  metric: z.infer<typeof webVitalsSchema>;
  receivedAt: number;
}> = [];

// Keep only last 1000 metrics in memory
const MAX_METRICS = 1000;

/**
 * POST /api/analytics/web-vitals
 * Receive and store Web Vitals metrics from clients
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = webVitalsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid metric data" },
        { status: 400 },
      );
    }

    const metric = validation.data;

    // Store metric
    metricsStore.push({
      metric,
      receivedAt: Date.now(),
    });

    // Keep only recent metrics
    if (metricsStore.length > MAX_METRICS) {
      metricsStore.shift();
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      const ratingEmoji =
        metric.rating === "good"
          ? "🟢"
          : metric.rating === "needs-improvement"
            ? "🟡"
            : "🔴";
      console.log(
        `📊 ${ratingEmoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Web Vitals API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process metric" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/analytics/web-vitals
 * Get aggregated Web Vitals statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get last hour of metrics
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentMetrics = metricsStore.filter((m) => m.receivedAt > oneHourAgo);

    // Aggregate by metric name
    const aggregated: Record<
      string,
      {
        name: string;
        count: number;
        avg: number;
        p75: number;
        p95: number;
        good: number;
        needsImprovement: number;
        poor: number;
      }
    > = {};

    const metricsByName: Record<string, number[]> = {};
    const ratingsByName: Record<
      string,
      { good: number; needsImprovement: number; poor: number }
    > = {};

    for (const { metric } of recentMetrics) {
      if (!metricsByName[metric.name]) {
        metricsByName[metric.name] = [];
        ratingsByName[metric.name] = { good: 0, needsImprovement: 0, poor: 0 };
      }
      metricsByName[metric.name].push(metric.value);
      if (metric.rating === "good") ratingsByName[metric.name].good++;
      else if (metric.rating === "needs-improvement")
        ratingsByName[metric.name].needsImprovement++;
      else ratingsByName[metric.name].poor++;
    }

    for (const [name, values] of Object.entries(metricsByName)) {
      const sorted = values.sort((a, b) => a - b);
      const count = sorted.length;
      const avg = sorted.reduce((a, b) => a + b, 0) / count;
      const p75 = sorted[Math.floor(count * 0.75)] || 0;
      const p95 = sorted[Math.floor(count * 0.95)] || 0;

      aggregated[name] = {
        name,
        count,
        avg: Math.round(avg * 100) / 100,
        p75: Math.round(p75 * 100) / 100,
        p95: Math.round(p95 * 100) / 100,
        ...ratingsByName[name],
      };
    }

    return NextResponse.json({
      success: true,
      period: "last_hour",
      totalMetrics: recentMetrics.length,
      metrics: aggregated,
    });
  } catch (error) {
    console.error("Web Vitals GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve metrics" },
      { status: 500 },
    );
  }
}
