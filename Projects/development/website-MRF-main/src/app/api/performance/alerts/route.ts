import { NextRequest, NextResponse } from "next/server";

interface PerformanceAlert {
  sessionId: string;
  alert: {
    metric: string;
    threshold: number;
    value: number;
    severity: "low" | "medium" | "high" | "critical";
    timestamp: number;
  };
  url: string;
  timestamp: number;
}

// In-memory storage for demo (use database in production)
const criticalAlerts: PerformanceAlert[] = [];

export async function POST(request: NextRequest) {
  try {
    const alertData: PerformanceAlert = await request.json();

    // Validate alert data
    if (!alertData.sessionId || !alertData.alert) {
      return NextResponse.json(
        { error: "Invalid alert data structure" },
        { status: 400 },
      );
    }

    // Store critical alert
    criticalAlerts.push(alertData);

    // Keep only last 500 alerts
    if (criticalAlerts.length > 500) {
      criticalAlerts.splice(0, criticalAlerts.length - 500);
    }

    // Log critical alert
    console.error("🚨 CRITICAL PERFORMANCE ALERT:", {
      sessionId: alertData.sessionId,
      metric: alertData.alert.metric,
      value: alertData.alert.value,
      threshold: alertData.alert.threshold,
      severity: alertData.alert.severity,
      url: alertData.url,
      timestamp: new Date(alertData.timestamp).toISOString(),
    });

    // In production, you might want to:
    // 1. Send to monitoring service (DataDog, New Relic, etc.)
    // 2. Send Slack/Discord notification
    // 3. Send email to dev team
    // 4. Create incident in PagerDuty
    // 5. Store in database for analysis

    // Example: Send to external monitoring service
    if (process.env.MONITORING_WEBHOOK_URL) {
      try {
        await fetch(process.env.MONITORING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚨 Critical Performance Alert: ${alertData.alert.metric} = ${alertData.alert.value}ms (threshold: ${alertData.alert.threshold}ms) on ${alertData.url}`,
            alert: alertData,
          }),
        });
      } catch (error) {
        console.error("Failed to send alert to monitoring service:", error);
      }
    }

    return NextResponse.json({
      success: true,
      alertId: `alert-${Date.now()}`,
      message: "Alert received and processed",
    });
  } catch (error) {
    console.error("Error processing performance alert:", error);
    return NextResponse.json(
      { error: "Failed to process alert" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const severity = searchParams.get("severity");
    const sessionId = searchParams.get("sessionId");

    let filteredAlerts = [...criticalAlerts];

    // Filter by severity
    if (severity) {
      filteredAlerts = filteredAlerts.filter(
        (a) => a.alert.severity === severity,
      );
    }

    // Filter by session
    if (sessionId) {
      filteredAlerts = filteredAlerts.filter((a) => a.sessionId === sessionId);
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => b.timestamp - a.timestamp);

    // Limit results
    const limitedAlerts = filteredAlerts.slice(0, limit);

    // Calculate alert statistics
    const stats = {
      total: criticalAlerts.length,
      filtered: filteredAlerts.length,
      bySeverity: {
        critical: criticalAlerts.filter((a) => a.alert.severity === "critical")
          .length,
        high: criticalAlerts.filter((a) => a.alert.severity === "high").length,
        medium: criticalAlerts.filter((a) => a.alert.severity === "medium")
          .length,
        low: criticalAlerts.filter((a) => a.alert.severity === "low").length,
      },
      byMetric: criticalAlerts.reduce(
        (acc, alert) => {
          const metric = alert.alert.metric;
          acc[metric] = (acc[metric] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      recentCount: criticalAlerts.filter(
        (a) => a.timestamp > Date.now() - 60 * 60 * 1000, // Last hour
      ).length,
    };

    return NextResponse.json({
      alerts: limitedAlerts,
      statistics: stats,
      filters: {
        severity,
        sessionId,
        limit,
      },
    });
  } catch (error) {
    console.error("Error retrieving performance alerts:", error);
    return NextResponse.json(
      { error: "Failed to retrieve alerts" },
      { status: 500 },
    );
  }
}
