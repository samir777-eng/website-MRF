import { NextResponse } from "next/server";

/**
 * Health Check Endpoint
 *
 * This endpoint is used by automated tests to verify the server is ready
 * before running test suites. It helps prevent test failures due to
 * server startup delays or compilation issues.
 *
 * @returns JSON response with server health status
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "ok",
        ready: true,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || "development",
        message: "Server is healthy and ready to accept requests",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        ready: false,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
