import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for progress entries
const progressEntrySchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  userId: z.string().optional(),
  currentPosition: z.number(),
  duration: z.number(),
  completed: z.boolean(),
  lastUpdated: z.number(),
  synced: z.boolean().optional(),
});

const syncProgressSchema = z.object({
  progress: z.array(progressEntrySchema),
});

// In-memory storage (replace with database in production)
const progressStore = new Map<string, z.infer<typeof progressEntrySchema>>();

/**
 * POST /api/sync/progress
 * Sync progress data from client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = syncProgressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { progress } = validation.data;

    // Process each progress entry
    const results = {
      synced: 0,
      conflicts: 0,
      errors: 0,
    };

    for (const entry of progress) {
      try {
        const existing = progressStore.get(entry.id);

        // Check for conflicts (server has newer data)
        if (existing && existing.lastUpdated > entry.lastUpdated) {
          results.conflicts++;
          continue;
        }

        // Save the progress
        progressStore.set(entry.id, { ...entry, synced: true });
        results.synced++;
      } catch {
        results.errors++;
      }
    }

    console.log(
      `📥 Progress synced: ${results.synced} entries, ${results.conflicts} conflicts`,
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Sync progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync progress" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/sync/progress
 * Get progress for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      // Get specific lesson progress
      const progress = Array.from(progressStore.values()).find(
        (p) => p.lessonId === lessonId,
      );

      return NextResponse.json({
        success: true,
        progress: progress || null,
      });
    }

    // Get all progress
    const allProgress = Array.from(progressStore.values());
    return NextResponse.json({
      success: true,
      progress: allProgress,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get progress" },
      { status: 500 },
    );
  }
}
