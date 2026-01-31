/**
 * Adaptive Learning System for MRF Educational Platform
 * Provides personalized recommendations, difficulty adjustment, and learning path optimization
 * Based on user performance, learning patterns, and Arabic language pedagogy
 */

import { ReviewItem } from "./spacedRepetition";

export interface LearningProfile {
  userId: string;

  // Learning preferences
  preferredDifficulty: 1 | 2 | 3 | 4 | 5;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed";
  studyPace: "slow" | "moderate" | "fast";
  sessionLength: "short" | "medium" | "long"; // 10-15min, 15-30min, 30-45min

  // Performance metrics
  overallAccuracy: number;
  subjectAccuracies: { [subject: string]: number };
  averageResponseTime: number;
  consistencyScore: number; // How consistent performance is across sessions

  // Learning patterns
  strongAreas: string[]; // Subjects/topics where user excels
  weakAreas: string[]; // Subjects/topics that need improvement
  learningVelocity: number; // How quickly user masters new concepts
  retentionRate: number; // How well user retains learned material

  // Behavioral patterns
  preferredStudyTimes: number[]; // Hours of day (0-23)
  sessionFrequency: number; // Sessions per week
  motivationLevel: "low" | "medium" | "high";
  engagementScore: number; // Based on time spent, completion rates, etc.

  // Adaptive parameters
  difficultyAdjustmentRate: number; // How quickly to adjust difficulty
  recommendationWeight: number; // How much to weight recommendations
  lastUpdated: Date;
}

export interface LearningRecommendation {
  id: string;
  type: "content" | "study_method" | "schedule" | "difficulty" | "focus_area";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  reasoning: string;
  actionable: boolean;
  estimatedImpact: "low" | "medium" | "high";

  // Specific recommendations
  contentIds?: string[];
  suggestedDifficulty?: 1 | 2 | 3 | 4 | 5;
  suggestedDuration?: number; // minutes
  suggestedFrequency?: number; // times per week

  // Metadata
  confidence: number; // 0-1, how confident the system is in this recommendation
  createdAt: Date;
  validUntil?: Date;
}

export interface AdaptivePath {
  id: string;
  name: string;
  description: string;
  subject: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // days

  // Path structure
  prerequisites: string[]; // Other path IDs
  milestones: {
    id: string;
    name: string;
    description: string;
    contentIds: string[];
    requiredAccuracy: number;
    estimatedTime: number; // minutes
  }[];

  // Adaptive parameters
  adaptiveContent: boolean; // Whether content adjusts based on performance
  personalizedPacing: boolean; // Whether pacing adjusts to user

  // Progress tracking
  completionRate: number;
  averageAccuracy: number;
  timeSpent: number; // minutes
  lastAccessed?: Date;
}

// Mock learning profile for development
export const MOCK_LEARNING_PROFILE: LearningProfile = {
  userId: "current_user",
  preferredDifficulty: 3,
  learningStyle: "mixed",
  studyPace: "moderate",
  sessionLength: "medium",
  overallAccuracy: 75,
  subjectAccuracies: {
    نحو: 68,
    بلاغة: 82,
    أدب: 78,
    نصوص: 71,
    قراءة: 85,
    تعبير: 65,
  },
  averageResponseTime: 4500,
  consistencyScore: 0.72,
  strongAreas: ["بلاغة", "قراءة"],
  weakAreas: ["تعبير", "نحو"],
  learningVelocity: 0.65,
  retentionRate: 0.78,
  preferredStudyTimes: [16, 17, 18, 20, 21], // 4-6 PM, 8-9 PM
  sessionFrequency: 5,
  motivationLevel: "medium",
  engagementScore: 0.73,
  difficultyAdjustmentRate: 0.1,
  recommendationWeight: 0.8,
  lastUpdated: new Date(),
};

/**
 * Generate personalized learning recommendations
 */
