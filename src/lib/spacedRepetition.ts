/**
 * Spaced Repetition System for MRF Educational Platform
 * Based on SuperMemo SM-2 algorithm with adaptations for Arabic language learning
 * Optimized for vocabulary, grammar rules, and concept retention
 */

export interface ReviewItem {
  id: string;
  contentId: string;
  contentType: 'vocabulary' | 'grammar' | 'concept' | 'verse' | 'exercise';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = very easy, 5 = very hard
  
  // Spaced repetition data
  easeFactor: number; // Starting at 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReviewDate: Date;
  lastReviewDate?: Date;
  
  // Performance tracking
  totalReviews: number;
  correctReviews: number;
  averageResponseTime: number; // milliseconds
  streakCount: number; // consecutive correct answers
  
  // Learning context
  subject: 'نحو' | 'بلاغة' | 'أدب' | 'نصوص' | 'قراءة' | 'تعبير';
  tags: string[];
  relatedItems: string[]; // IDs of related review items
  
  // Metadata
  createdAt: Date;
  lastModified: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ReviewSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  itemsReviewed: string[];
  totalItems: number;
  correctAnswers: number;
  averageResponseTime: number;
  sessionType: 'scheduled' | 'practice' | 'cram' | 'weak_areas';
  xpEarned: number;
}

export interface ReviewResponse {
  itemId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0 = complete blackout, 5 = perfect response
  responseTime: number; // milliseconds
  timestamp: Date;
  hints_used: number;
  confidence: 1 | 2 | 3 | 4 | 5; // self-reported confidence
}

// SM-2 Algorithm Configuration
export const SM2_CONFIG = {
  INITIAL_EASE_FACTOR: 2.5,
  MINIMUM_EASE_FACTOR: 1.3,
  EASE_FACTOR_BONUS: 0.1,
  EASE_FACTOR_PENALTY: 0.2,
  MINIMUM_INTERVAL: 1,
  MAXIMUM_INTERVAL: 365,
  QUALITY_THRESHOLD: 3, // Minimum quality for successful review
};

// Difficulty-based initial intervals (days)
export const DIFFICULTY_INTERVALS = {
  1: { first: 1, second: 3 }, // Very easy
  2: { first: 1, second: 4 }, // Easy
  3: { first: 1, second: 6 }, // Medium
  4: { first: 2, second: 8 }, // Hard
  5: { first: 3, second: 10 }, // Very hard
};

// Arabic-specific learning patterns
export const ARABIC_LEARNING_PATTERNS = {
  vocabulary: {
    baseMultiplier: 1.0,
    difficultyBonus: 0.2,
    contextBonus: 0.1, // When learned with related words
  },
  grammar: {
    baseMultiplier: 1.2, // Grammar rules need more repetition
    difficultyBonus: 0.3,
    contextBonus: 0.15,
  },
  concept: {
    baseMultiplier: 1.1,
    difficultyBonus: 0.25,
    contextBonus: 0.2,
  },
  verse: {
    baseMultiplier: 0.9, // Poetry/verses are often easier to remember
    difficultyBonus: 0.15,
    contextBonus: 0.25,
  },
  exercise: {
    baseMultiplier: 1.3, // Practical exercises need more practice
    difficultyBonus: 0.35,
    contextBonus: 0.1,
  },
};

/**
 * Calculate the next review interval using modified SM-2 algorithm
 */
