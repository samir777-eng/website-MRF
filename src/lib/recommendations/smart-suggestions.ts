interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  weakAreas: string[];
  studyGoals: string[];
  averageStudyTime: number;
}

interface Lesson {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  prerequisites: string[];
  estimatedTime: number;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Suggestion {
  type: "lesson" | "quiz" | "schedule";
  id: string;
  title: string;
  reason: string;
  priority: number;
}

export function getNextLessonSuggestion(
  userProgress: UserProgress,
  allLessons: Lesson[],
): Suggestion | null {
  // Find lessons where prerequisites are met
  const availableLessons = allLessons.filter((lesson) => {
    const prerequisitesMet = lesson.prerequisites.every((prereq) =>
      userProgress.completedLessons.includes(prereq),
    );
    const notCompleted = !userProgress.completedLessons.includes(lesson.id);
    return prerequisitesMet && notCompleted;
  });

  if (availableLessons.length === 0) return null;

  // Sort by difficulty and user's weak areas
  const sortedLessons = availableLessons.sort((a, b) => {
    const aIsWeakArea = userProgress.weakAreas.includes(a.topic) ? 1 : 0;
    const bIsWeakArea = userProgress.weakAreas.includes(b.topic) ? 1 : 0;
    return bIsWeakArea - aIsWeakArea;
  });

  const nextLesson = sortedLessons[0];

  return {
    type: "lesson",
    id: nextLesson.id,
    title: nextLesson.title,
    reason: userProgress.weakAreas.includes(nextLesson.topic)
      ? "يركز على مجال يحتاج إلى تحسين"
      : "الدرس التالي في مسار التعلم",
    priority: 1,
  };
}

export function getQuizSuggestions(
  userProgress: UserProgress,
  allQuizzes: Quiz[],
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Suggest quizzes for weak areas
  userProgress.weakAreas.forEach((weakArea) => {
    const relevantQuizzes = allQuizzes.filter(
      (quiz) => quiz.topic === weakArea && !userProgress.quizScores[quiz.id],
    );

    relevantQuizzes.slice(0, 2).forEach((quiz) => {
      suggestions.push({
        type: "quiz",
        id: quiz.id,
        title: quiz.title,
        reason: `تدريب على ${weakArea} - مجال يحتاج إلى تحسين`,
        priority: 2,
      });
    });
  });

  return suggestions;
}

export function getStudyScheduleSuggestion(
  userProgress: UserProgress,
): Suggestion | null {
  const avgTime = userProgress.averageStudyTime;

  if (avgTime < 30) {
    return {
      type: "schedule",
      id: "increase-study-time",
      title: "زيادة وقت الدراسة",
      reason: "ننصح بزيادة وقت الدراسة إلى 45-60 دقيقة يومياً",
      priority: 3,
    };
  }

  if (avgTime > 120) {
    return {
      type: "schedule",
      id: "take-breaks",
      title: "أخذ فترات راحة",
      reason: "ننصح بأخذ فترات راحة منتظمة لتحسين التركيز",
      priority: 3,
    };
  }

  return null;
}

export function getAllSuggestions(
  userProgress: UserProgress,
  allLessons: Lesson[],
  allQuizzes: Quiz[],
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const nextLesson = getNextLessonSuggestion(userProgress, allLessons);
  if (nextLesson) suggestions.push(nextLesson);

  const quizSuggestions = getQuizSuggestions(userProgress, allQuizzes);
  suggestions.push(...quizSuggestions);

  const scheduleSuggestion = getStudyScheduleSuggestion(userProgress);
  if (scheduleSuggestion) suggestions.push(scheduleSuggestion);

  return suggestions.sort((a, b) => a.priority - b.priority);
}