export function generateRecommendations(
  profile: LearningProfile,
  reviewItems: ReviewItem[],
  recentPerformance: { accuracy: number; subject: string; timestamp: Date }[],
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];
  const now = new Date();

  // 1. Weak area focus recommendation
  if (profile.weakAreas.length > 0) {
    const weakestArea = profile.weakAreas[0];
    const weakAreaAccuracy = profile.subjectAccuracies[weakestArea] || 0;

    if (weakAreaAccuracy < 70) {
      recommendations.push({
        id: `weak_area_${weakestArea}`,
        type: "focus_area",
        priority: "high",
        title: `ركز على ${weakestArea}`,
        description: `دقتك في ${weakestArea} هي ${weakAreaAccuracy.toFixed(0)}%. نوصي بتخصيص وقت إضافي لهذا المجال.`,
        reasoning: `الأداء في ${weakestArea} أقل من المستوى المطلوب`,
        actionable: true,
        estimatedImpact: "high",
        contentIds: reviewItems
          .filter((item) => item.subject === weakestArea)
          .map((item) => item.contentId),
        suggestedDuration: 20,
        suggestedFrequency: 4,
        confidence: 0.85,
        createdAt: now,
        validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
      });
    }
  }

  // 2. Difficulty adjustment recommendation
  const recentAccuracy =
    recentPerformance.slice(-10).reduce((sum, p) => sum + p.accuracy, 0) /
    Math.max(recentPerformance.slice(-10).length, 1);

  if (recentAccuracy > 90 && profile.preferredDifficulty < 5) {
    recommendations.push({
      id: "increase_difficulty",
      type: "difficulty",
      priority: "medium",
      title: "زد من مستوى الصعوبة",
      description: "أداؤك ممتاز! حان الوقت لتحدي أكبر.",
      reasoning: `دقتك الأخيرة ${recentAccuracy.toFixed(0)}% - يمكنك التعامل مع محتوى أصعب`,
      actionable: true,
      estimatedImpact: "medium",
      suggestedDifficulty: Math.min(5, profile.preferredDifficulty + 1) as
        | 1
        | 2
        | 3
        | 4
        | 5,
      confidence: 0.75,
      createdAt: now,
    });
  } else if (recentAccuracy < 60 && profile.preferredDifficulty > 1) {
    recommendations.push({
      id: "decrease_difficulty",
      type: "difficulty",
      priority: "high",
      title: "قلل من مستوى الصعوبة",
      description: "لنبدأ بمستوى أسهل لبناء الثقة.",
      reasoning: `دقتك الأخيرة ${recentAccuracy.toFixed(0)}% - تحتاج لمحتوى أسهل لتحسين الفهم`,
      actionable: true,
      estimatedImpact: "high",
      suggestedDifficulty: Math.max(1, profile.preferredDifficulty - 1) as
        | 1
        | 2
        | 3
        | 4
        | 5,
      confidence: 0.9,
      createdAt: now,
    });
  }

  // 3. Study schedule optimization
  if (profile.sessionFrequency < 3) {
    recommendations.push({
      id: "increase_frequency",
      type: "schedule",
      priority: "medium",
      title: "زد من تكرار الدراسة",
      description: "الدراسة المنتظمة تحسن الاحتفاظ بالمعلومات.",
      reasoning: `تدرس ${profile.sessionFrequency} مرات أسبوعياً - الهدف 4-5 مرات`,
      actionable: true,
      estimatedImpact: "high",
      suggestedFrequency: Math.min(5, profile.sessionFrequency + 1),
      suggestedDuration:
        profile.sessionLength === "short"
          ? 15
          : profile.sessionLength === "medium"
            ? 25
            : 35,
      confidence: 0.8,
      createdAt: now,
    });
  }

  // 4. Learning style optimization
  if (profile.learningStyle === "visual" && profile.engagementScore < 0.7) {
    recommendations.push({
      id: "visual_content",
      type: "study_method",
      priority: "medium",
      title: "استخدم المحتوى المرئي أكثر",
      description: "كونك متعلم بصري، ركز على الرسوم البيانية والخرائط الذهنية.",
      reasoning: "نمط التعلم البصري يتطلب محتوى مرئي أكثر",
      actionable: true,
      estimatedImpact: "medium",
      confidence: 0.7,
      createdAt: now,
    });
  }

  // 5. Retention improvement
  if (profile.retentionRate < 0.7) {
    recommendations.push({
      id: "improve_retention",
      type: "study_method",
      priority: "high",
      title: "حسن من الاحتفاظ بالمعلومات",
      description: "استخدم تقنيات التكرار المتباعد والربط بين المفاهيم.",
      reasoning: `معدل الاحتفاظ ${(profile.retentionRate * 100).toFixed(0)}% - يحتاج تحسين`,
      actionable: true,
      estimatedImpact: "high",
      confidence: 0.85,
      createdAt: now,
    });
  }

  // 6. Motivation boost
  if (profile.motivationLevel === "low") {
    recommendations.push({
      id: "motivation_boost",
      type: "study_method",
      priority: "high",
      title: "عزز من دافعيتك للتعلم",
      description: "حدد أهدافاً قصيرة المدى واحتفل بالإنجازات الصغيرة.",
      reasoning: "مستوى الدافعية منخفض - يحتاج تحفيز",
      actionable: true,
      estimatedImpact: "high",
      confidence: 0.75,
      createdAt: now,
    });
  }

  // Sort by priority and confidence
  return recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence;
  });
}

/**
 * Adjust difficulty based on performance
 */
