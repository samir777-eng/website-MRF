import { http, HttpResponse } from "msw";

// API Request Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  grade: string;
}

interface QuizSubmissionRequest {
  answers: Record<string, string>;
}

// Mock data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "01234567890",
  grade: 2,
  xp: 2500,
  level: 3,
  streakDays: 7,
  badges: ["first-lesson", "quiz-master", "week-streak"],
  completedLessons: ["1", "2", "3"],
  preferences: {
    language: "ar",
    theme: "light",
    notifications: true,
  },
};

const mockLessons = [
  {
    id: "1",
    title: "مقدمة في النحو العربي",
    description: "تعلم أساسيات النحو العربي والإعراب",
    grade: 1,
    subject: "arabic",
    duration: 1800, // 30 minutes
    difficulty: "beginner",
    videoUrl: "https://example.com/video1.m3u8",
    thumbnailUrl: "https://via.placeholder.com/640x360",
    resources: ["worksheet1.pdf", "examples1.pdf"],
    completed: true,
    progress: 100,
    quiz: {
      id: "quiz-1",
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: 'ما هو الفاعل في الجملة التالية: "قرأ الطالب الكتاب"؟',
          options: ["قرأ", "الطالب", "الكتاب", "لا يوجد فاعل"],
          correctAnswer: 1,
          explanation: "الطالب هو الفاعل لأنه من قام بالفعل",
        },
        {
          id: "q2",
          type: "true-false",
          question: "الفاعل دائماً مرفوع",
          correctAnswer: true,
          explanation: "نعم، الفاعل دائماً مرفوع في اللغة العربية",
        },
      ],
      passingScore: 70,
    },
  },
  {
    id: "2",
    title: "الأفعال وأنواعها",
    description: "دراسة الأفعال الماضية والمضارعة والأمر",
    grade: 1,
    subject: "arabic",
    duration: 2100, // 35 minutes
    difficulty: "beginner",
    videoUrl: "https://example.com/video2.m3u8",
    thumbnailUrl: "https://via.placeholder.com/640x360",
    resources: ["worksheet2.pdf"],
    completed: true,
    progress: 100,
    quiz: {
      id: "quiz-2",
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "أي من الأفعال التالية فعل مضارع؟",
          options: ["كتب", "يكتب", "اكتب", "كاتب"],
          correctAnswer: 1,
          explanation: 'يكتب فعل مضارع لأنه يبدأ بحرف المضارعة "ي"',
        },
      ],
      passingScore: 70,
    },
  },
  {
    id: "3",
    title: "البلاغة والتشبيه",
    description: "فهم أساليب البلاغة والتشبيه في الأدب العربي",
    grade: 2,
    subject: "arabic",
    duration: 2700, // 45 minutes
    difficulty: "intermediate",
    videoUrl: "https://example.com/video3.m3u8",
    thumbnailUrl: "https://via.placeholder.com/640x360",
    resources: ["examples3.pdf", "exercises3.pdf"],
    completed: false,
    progress: 0,
    quiz: {
      id: "quiz-3",
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: 'ما هو التشبيه في البيت التالي: "أنت كالبدر في الجمال"؟',
          options: ["أنت", "البدر", "الجمال", "كالبدر"],
          correctAnswer: 3,
          explanation: "كالبدر هو أداة التشبيه والمشبه به",
        },
      ],
      passingScore: 70,
    },
  },
];

const mockQuests = [
  {
    id: "daily-1",
    type: "daily",
    title: "شاهد محاضرة واحدة",
    description: "شاهد محاضرة واحدة على الأقل اليوم",
    progress: 1,
    target: 1,
    reward: { xp: 50, type: "xp" },
    completed: true,
  },
  {
    id: "daily-2",
    type: "daily",
    title: "أكمل اختبار",
    description: "أكمل اختبار واحد بنجاح",
    progress: 0,
    target: 1,
    reward: { xp: 75, type: "xp" },
    completed: false,
  },
  {
    id: "weekly-1",
    type: "weekly",
    title: "حافظ على السلسلة",
    description: "حافظ على سلسلة 7 أيام متتالية",
    progress: 7,
    target: 7,
    reward: { xp: 200, badge: "week-streak", type: "badge" },
    completed: true,
  },
];

export const handlers = [
  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    // Simple mock validation
    if (email === "ahmed@example.com" && password === "password") {
      return HttpResponse.json({
        success: true,
        user: mockUser,
        token: "mock-jwt-token",
      });
    }

    return HttpResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 },
    );
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const userData = (await request.json()) as RegisterRequest;

    return HttpResponse.json({
      success: true,
      user: { ...mockUser, ...userData, id: Date.now().toString() },
      token: "mock-jwt-token",
    });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      success: true,
      user: mockUser,
    });
  }),

  // Lessons endpoints
  http.get("/api/lessons", ({ request }) => {
    const url = new URL(request.url);
    const grade = url.searchParams.get("grade");
    const subject = url.searchParams.get("subject");

    let filteredLessons = mockLessons;

    if (grade) {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.grade === parseInt(grade),
      );
    }

    if (subject) {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.subject === subject,
      );
    }

    return HttpResponse.json({
      success: true,
      lessons: filteredLessons,
    });
  }),

  http.get("/api/lessons/:id", ({ params }) => {
    const lesson = mockLessons.find((l) => l.id === params.id);

    if (!lesson) {
      return HttpResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      lesson,
    });
  }),

  // Quiz endpoints
  http.post("/api/quiz/:id/submit", async ({ params, request }) => {
    const { answers } = (await request.json()) as QuizSubmissionRequest;
    const lesson = mockLessons.find((l) => l.quiz.id === params.id);

    if (!lesson) {
      return HttpResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 },
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const results = lesson.quiz.questions.map((question, _index) => {
      const userAnswer = answers[question.id];
      const isCorrect = String(userAnswer) === String(question.correctAnswer);
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    const score = Math.round(
      (correctAnswers / lesson.quiz.questions.length) * 100,
    );
    const passed = score >= lesson.quiz.passingScore;

    return HttpResponse.json({
      success: true,
      results: {
        score,
        passed,
        correctAnswers,
        totalQuestions: lesson.quiz.questions.length,
        details: results,
        xpEarned: passed ? 100 : 25,
      },
    });
  }),

  // Gamification endpoints
  http.get("/api/user/progress", () => {
    return HttpResponse.json({
      success: true,
      progress: {
        xp: mockUser.xp,
        level: mockUser.level,
        streakDays: mockUser.streakDays,
        badges: mockUser.badges,
        completedLessons: mockUser.completedLessons.length,
        totalLessons: mockLessons.length,
        averageScore: 85,
      },
    });
  }),

  http.get("/api/quests", () => {
    return HttpResponse.json({
      success: true,
      quests: mockQuests,
    });
  }),

  http.post("/api/quests/:id/claim", ({ params }) => {
    const quest = mockQuests.find((q) => q.id === params.id);

    if (!quest || !quest.completed) {
      return HttpResponse.json(
        { success: false, message: "Quest not available for claiming" },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      success: true,
      reward: quest.reward,
    });
  }),

  // Analytics (no-op for frontend-only)
  http.post("/api/analytics/track", () => {
    return HttpResponse.json({ success: true });
  }),
];