export function calculateNextInterval(
  item: ReviewItem,
  response: ReviewResponse
): { interval: number; easeFactor: number; repetitions: number } {
  const { quality, responseTime } = response;
  let { easeFactor, interval, repetitions } = item;

  // Quality assessment (0-5 scale)
  if (quality >= SM2_CONFIG.QUALITY_THRESHOLD) {
    // Successful review
    if (repetitions === 0) {
      interval = DIFFICULTY_INTERVALS[item.difficulty].first;
    } else if (repetitions === 1) {
      interval = DIFFICULTY_INTERVALS[item.difficulty].second;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Failed review - reset repetitions but keep some interval
    repetitions = 0;
    interval = Math.max(1, Math.round(interval * 0.3));
  }

  // Adjust ease factor based on quality
  const qualityFactor = (5 - quality) * SM2_CONFIG.EASE_FACTOR_PENALTY;
  easeFactor = Math.max(
    SM2_CONFIG.MINIMUM_EASE_FACTOR,
    easeFactor + (0.1 - qualityFactor)
  );

  // Apply Arabic learning pattern adjustments
  const pattern = ARABIC_LEARNING_PATTERNS[item.contentType];
  interval = Math.round(interval * pattern.baseMultiplier);

  // Response time adjustment (faster response = easier item)
  const avgResponseTime = item.averageResponseTime || 5000; // 5 seconds default
  if (responseTime < avgResponseTime * 0.7) {
    // Much faster than average - item might be too easy
    interval = Math.round(interval * 1.2);
    easeFactor = Math.min(3.0, easeFactor + 0.05);
  } else if (responseTime > avgResponseTime * 1.5) {
    // Much slower than average - item is difficult
    interval = Math.round(interval * 0.8);
    easeFactor = Math.max(SM2_CONFIG.MINIMUM_EASE_FACTOR, easeFactor - 0.05);
  }

  // Apply bounds
  interval = Math.max(SM2_CONFIG.MINIMUM_INTERVAL, Math.min(SM2_CONFIG.MAXIMUM_INTERVAL, interval));

  return { interval, easeFactor, repetitions };
}

/**
 * Get items due for review
 */
export function getItemsDueForReview(
  items: ReviewItem[],
  currentDate: Date = new Date(),
  maxItems: number = 20
): ReviewItem[] {
  const dueItems = items
    .filter(item => 
      item.isActive && 
      item.nextReviewDate <= currentDate
    )
    .sort((a, b) => {
      // Priority sorting: urgent > overdue > priority > ease factor
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
      
      // Overdue items first
      const aOverdue = (currentDate.getTime() - a.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24);
      const bOverdue = (currentDate.getTime() - b.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (aOverdue > 1 && bOverdue <= 1) return -1;
      if (bOverdue > 1 && aOverdue <= 1) return 1;
      
      // Then by priority
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Finally by ease factor (harder items first)
      return a.easeFactor - b.easeFactor;
    });

  return dueItems.slice(0, maxItems);
}

/**
 * Update review item after a review session
 */
export function updateReviewItem(
  item: ReviewItem,
  response: ReviewResponse
): ReviewItem {
  const { interval, easeFactor, repetitions } = calculateNextInterval(item, response);
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  // Update performance metrics
  const totalReviews = item.totalReviews + 1;
  const correctReviews = item.correctReviews + (response.quality >= SM2_CONFIG.QUALITY_THRESHOLD ? 1 : 0);
  const streakCount = response.quality >= SM2_CONFIG.QUALITY_THRESHOLD ? item.streakCount + 1 : 0;
  
  // Update average response time (weighted average)
  const avgResponseTime = item.averageResponseTime 
    ? (item.averageResponseTime * 0.8 + response.responseTime * 0.2)
    : response.responseTime;

  return {
    ...item,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: response.timestamp,
    totalReviews,
    correctReviews,
    averageResponseTime: avgResponseTime,
    streakCount,
    lastModified: new Date(),
  };
}

/**
 * Generate review statistics
 */
export function getReviewStatistics(items: ReviewItem[]): {
  totalItems: number;
  dueToday: number;
  overdue: number;
  mastered: number; // Items with high ease factor and long intervals
  struggling: number; // Items with low ease factor
  averageAccuracy: number;
  totalReviews: number;
  streakItems: number; // Items with streak > 5
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueToday = items.filter(item => 
    item.isActive && item.nextReviewDate >= today && item.nextReviewDate < tomorrow
  ).length;

  const overdue = items.filter(item => 
    item.isActive && item.nextReviewDate < today
  ).length;

  const mastered = items.filter(item => 
    item.easeFactor >= 2.8 && item.interval >= 30 && item.repetitions >= 5
  ).length;

  const struggling = items.filter(item => 
    item.easeFactor <= 1.5 || (item.totalReviews >= 5 && (item.correctReviews / item.totalReviews) < 0.6)
  ).length;

  const totalReviews = items.reduce((sum, item) => sum + item.totalReviews, 0);
  const totalCorrect = items.reduce((sum, item) => sum + item.correctReviews, 0);
  const averageAccuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

  const streakItems = items.filter(item => item.streakCount >= 5).length;

  return {
    totalItems: items.length,
    dueToday,
    overdue,
    mastered,
    struggling,
    averageAccuracy,
    totalReviews,
    streakItems,
  };
}

/**
 * Create a new review item
 */
export function createReviewItem(
  contentId: string,
  contentType: ReviewItem['contentType'],
  title: string,
  description: string,
  difficulty: ReviewItem['difficulty'],
  subject: ReviewItem['subject'],
  tags: string[] = []
): ReviewItem {
  const now = new Date();
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + DIFFICULTY_INTERVALS[difficulty].first);

  return {
    id: `review_${contentId}_${Date.now()}`,
    contentId,
    contentType,
    title,
    description,
    difficulty,
    easeFactor: SM2_CONFIG.INITIAL_EASE_FACTOR,
    interval: DIFFICULTY_INTERVALS[difficulty].first,
    repetitions: 0,
    nextReviewDate,
    totalReviews: 0,
    correctReviews: 0,
    averageResponseTime: 0,
    streakCount: 0,
    subject,
    tags,
    relatedItems: [],
    createdAt: now,
    lastModified: now,
    isActive: true,
    priority: 'medium',
  };
}

/**
 * Get optimal study session size based on user performance
 */
export function getOptimalSessionSize(
  userStats: { averageAccuracy: number; averageSessionTime: number },
  availableTime: number // minutes
): number {
  const baseSessionSize = 10;
  
  // Adjust based on accuracy
  let sizeMultiplier = 1.0;
  if (userStats.averageAccuracy >= 90) sizeMultiplier = 1.3;
  else if (userStats.averageAccuracy >= 80) sizeMultiplier = 1.1;
  else if (userStats.averageAccuracy < 60) sizeMultiplier = 0.7;
  
  // Adjust based on available time
  const estimatedTimePerItem = 45; // seconds
  const maxItemsByTime = Math.floor((availableTime * 60) / estimatedTimePerItem);
  
  const optimalSize = Math.round(baseSessionSize * sizeMultiplier);
  return Math.min(optimalSize, maxItemsByTime, 25); // Cap at 25 items
}
