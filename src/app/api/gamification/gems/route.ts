import { getResetTime, rateLimit } from "@/lib/security/rate-limiter";
import {
  GEM_REWARDS,
  getGemRewardForRarity,
  getShopItem,
} from "@/types/gamification";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// In-memory store for demo (replace with database in production)
const userGems: Map<
  string,
  { balance: number; totalEarned: number; totalSpent: number }
> = new Map();
const userPurchases: Map<
  string,
  { itemId: string; quantity: number; purchasedAt: Date }[]
> = new Map();

// Validation schemas
const earnGemsSchema = z.object({
  action: z.enum([
    "daily_login",
    "daily_question",
    "achievement",
    "quest_daily",
    "quest_weekly",
    "quest_monthly",
    "level_up",
    "streak_bonus",
    "invite_friend",
    "friend_joined",
  ]),
  context: z
    .object({
      achievementRarity: z
        .enum(["common", "rare", "epic", "legendary"])
        .optional(),
      streakDays: z.number().optional(),
    })
    .optional(),
  nonce: z.string().optional(),
});

const spendGemsSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).max(10).default(1),
  nonce: z.string().optional(),
});

/**
 * GET /api/gamification/gems
 * Get user's gem balance and transaction history
 */
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? extractUserIdFromToken(authToken) : "demo-user";

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    const gems = userGems.get(userId) || {
      balance: 500,
      totalEarned: 500,
      totalSpent: 0,
    };
    const purchases = userPurchases.get(userId) || [];

    return NextResponse.json({
      success: true,
      balance: gems.balance,
      totalEarned: gems.totalEarned,
      totalSpent: gems.totalSpent,
      recentPurchases: purchases.slice(-10),
    });
  } catch (error) {
    console.error("Get gems error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/gems
 * Earn or spend gems
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 20 gem transactions per minute
    if (!rateLimit(request, 20, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: "طلبات كثيرة جداً. يرجى المحاولة لاحقاً.",
          retryAfter,
        },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? extractUserIdFromToken(authToken) : "demo-user";

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get("operation") || "earn";

    if (operation === "earn") {
      return handleEarnGems(userId, body);
    } else if (operation === "spend") {
      return handleSpendGems(userId, body);
    } else {
      return NextResponse.json(
        { success: false, error: "عملية غير صالحة" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Gems transaction error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

function handleEarnGems(userId: string, body: unknown) {
  const validation = earnGemsSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: "بيانات غير صالحة",
        errors: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { action, context } = validation.data;
  let gemsEarned = 0;

  // Calculate gems based on action
  switch (action) {
    case "daily_login":
      gemsEarned = GEM_REWARDS.DAILY_LOGIN;
      break;
    case "daily_question":
      gemsEarned = GEM_REWARDS.DAILY_QUESTION_CORRECT;
      break;
    case "achievement":
      if (context?.achievementRarity) {
        gemsEarned = getGemRewardForRarity(context.achievementRarity);
      }
      break;
    case "quest_daily":
      gemsEarned = GEM_REWARDS.QUEST_DAILY;
      break;
    case "quest_weekly":
      gemsEarned = GEM_REWARDS.QUEST_WEEKLY;
      break;
    case "quest_monthly":
      gemsEarned = GEM_REWARDS.QUEST_MONTHLY;
      break;
    case "level_up":
      gemsEarned = GEM_REWARDS.LEVEL_UP;
      break;
    case "streak_bonus":
      const days = context?.streakDays || 0;
      if (days >= 100) gemsEarned = GEM_REWARDS.STREAK_100;
      else if (days >= 30) gemsEarned = GEM_REWARDS.STREAK_30;
      else if (days >= 7) gemsEarned = GEM_REWARDS.STREAK_7;
      break;
    case "invite_friend":
      gemsEarned = GEM_REWARDS.INVITE_FRIEND;
      break;
    case "friend_joined":
      gemsEarned = GEM_REWARDS.FRIEND_JOINS;
      break;
  }

  // Update user gems
  const current = userGems.get(userId) || {
    balance: 500,
    totalEarned: 500,
    totalSpent: 0,
  };
  current.balance += gemsEarned;
  current.totalEarned += gemsEarned;
  userGems.set(userId, current);

  return NextResponse.json({
    success: true,
    gemsEarned,
    newBalance: current.balance,
    action,
  });
}

function handleSpendGems(userId: string, body: unknown) {
  const validation = spendGemsSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: "بيانات غير صالحة",
        errors: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { itemId, quantity } = validation.data;
  const item = getShopItem(itemId);

  if (!item) {
    return NextResponse.json(
      { success: false, error: "المنتج غير موجود" },
      { status: 404 }
    );
  }

  if (!item.isActive) {
    return NextResponse.json(
      { success: false, error: "المنتج غير متاح حالياً" },
      { status: 400 }
    );
  }

  const totalCost = item.price * quantity;
  const current = userGems.get(userId) || {
    balance: 500,
    totalEarned: 500,
    totalSpent: 0,
  };

  if (current.balance < totalCost) {
    return NextResponse.json(
      {
        success: false,
        error: "رصيد الجواهر غير كافٍ",
        required: totalCost,
        available: current.balance,
      },
      { status: 400 }
    );
  }

  // Check purchase limits
  if (item.maxPerUser) {
    const purchases = userPurchases.get(userId) || [];
    const existingPurchases = purchases
      .filter((p) => p.itemId === itemId)
      .reduce((sum, p) => sum + p.quantity, 0);
    if (existingPurchases + quantity > item.maxPerUser) {
      return NextResponse.json(
        { success: false, error: `الحد الأقصى للشراء هو ${item.maxPerUser}` },
        { status: 400 }
      );
    }
  }

  // Deduct gems
  current.balance -= totalCost;
  current.totalSpent += totalCost;
  userGems.set(userId, current);

  // Record purchase
  const purchases = userPurchases.get(userId) || [];
  purchases.push({ itemId, quantity, purchasedAt: new Date() });
  userPurchases.set(userId, purchases);

  return NextResponse.json({
    success: true,
    itemPurchased: {
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      quantity,
    },
    gemsSpent: totalCost,
    newBalance: current.balance,
  });
}

function extractUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    return "user-1";
  }
  return "demo-user";
}