export function adjustDifficulty(
  currentDifficulty: 1 | 2 | 3 | 4 | 5,
  recentAccuracy: number,
  responseTime: number,
  averageResponseTime: number,
): 1 | 2 | 3 | 4 | 5 {
  let adjustment = 0;

  // Accuracy-based adjustment
  if (recentAccuracy >= 95) adjustment += 1;
  else if (recentAccuracy >= 85) adjustment += 0.5;
  else if (recentAccuracy < 60) adjustment -= 1;
  else if (recentAccuracy < 70) adjustment -= 0.5;

  // Response time adjustment
  if (responseTime < averageResponseTime * 0.7) adjustment += 0.3;
  else if (responseTime > averageResponseTime * 1.5) adjustment -= 0.3;

  const newDifficulty = Math.round(currentDifficulty + adjustment);
  return Math.max(1, Math.min(5, newDifficulty)) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Generate personalized learning path
 */
export function generateLearningPath(
  profile: LearningProfile,
  subject: string,
  targetLevel: 1 | 2 | 3 | 4 | 5,
): AdaptivePath {
  const pathId = `adaptive_${subject}_${targetLevel}`;

  // Define milestones based on subject and target level
  const milestones = [];

  if (subject === "نحو") {
    milestones.push(
      {
        id: "basics",
        name: "الأساسيات",
        description: "المبتدأ والخبر، الفاعل والمفعول",
        contentIds: ["grammar_basics_1", "grammar_basics_2"],
        requiredAccuracy: 75,
        estimatedTime: 45,
      },
      {
        id: "intermediate",
        name: "المستوى المتوسط",
        description: "الحال والتمييز، النعت والبدل",
        contentIds: ["grammar_inter_1", "grammar_inter_2"],
        requiredAccuracy: 80,
        estimatedTime: 60,
      },
    );
  } else if (subject === "بلاغة") {
    milestones.push({
      id: "rhetoric_basics",
      name: "أساسيات البلاغة",
      description: "التشبيه والاستعارة",
      contentIds: ["rhetoric_1", "rhetoric_2"],
      requiredAccuracy: 70,
      estimatedTime: 40,
    });
  }

  // Add advanced milestone if target level is high
  if (targetLevel >= 4) {
    milestones.push({
      id: "advanced",
      name: "المستوى المتقدم",
      description: "تطبيقات متقدمة ونصوص معقدة",
      contentIds: [`${subject}_advanced_1`, `${subject}_advanced_2`],
      requiredAccuracy: 85,
      estimatedTime: 75,
    });
  }

  return {
    id: pathId,
    name: `مسار ${subject} - المستوى ${targetLevel}`,
    description: `مسار تعليمي مخصص لإتقان ${subject} حسب مستواك وأسلوب تعلمك`,
    subject,
    difficulty: targetLevel,
    estimatedDuration: milestones.length * 7, // 1 week per milestone
    prerequisites:
      targetLevel > 1 ? [`adaptive_${subject}_${targetLevel - 1}`] : [],
    milestones,
    adaptiveContent: true,
    personalizedPacing: true,
    completionRate: 0,
    averageAccuracy: 0,
    timeSpent: 0,
  };
}

/**
 * Update learning profile based on recent performance
 */
export function updateLearningProfile(
  profile: LearningProfile,
  recentSessions: {
    accuracy: number;
    subject: string;
    duration: number;
    timestamp: Date;
  }[],
): LearningProfile {
  if (recentSessions.length === 0) return profile;

  // Update overall accuracy (weighted average)
  const recentAccuracy =
    recentSessions.reduce((sum, s) => sum + s.accuracy, 0) /
    recentSessions.length;
  const newOverallAccuracy =
    profile.overallAccuracy * 0.8 + recentAccuracy * 0.2;

  // Update subject accuracies
  const newSubjectAccuracies = { ...profile.subjectAccuracies };
  const subjectSessions: { [subject: string]: number[] } = {};

  recentSessions.forEach((session) => {
    if (!subjectSessions[session.subject]) {
      subjectSessions[session.subject] = [];
    }
    subjectSessions[session.subject].push(session.accuracy);
  });

  Object.entries(subjectSessions).forEach(([subject, accuracies]) => {
    const avgAccuracy =
      accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const currentAccuracy = newSubjectAccuracies[subject] || 0;
    newSubjectAccuracies[subject] = currentAccuracy * 0.7 + avgAccuracy * 0.3;
  });

  // Update weak and strong areas
  const sortedSubjects = Object.entries(newSubjectAccuracies).sort(
    ([, a], [, b]) => a - b,
  );

  const newWeakAreas = sortedSubjects
    .filter(([, accuracy]) => accuracy < 75)
    .slice(0, 3)
    .map(([subject]) => subject);

  const newStrongAreas = sortedSubjects
    .filter(([, accuracy]) => accuracy >= 80)
    .slice(-3)
    .map(([subject]) => subject);

  // Update consistency score
  const accuracyVariance =
    recentSessions.reduce(
      (sum, s) => sum + Math.pow(s.accuracy - recentAccuracy, 2),
      0,
    ) / recentSessions.length;
  const newConsistencyScore = Math.max(0, 1 - accuracyVariance / 1000);

  return {
    ...profile,
    overallAccuracy: newOverallAccuracy,
    subjectAccuracies: newSubjectAccuracies,
    consistencyScore: newConsistencyScore,
    strongAreas: newStrongAreas,
    weakAreas: newWeakAreas,
    lastUpdated: new Date(),
  };
}
