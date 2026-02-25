import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for quiz results
const quizResultSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  userId: z.string().optional(),
  score: z.number().min(0).max(100),
  answers: z.record(z.string(), z.string()),
  timeSpent: z.number(),
  completedAt: z.number(),
  synced: z.boolean().optional(),
});

const syncQuizResultsSchema = z.object({
  results: z.array(quizResultSchema),
});

// In-memory storage (replace with database in production)
const quizResultsStore = new Map<string, z.infer<typeof quizResultSchema>>();

/**
 * POST /api/sync/quiz-results
 * Sync quiz results from client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = syncQuizResultsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { results } = validation.data;

    const syncResults = {
      synced: 0,
      duplicates: 0,
      errors: 0,
    };

    for (const result of results) {
      try {
        // Check for duplicate (same quiz result already exists)
        if (quizResultsStore.has(result.id)) {
          syncResults.duplicates++;
          continue;
        }

        // Save the quiz result
        quizResultsStore.set(result.id, { ...result, synced: true });
        syncResults.synced++;

        // In production, also trigger gamification rewards
        // await awardXPForQuiz(result.score);
      } catch {
        syncResults.errors++;
      }
    }

    console.log(
      `📥 Quiz results synced: ${syncResults.synced} entries, ${syncResults.duplicates} duplicates`
    );

    return NextResponse.json({
      success: true,
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync quiz results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync quiz results" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync/quiz-results
 * Get quiz results for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    if (quizId) {
      // Get results for specific quiz
      const results = Array.from(quizResultsStore.values())
        .filter((r) => r.quizId === quizId)
        .sort((a, b) => b.completedAt - a.completedAt);

      return NextResponse.json({
        success: true,
        results,
      });
    }

    // Get all results
    const allResults = Array.from(quizResultsStore.values()).sort(
      (a, b) => b.completedAt - a.completedAt
    );

    return NextResponse.json({
      success: true,
      results: allResults,
    });
  } catch (error) {
    console.error("Get quiz results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get quiz results" },
      { status: 500 }
    );
  }
}
