import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const pageViewSchema = z.object({
  url: z.string(),
  title: z.string(),
  timestamp: z.number(),
  referrer: z.string().optional(),
});

// In-memory storage for development
const pageViews: Array<{
  url: string;
  title: string;
  timestamp: number;
  referrer?: string;
  userAgent?: string;
  receivedAt: number;
}> = [];

const MAX_PAGE_VIEWS = 500;

/**
 * POST /api/analytics/page-view
 * Record a page view event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = pageViewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 },
      );
    }

    const data = validation.data;
    const userAgent = request.headers.get("user-agent") || undefined;

    // Store page view
    pageViews.push({
      ...data,
      userAgent,
      receivedAt: Date.now(),
    });

    // Keep only recent views
    if (pageViews.length > MAX_PAGE_VIEWS) {
      pageViews.shift();
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`📄 Page View: ${data.url}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page view API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record page view" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/analytics/page-view
 * Get page view statistics
 */
export async function GET() {
  try {
    // Get last hour of page views
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentViews = pageViews.filter((pv) => pv.receivedAt > oneHourAgo);

    // Count by URL
    const urlCounts: Record<string, number> = {};
    for (const view of recentViews) {
      const path = new URL(view.url, "http://localhost").pathname;
      urlCounts[path] = (urlCounts[path] || 0) + 1;
    }

    // Sort by count
    const topPages = Object.entries(urlCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({
      success: true,
      period: "last_hour",
      totalViews: recentViews.length,
      topPages,
    });
  } catch (error) {
    console.error("Page view GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve statistics" },
      { status: 500 },
    );
  }
}
