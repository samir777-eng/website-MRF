# MRF Educational Platform - Complete AI Context Reference

## Project Overview

**Name:** منصة الأستاذ رضا الفاروق التعليمية (Mr. Reda El Farouk Educational Platform)  
**Purpose:** Educational platform for Egyptian secondary school students (Grades 1-3) to learn Arabic language  
**Target Audience:** Egyptian high school students (Thanawiya Amma)  
**Primary Language:** Arabic (RTL) with English support  
**URL:** mrredaelfarouk.com

---

## Technology Stack

### Core Infrastructure

| Technology   | Version     | Purpose                             |
| ------------ | ----------- | ----------------------------------- |
| Next.js      | 15          | App Router, Turbopack, SSR/SSG      |
| React        | 19          | UI Library with Concurrent Features |
| TypeScript   | Strict Mode | Type Safety                         |
| Tailwind CSS | 4           | Utility-first CSS with RTL support  |

### UI/Design

- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible primitive components
- **Framer Motion** - Animations and micro-interactions
- **Lucide React** - Icon library

### State Management & Data

- **Zustand** - Lightweight state management
- **SWR** - Data fetching and caching
- **MSW (Mock Service Worker)** - API mocking

### Internationalization

- **next-intl** - i18n with full RTL support
- Default locale: `ar` (Arabic)
- Supported locales: `ar`, `en`

### Testing

- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Testing Library** - Component testing
- **axe-core** - Accessibility testing

---

## Project Structure

```text
mrf-edu-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── ar/                 # Arabic locale routes
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── auth/           # Login, Register, Forgot Password
│   │   │   ├── dashboard/      # Student dashboard
│   │   │   ├── lectures/       # Video lectures
│   │   │   ├── lessons/[id]/   # Individual lessons
│   │   │   ├── quizzes/[id]/   # Quiz system
│   │   │   ├── exercises/      # Practice exercises
│   │   │   ├── homework/       # Homework assignments
│   │   │   ├── profile/        # User profile
│   │   │   ├── settings/       # User settings
│   │   │   ├── achievements/   # Gamification achievements
│   │   │   ├── leaderboard/    # Rankings
│   │   │   ├── packages/       # Subscription packages
│   │   │   ├── books/          # Book store
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Payment checkout
│   │   │   └── ...
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Auth endpoints
│   │   │   ├── health/         # Health check
│   │   │   └── performance/    # Performance metrics
│   │   └── globals.css         # Global styles & design tokens
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI (shadcn/ui)
│   │   ├── auth/               # Authentication
│   │   ├── gamification/       # XP, Streaks, Achievements
│   │   ├── quiz/               # Quiz engine
│   │   ├── video/              # Video player
│   │   ├── layout/             # Navigation, Footer
│   │   ├── animations/         # Motion components
│   │   └── ...
│   ├── contexts/               # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── GamificationContext.tsx
│   │   ├── SearchContext.tsx
│   │   ├── SpacedRepetitionContext.tsx
│   │   └── StoreContext.tsx
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   │   ├── i18n/               # Internationalization
│   │   ├── store/              # Zustand stores
│   │   ├── security/           # Auth, JWT, Rate limiting
│   │   ├── gamification.ts     # XP, levels, achievements
│   │   └── ...
│   ├── types/                  # TypeScript definitions
│   └── tests/                  # Test files
├── public/                     # Static assets
├── tests/                      # Playwright E2E tests
└── pattern-crib/               # Design patterns reference
```

---

## Critical Business Rules

### 1. Grade Isolation (IMMUTABLE)

```typescript
type GradeLevel = "1" | "2" | "3"; // First, Second, Third Secondary
```

- Students select grade at registration - **CANNOT BE CHANGED** without admin approval
- ALL content (lectures, quizzes, exercises) is grade-specific
- Students ONLY see content for their enrolled grade
- Grade change requires formal request and admin review

### 2. Authentication System

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  gradeLevel: GradeLevel; // IMMUTABLE
  role: "student" | "teacher" | "admin";
  subscriptionStatus: "active" | "expired" | "trial" | "cancelled" | "none";
  subscriptionPlan?: "monthly" | "semester" | "yearly";
}
```

### 3. Subscription Model

- Content access requires active subscription
- Plans: Monthly, Semester, Yearly
- Features vary by plan
- Auto-renewal support

---

## Gamification System

### XP Actions

```typescript
const XP_ACTIONS = {
  LESSON_COMPLETED: 100,
  QUIZ_COMPLETED: 150,
  QUIZ_PERFECT_SCORE: 200,
  DAILY_LOGIN: 25,
  STREAK_MAINTAINED: 50,
  NOTE_TAKEN: 10,
  ACHIEVEMENT_UNLOCKED: 300,
  FIRST_LESSON: 200,
  WEEK_STREAK: 500,
  MONTH_STREAK: 2000,
};
```

### Level System

- Base XP: 1000 per level
- Multiplier: 1.5x progressive
- Max Level: 100
- Level titles in Arabic

### Energy System

- Max Energy: 5
- Regeneration: 30 minutes per energy
- Costs: Lesson (1), Quiz (1), Challenge (2)

---

## Content Types

### Lectures

```typescript
interface Lecture {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  gradeLevel: GradeLevel;
  scheduledDate: Date;
  status: "upcoming" | "current" | "past" | "locked";
  totalLessons: number;
  requiresPreviousQuiz: boolean;
}
```

### Lessons

```typescript
interface Lesson {
  id: string;
  lectureId: string;
  title: string;
  type: "video" | "reading" | "interactive" | "practice";
  videoUrl?: string;
  videoDuration?: number;
  isRequired: boolean;
  unlockAfter?: string;
}
```

### Quizzes

```typescript
interface Quiz {
  id: string;
  title: string;
  type: "pre-lecture" | "post-lecture" | "practice";
  gradeLevel: GradeLevel;
  timeLimit?: number;
  passingScore: number;
  maxAttempts?: number;
  shuffleQuestions: boolean;
}
```

---

## UI Components Library

### Base Components (shadcn/ui)

- Button, Card, Input, Label
- Dialog, Sheet, Dropdown
- Tabs, Accordion, Avatar
- Form, Checkbox, Radio
- Toast, Alert, Badge
- Progress, Skeleton, Spinner

### Custom Components

- **Gamification:** XPDisplay, StreakDisplay, AchievementCard, LevelBadge, ProgressRing
- **Video:** VideoPlayer, InteractiveVideoPlayer
- **Quiz:** QuizEngine, QuizCard
- **Layout:** Navigation, BottomNav, Footer
- **Animations:** ScrollReveal, FadeContent, GradientText, ShinyText

### Animation Components

- `animated-content.tsx` - Entrance animations
- `scroll-reveal.tsx` - Scroll-triggered
- `gradient-text.tsx` - Animated gradients
- `count-up.tsx` - Number animations
- `spotlight-card.tsx` - Hover effects

---

## Design System

### Color Palette (Gen Z-inspired)

```css
/* Primary - Electric Purple */
--primary-500: 139 92 246;

/* Secondary - Neon Pink */
--secondary-500: 217 70 239;

/* Accent - Electric Blue */
--accent-500: 14 165 233;

/* Gamification */
--xp: 34 197 94; /* Neon Green */
--streak: 251 146 60; /* Electric Orange */
--reward: 168 85 247; /* Purple */
```

### Typography

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui'],
  arabic: ['var(--font-noto-sans-arabic)', 'system-ui'],
  display: ['var(--font-cairo)', 'system-ui'],
}
```

### Dark Mode

- System preference detection
- Manual toggle
- Persistent preference
- Gen Z dark-first design

---

## API Routes

### Authentication

| Route                       | Method | Description            |
| --------------------------- | ------ | ---------------------- |
| `/api/auth/login`           | POST   | User login             |
| `/api/auth/register`        | POST   | User registration      |
| `/api/auth/logout`          | POST   | User logout            |
| `/api/auth/forgot-password` | POST   | Password reset request |

### Health & Performance

| Route                      | Method | Description         |
| -------------------------- | ------ | ------------------- |
| `/api/health`              | GET    | Health check        |
| `/api/performance/metrics` | GET    | Performance metrics |
| `/api/performance/alerts`  | GET    | Performance alerts  |

---

## Page Routes

### Public Routes

- `/ar` - Homepage
- `/ar/login` - Login
- `/ar/register` - Registration
- `/ar/signup` - Alternative signup
- `/ar/forgot-password` - Password recovery
- `/ar/about` - About page
- `/ar/contact` - Contact
- `/ar/privacy` - Privacy policy
- `/ar/terms` - Terms of service

### Protected Routes (Require Auth)

- `/ar/dashboard` - Student dashboard
- `/ar/profile` - User profile
- `/ar/settings` - User settings
- `/ar/lectures` - All lectures
- `/ar/lectures/[id]` - Lecture detail
- `/ar/lessons/[id]` - Lesson player
- `/ar/quizzes` - All quizzes
- `/ar/quizzes/[id]` - Quiz attempt
- `/ar/exercises` - Exercises
- `/ar/homework` - Homework
- `/ar/achievements` - Achievements
- `/ar/leaderboard` - Leaderboard
- `/ar/quests` - Daily quests

### E-commerce Routes

- `/ar/packages` - Subscription packages
- `/ar/books` - Book store
- `/ar/shop` - Shop
- `/ar/cart` - Shopping cart
- `/ar/checkout` - Checkout

---

## Context Providers

The app uses multiple React Context providers wrapped in the layout:

```tsx
<ThemeProvider>
  <AuthProvider>
    <GamificationProvider>
      <SpacedRepetitionProvider>
        <StoreProvider>
          <SearchProvider>
            <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>
          </SearchProvider>
        </StoreProvider>
      </SpacedRepetitionProvider>
    </GamificationProvider>
  </AuthProvider>
</ThemeProvider>
```

---

## Custom Hooks

| Hook                   | Purpose                          |
| ---------------------- | -------------------------------- |
| `useAuth`              | Authentication state and actions |
| `useLessons`           | Lesson data and progress         |
| `useAccessControl`     | Permission checking              |
| `useKeyboardShortcuts` | Keyboard navigation              |
| `useSwipeNavigation`   | Mobile swipe gestures            |
| `useOfflineVideo`      | Offline video support            |
| `useOnlineStatus`      | Network status detection         |
| `useHapticFeedback`    | Mobile haptics                   |
| `useOptimisticUpdate`  | Optimistic UI updates            |
| `useUndo`              | Undo/redo functionality          |
| `useToast`             | Toast notifications              |

---

## Security Features

### Auth Security

- JWT token management
- HTTP-only cookies
- Token refresh mechanism
- Rate limiting

### Security Headers (Middleware)

```typescript
response.headers.set("X-Frame-Options", "SAMEORIGIN");
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-XSS-Protection", "1; mode=block");
```

### HTTPS Enforcement

- Automatic redirect to HTTPS in production

---

## Accessibility (WCAG 2.2 AA)

- Arabic screen reader support
- Full keyboard navigation
- Skip navigation links
- Focus management
- High contrast mode support
- ARIA labels throughout
- Focus trap for modals

---

## Performance Optimizations

- Turbopack for fast development
- Bundle analyzer
- Lazy loading components
- Image optimization
- Web Vitals monitoring
- Performance alerts
- Lighthouse CI integration

---

## Testing Strategy

### Unit Tests (Vitest)

```bash
npm run test:unit
```

### Component Tests

```bash
npm run test:components
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Accessibility Tests

```bash
npm run test:accessibility
```

### Visual Regression

```bash
npm run test:visual
```

---

## Development Commands

```bash
# Development
npm run dev              # Start with Turbopack
npm run dev:stable       # Start without Turbopack

# Build
npm run build            # Production build
npm run build:analyze    # Build with bundle analyzer

# Testing
npm run test             # Run all tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check
npm run quality:check    # Full quality check
```

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=

# Optional
ANALYZE=true             # Enable bundle analyzer
NEXT_PUBLIC_DEBUG=true   # Enable debug mode
```

---

## Key Files Reference

| File                                   | Purpose                              |
| -------------------------------------- | ------------------------------------ |
| `src/app/ar/layout.tsx`                | Main Arabic layout with providers    |
| `src/middleware.ts`                    | Route protection, redirects, headers |
| `src/contexts/AuthContext.tsx`         | Authentication state                 |
| `src/contexts/GamificationContext.tsx` | XP, levels, achievements             |
| `src/lib/gamification.ts`              | Gamification logic                   |
| `src/lib/i18n/config.ts`               | i18n configuration                   |
| `src/types/*.ts`                       | TypeScript type definitions          |
| `tailwind.config.ts`                   | Tailwind + RTL utilities             |
| `src/app/globals.css`                  | Design tokens, themes                |

---

## Zustand Store Patterns

### Auth Store (`src/lib/store/auth-store.ts`)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await mockLogin(email, password);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
          tokenManager.setTokens(response.accessToken, response.refreshToken);
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      // ... other actions
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**Key Patterns:**

- Uses `persist` middleware for localStorage persistence
- `partialize` to only persist specific fields (not loading/error states)
- Token management via separate `tokenManager` utility
- All async actions handle loading and error states

---

## Form Validation (Zod Schemas)

### Auth Schemas (`src/lib/validation/auth-schemas.ts`)

All validation schemas use **Arabic error messages**:

```typescript
import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

// Register Schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "الاسم مطلوب")
      .min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صالح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
      .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
    confirmPassword: z.string(),
    gradeLevel: z.enum(["1", "2", "3"], {
      errorMap: () => ({ message: "يرجى اختيار الصف الدراسي" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// OTP Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^[0-9]+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

// Password Requirements
export const passwordRequirements = [
  { regex: /.{8,}/, message: "8 أحرف على الأقل" },
  { regex: /[A-Z]/, message: "حرف كبير واحد على الأقل" },
  { regex: /[a-z]/, message: "حرف صغير واحد على الأقل" },
  { regex: /[0-9]/, message: "رقم واحد على الأقل" },
];
```

**Phone Validation:** Egyptian format - 11 digits starting with 01 (010, 011, 012, 015)

---

## Mock API Structure (MSW)

### Mock Handlers (`src/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from "msw";

// Mock User Data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "01012345678",
  gradeLevel: "2" as const,
  avatar: "/avatars/default.png",
  subscription: {
    status: "active",
    plan: "premium",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  stats: {
    totalXp: 2500,
    level: 5,
    streak: 7,
    lessonsCompleted: 45,
    quizzesCompleted: 23,
  },
};

// Mock Lessons
const mockLessons = [
  {
    id: "1",
    title: "مقدمة في النحو العربي",
    description: "تعلم أساسيات النحو العربي",
    duration: 45,
    gradeLevel: "2",
    weekNumber: 1,
    order: 1,
    videoUrl: "/videos/lesson-1.mp4",
    isCompleted: true,
    progress: 100,
  },
  // ... more lessons
];

// API Handlers
export const handlers = [
  // Auth
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    if (email === "test@test.com" && password === "Password123") {
      return HttpResponse.json({
        user: mockUser,
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      });
    }
    return HttpResponse.json(
      { error: "بيانات الدخول غير صحيحة" },
      { status: 401 }
    );
  }),

  // Lessons
  http.get("/api/lessons", ({ request }) => {
    const url = new URL(request.url);
    const gradeLevel = url.searchParams.get("gradeLevel");
    const filtered = mockLessons.filter((l) => l.gradeLevel === gradeLevel);
    return HttpResponse.json({ lessons: filtered });
  }),

  // Quiz Submission
  http.post("/api/quizzes/:id/submit", async ({ request, params }) => {
    const { answers } = await request.json();
    const quiz = mockQuizzes.find((q) => q.id === params.id);

    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correctCount++;
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const xpEarned = Math.floor((score * quiz.xpReward) / 100);

    return HttpResponse.json({
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      xpEarned,
      passed: score >= 70,
    });
  }),

  // Leaderboard
  http.get("/api/leaderboard", () => {
    return HttpResponse.json({
      leaderboard: [
        { rank: 1, name: "محمد أحمد", xp: 5000, avatar: "/avatars/1.png" },
        { rank: 2, name: "سارة علي", xp: 4800, avatar: "/avatars/2.png" },
        // ... more entries
      ],
    });
  }),
];
```

---

## Achievement System

### Achievement Types (`src/types/gamification.ts`)

```typescript
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  requirement: {
    type: "lessons" | "quizzes" | "streak" | "xp" | "perfect_score" | "time";
    value: number;
  };
  unlockedAt?: Date;
  progress?: number;
}

// Rarity Colors
export const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-300",
};
```

### Predefined Achievements

| ID              | Name (Arabic)  | Rarity    | Requirement             | XP Reward |
| --------------- | -------------- | --------- | ----------------------- | --------- |
| `first_lesson`  | الدرس الأول    | common    | Complete 1 lesson       | 50        |
| `lesson_master` | سيد الدروس     | rare      | Complete 10 lessons     | 200       |
| `quiz_champion` | بطل الاختبارات | rare      | Complete 20 quizzes     | 300       |
| `perfect_score` | الدرجة الكاملة | epic      | Get 100% on quiz        | 150       |
| `streak_7`      | أسبوع متواصل   | rare      | 7-day streak            | 250       |
| `streak_30`     | شهر من التفوق  | epic      | 30-day streak           | 1000      |
| `xp_1000`       | جامع النقاط    | common    | Earn 1000 XP            | 100       |
| `xp_10000`      | أسطورة النقاط  | legendary | Earn 10000 XP           | 500       |
| `early_bird`    | الطائر المبكر  | rare      | Study before 7 AM       | 100       |
| `night_owl`     | بومة الليل     | rare      | Study after 10 PM       | 100       |
| `speed_demon`   | سريع البرق     | epic      | Complete quiz in <2 min | 200       |

---

## Level Progression System

### Level Definitions (`src/types/gamification.ts`)

```typescript
export interface Level {
  level: number;
  name: string;
  nameAr: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
  benefits: string[];
}

export const LEVELS: Level[] = [
  {
    level: 1,
    name: "Beginner",
    nameAr: "مبتدئ",
    minXp: 0,
    maxXp: 100,
    icon: "🌱",
    color: "green",
  },
  {
    level: 2,
    name: "Learner",
    nameAr: "متعلم",
    minXp: 100,
    maxXp: 300,
    icon: "📚",
    color: "blue",
  },
  {
    level: 3,
    name: "Student",
    nameAr: "طالب",
    minXp: 300,
    maxXp: 600,
    icon: "🎓",
    color: "indigo",
  },
  {
    level: 4,
    name: "Scholar",
    nameAr: "دارس",
    minXp: 600,
    maxXp: 1000,
    icon: "📖",
    color: "purple",
  },
  {
    level: 5,
    name: "Expert",
    nameAr: "خبير",
    minXp: 1000,
    maxXp: 2000,
    icon: "⭐",
    color: "yellow",
  },
  {
    level: 6,
    name: "Master",
    nameAr: "متقن",
    minXp: 2000,
    maxXp: 4000,
    icon: "🏆",
    color: "orange",
  },
  {
    level: 7,
    name: "Champion",
    nameAr: "بطل",
    minXp: 4000,
    maxXp: 10000,
    icon: "👑",
    color: "red",
  },
  {
    level: 8,
    name: "Legend",
    nameAr: "أسطورة",
    minXp: 10000,
    maxXp: Infinity,
    icon: "🌟",
    color: "gold",
  },
];

// Helper Functions
export function calculateLevel(xp: number): Level {
  return (
    LEVELS.find((l) => xp >= l.minXp && xp < l.maxXp) ||
    LEVELS[LEVELS.length - 1]
  );
}

export function calculateXpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  return currentLevel.maxXp - xp;
}

export function calculateLevelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const levelXp = xp - currentLevel.minXp;
  const levelRange = currentLevel.maxXp - currentLevel.minXp;
  return (levelXp / levelRange) * 100;
}
```

---

## XP Rewards System

### XP Constants (`src/types/gamification.ts`)

```typescript
export const XP_REWARDS = {
  // Lessons
  LESSON_COMPLETE: 50,
  LESSON_FIRST_TIME: 25, // Bonus for first completion

  // Quizzes
  QUIZ_COMPLETE: 30,
  QUIZ_PERFECT: 100, // 100% score bonus
  QUIZ_PASS: 20, // 70%+ score bonus

  // Exercises
  EXERCISE_COMPLETE: 40,
  EXERCISE_PERFECT: 75,

  // Homework
  HOMEWORK_SUBMIT: 60,
  HOMEWORK_ON_TIME: 20, // Submitted before deadline

  // Streaks
  STREAK_DAILY: 10,
  STREAK_WEEKLY: 50, // 7-day streak bonus
  STREAK_MONTHLY: 200, // 30-day streak bonus

  // Daily Activities
  DAILY_LOGIN: 5,
  DAILY_QUESTION: 15,

  // Social
  HELP_CLASSMATE: 25,
  SHARE_ACHIEVEMENT: 10,

  // Special
  FIRST_OF_DAY: 15, // First activity of the day
  COMEBACK: 30, // Return after 3+ days absence
};

// Streak Bonus Multiplier
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return 2.0; // 100% bonus
  if (streakDays >= 14) return 1.5; // 50% bonus
  if (streakDays >= 7) return 1.25; // 25% bonus
  if (streakDays >= 3) return 1.1; // 10% bonus
  return 1.0;
}
```

---

## Energy Regeneration System

### Energy Configuration (`src/contexts/GamificationContext.tsx`)

```typescript
export const ENERGY_CONFIG = {
  MAX_ENERGY: 5,
  REGEN_TIME: 30 * 60 * 1000, // 30 minutes per energy point
  QUIZ_COST: 1,
  EXERCISE_COST: 1,
  LESSON_COST: 0, // Lessons are free
};

interface EnergyState {
  current: number;
  max: number;
  lastRegenTime: Date;
  nextRegenTime: Date;
}

// Energy regeneration logic
function calculateEnergy(lastRegenTime: Date): number {
  const now = new Date();
  const elapsed = now.getTime() - lastRegenTime.getTime();
  const regenPoints = Math.floor(elapsed / ENERGY_CONFIG.REGEN_TIME);
  return Math.min(ENERGY_CONFIG.MAX_ENERGY, regenPoints);
}
```

---

## Quest System

### Quest Types (`src/lib/quests.ts`)

```typescript
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "learning_path" | "group" | "competition";
  category:
    | "lessons"
    | "quizzes"
    | "study_time"
    | "social"
    | "achievement"
    | "special";
  difficulty: "easy" | "medium" | "hard" | "expert";
  icon: string;

  // Progress
  currentProgress: number;
  targetProgress: number;
  progressUnit: string;

  // Rewards
  xpReward: number;
  bonusRewards?: string[];

  // Time
  expiresAt?: Date;

  // Status
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;

  // Group quests
  isGroupQuest?: boolean;
  groupProgress?: number;
  participantCount?: number;

  // Learning paths
  prerequisiteQuests?: string[];
  nextQuests?: string[];
}

// Difficulty Multipliers
export const QUEST_DIFFICULTY = {
  easy: { multiplier: 1, label: "سهل", icon: "🟢" },
  medium: { multiplier: 1.5, label: "متوسط", icon: "🟡" },
  hard: { multiplier: 2, label: "صعب", icon: "🟠" },
  expert: { multiplier: 3, label: "خبير", icon: "🔴" },
};
```

### Sample Quests

| Type          | Title                 | Target             | XP   | Difficulty |
| ------------- | --------------------- | ------------------ | ---- | ---------- |
| daily         | الدرس اليومي          | 1 lesson           | 100  | easy       |
| daily         | تحدي الاختبار         | 80%+ on quiz       | 150  | medium     |
| daily         | ساعة الدراسة          | 60 min study       | 120  | medium     |
| weekly        | أسبوع من التفوق       | 7-day streak       | 500  | hard       |
| weekly        | الدرجات المثالية      | 5 perfect quizzes  | 800  | expert     |
| learning_path | أساسيات النحو         | 10 grammar lessons | 1000 | medium     |
| group         | تحدي الفصل            | 100 class lessons  | 300  | medium     |
| competition   | ماراثون نهاية الأسبوع | 2000 points        | 2000 | expert     |

---

## Spaced Repetition System

### SM-2 Algorithm (`src/lib/spacedRepetition.ts`)

```typescript
export interface ReviewItem {
  id: string;
  contentId: string;
  contentType: "vocabulary" | "grammar" | "concept" | "verse" | "exercise";
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;

  // SM-2 Parameters
  easeFactor: number; // Starting at 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Successful review count
  nextReviewDate: Date;

  // Performance
  totalReviews: number;
  correctReviews: number;
  streakCount: number;

  // Arabic subjects
  subject: "نحو" | "بلاغة" | "أدب" | "نصوص" | "قراءة" | "تعبير";
}

// SM-2 Configuration
export const SM2_CONFIG = {
  INITIAL_EASE_FACTOR: 2.5,
  MINIMUM_EASE_FACTOR: 1.3,
  MINIMUM_INTERVAL: 1,
  MAXIMUM_INTERVAL: 365,
  QUALITY_THRESHOLD: 3, // Minimum for successful review
};

// Difficulty-based intervals (days)
export const DIFFICULTY_INTERVALS = {
  1: { first: 1, second: 3 }, // Very easy
  2: { first: 1, second: 4 }, // Easy
  3: { first: 1, second: 6 }, // Medium
  4: { first: 2, second: 8 }, // Hard
  5: { first: 3, second: 10 }, // Very hard
};

// Arabic-specific learning multipliers
export const ARABIC_LEARNING_PATTERNS = {
  vocabulary: { baseMultiplier: 1.0 },
  grammar: { baseMultiplier: 1.2 }, // Needs more repetition
  concept: { baseMultiplier: 1.1 },
  verse: { baseMultiplier: 0.9 }, // Poetry easier to remember
  exercise: { baseMultiplier: 1.3 }, // Practical needs more practice
};
```

---

## Adaptive Learning System

### Learning Profile (`src/lib/adaptiveLearning.ts`)

```typescript
export interface LearningProfile {
  userId: string;

  // Preferences
  preferredDifficulty: 1 | 2 | 3 | 4 | 5;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed";
  studyPace: "slow" | "moderate" | "fast";
  sessionLength: "short" | "medium" | "long";

  // Performance
  overallAccuracy: number;
  subjectAccuracies: { [subject: string]: number };
  consistencyScore: number;

  // Learning patterns
  strongAreas: string[];
  weakAreas: string[];
  learningVelocity: number;
  retentionRate: number;

  // Behavioral
  preferredStudyTimes: number[]; // Hours 0-23
  sessionFrequency: number; // Per week
  motivationLevel: "low" | "medium" | "high";
  engagementScore: number;
}

export interface LearningRecommendation {
  id: string;
  type: "content" | "study_method" | "schedule" | "difficulty" | "focus_area";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1

  // Suggestions
  suggestedDifficulty?: 1 | 2 | 3 | 4 | 5;
  suggestedDuration?: number;
  suggestedFrequency?: number;
}
```

### Recommendation Types

1. **Weak Area Focus** - Prioritize subjects with <70% accuracy
2. **Difficulty Adjustment** - Increase if >90%, decrease if <60%
3. **Schedule Optimization** - Suggest more frequent sessions
4. **Learning Style** - Recommend content matching learning style
5. **Retention Improvement** - Suggest spaced repetition techniques
6. **Motivation Boost** - Short-term goals for low motivation

---

## Exercise System

### Exercise Types (`src/types/exercise.ts`)

```typescript
export type ExerciseType = "post-lecture" | "practice" | "review";
export type ExerciseStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "completed";

export type ExerciseQuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "essay"
  | "fill-blank"
  | "matching"
  | "ordering";

export interface Exercise {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  type: ExerciseType;
  gradeLevel: GradeLevel; // CRITICAL: Grade-specific

  // Configuration
  timeLimit?: number;
  passingScore: number;
  maxAttempts?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;

  // Questions
  questions: ExerciseQuestion[];
  totalPoints: number;
}

export interface ExerciseResult {
  score: number;
  pointsEarned: number;
  passed: boolean;
  correctCount: number;
  incorrectCount: number;
  totalTimeSpent: number;
  canRetry: boolean;
  attemptsRemaining?: number;
  unlockedContent?: string[];
}
```

---

## Homework System

### Homework Types (`src/types/homework.ts`)

```typescript
export type HomeworkStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "submitted"
  | "graded"
  | "late";

export type HomeworkQuestionType =
  | "essay"
  | "short-answer"
  | "file-upload"
  | "multiple-files"
  | "code"
  | "creative-writing";

export interface Homework {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  instructions: string; // Markdown
  gradeLevel: GradeLevel;

  // Deadline
  deadline: Date;
  allowLateSubmission: boolean;
  lateSubmissionDeadline?: Date;
  latePenalty?: number; // Percentage deduction

  // Questions
  questions: HomeworkQuestion[];
  totalPoints: number;

  // Submission
  allowMultipleSubmissions: boolean;
  maxSubmissions?: number;

  // File settings
  allowedFileTypes?: string[];
  maxFileSize?: number; // MB
  maxFiles?: number;
}

export interface HomeworkRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  levels: {
    name: string; // "Excellent", "Good", "Fair", "Poor"
    description: string;
    points: number;
  }[];
}
```

---

## Quiz Engine

### Quiz Component (`src/components/quiz/quiz-engine.tsx`)

```typescript
interface Question {
  id: number;
  type: "multiple-choice" | "true-false" | "fill-blank";
  question: string;
  options?: string[];
  correct: number | boolean | string;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  questions_data: Question[];
  duration: number; // minutes
  xpReward: number;
}

// Quiz States
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<(number | boolean | string | null)[]>(
  []
);
const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
const [isStarted, setIsStarted] = useState(false);
const [isFinished, setIsFinished] = useState(false);
const [showExplanation, setShowExplanation] = useState(false);
const [score, setScore] = useState(0);
```

**Features:**

- Timer with auto-submit on expiry
- Question navigation (next/previous)
- Answer review with explanations
- Score calculation with XP rewards
- Progress indicator
- Animated transitions

---

## Hero Section Pattern

### Landing Page Hero (`src/components/sections/hero-section.tsx`)

```typescript
// Animated student counter
const [studentCount, setStudentCount] = useState(14500);

useEffect(() => {
  const targetCount = 15247;
  const duration = 2000;
  const steps = 60;
  const increment = (targetCount - 14500) / steps;

  const timer = setInterval(() => {
    // Animate count up
  }, duration / steps);

  return () => clearInterval(timer);
}, []);

// Content structure
const content = {
  badge: "🔥 الأستاذ رضا الفاروق - 31 عاماً من التميز",
  title: "تعلم مع أفضل أستاذ في مصر",
  subtitle: "انضم إلى آلاف الطلاب...",
  stats: [
    { number: studentCount, label: "طالب متفوق", icon: Users },
    { number: "31", label: "عام خبرة", icon: Award },
    { number: "98%", label: "معدل النجاح", icon: TrendingUp },
    { number: "500+", label: "درس تفاعلي", icon: Video },
  ],
  trustBadges: [
    { icon: Shield, text: "منصة معتمدة" },
    { icon: Star, text: "تقييم 4.9/5" },
    { icon: Award, text: "98% نجاح" },
  ],
};
```

---

## Token Management

### JWT Utilities (`src/lib/auth/token-manager.ts`)

```typescript
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;

    // Store in secure httpOnly cookie (server-side)
    // Or localStorage for client-side (less secure)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    const refresh = this.refreshToken || localStorage.getItem("refreshToken");
    if (!refresh) return null;

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      this.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }

    this.clearTokens();
    return null;
  }
}

export const tokenManager = new TokenManager();
```

---

## Daily Question System

### Daily Question Types (`src/types/gamification.ts`)

```typescript
export interface DailyQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  gradeLevel: GradeLevel;
}

export interface DailyQuestionAttempt {
  id: string;
  questionId: string;
  userId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  xpEarned: number;
  attemptedAt: Date;
  timeSpent: number; // seconds
}

// Daily question rewards
export const DAILY_QUESTION_REWARDS = {
  CORRECT: 15,
  STREAK_BONUS: 5, // Per consecutive day
  FIRST_TRY: 10, // Bonus for correct on first try
};
```

---

## Important Notes for AI Models

1. **Always use Arabic UI text** - All user-facing strings should be in Arabic
2. **RTL Layout** - Use `dir="rtl"` and RTL-aware CSS utilities
3. **Grade Isolation** - Never show content from other grades
4. **Subscription Check** - Always verify subscription before content access
5. **Type Safety** - Use TypeScript types from `/src/types/`
6. **Component Patterns** - Follow existing shadcn/ui patterns
7. **Animation Consistency** - Use Framer Motion for animations
8. **Accessibility** - Include ARIA labels and keyboard support
9. **Mobile First** - Design for mobile, enhance for desktop
10. **Error Handling** - Use ErrorBoundary components
11. **Zod Validation** - Use Arabic error messages in all schemas
12. **Zustand Patterns** - Use persist middleware for auth state
13. **MSW Mocking** - Follow existing mock handler patterns
14. **XP System** - Apply streak bonuses and level calculations
15. **Energy System** - Check energy before quiz/exercise access

---

## Code Style Guidelines

### TypeScript Conventions

```typescript
// Use explicit types
const user: User = { ... };

// Use type guards
function isSubscribed(user: User): user is SubscribedUser {
  return user.subscription?.status === 'active';
}

// Use const assertions for literals
const GRADES = ['1', '2', '3'] as const;
type GradeLevel = typeof GRADES[number];

// Use discriminated unions
type ContentStatus =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Content };
```

### Component Patterns

```typescript
// Use forwardRef for reusable components
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

// Use compound components
<Card>
  <CardHeader>
    <CardTitle>عنوان</CardTitle>
    <CardDescription>وصف</CardDescription>
  </CardHeader>
  <CardContent>محتوى</CardContent>
</Card>
```

### Arabic Text Handling

```typescript
// Always use Arabic for user-facing text
const messages = {
  success: 'تم بنجاح',
  error: 'حدث خطأ',
  loading: 'جاري التحميل...',
};

// Use Arabic numerals when appropriate
const arabicNumber = number.toLocaleString('ar-EG');

// RTL-aware spacing
<div className="mr-4 rtl:ml-4 rtl:mr-0">
```

---

## UI Consistency & Accessibility Fixes (December 2024)

### Overview

A comprehensive UI audit was conducted using Playwright on mobile viewport (375×667). All interactive elements were verified for WCAG 2.2 AA compliance, with focus on touch target sizes (minimum 44×44px).

### Pages Verified - All Passing (0 Issues)

**Total: 26 pages audited, 1,162+ elements checked, 0 issues found**

| #   | Page           | URL                 | Elements Checked | Status |
| --- | -------------- | ------------------- | ---------------- | ------ |
| 1   | Home           | `/ar`               | 45               | ✅     |
| 2   | Contact        | `/ar/contact`       | 43               | ✅     |
| 3   | Login          | `/ar/login`         | 46               | ✅     |
| 4   | Signup         | `/ar/signup`        | 50               | ✅     |
| 5   | About          | `/ar/about`         | 36               | ✅     |
| 6   | Courses        | `/ar/courses`       | 52               | ✅     |
| 7   | Leaderboard    | `/ar/leaderboard`   | 47               | ✅     |
| 8   | Cart           | `/ar/cart`          | 38               | ✅     |
| 9   | Books          | `/ar/books`         | 46               | ✅     |
| 10  | Privacy        | `/ar/privacy`       | 36               | ✅     |
| 11  | Terms          | `/ar/terms`         | 36               | ✅     |
| 12  | Help           | `/ar/help`          | 55               | ✅     |
| 13  | Dashboard      | `/ar/dashboard`     | 53               | ✅     |
| 14  | Profile        | `/ar/profile`       | 39               | ✅     |
| 15  | Settings       | `/ar/settings`      | 48               | ✅     |
| 16  | Quizzes        | `/ar/quizzes`       | 56               | ✅     |
| 17  | Lessons        | `/ar/lessons`       | 68               | ✅     |
| 18  | Lesson Detail  | `/ar/lessons/1`     | 51               | ✅     |
| 19  | Lectures       | `/ar/lectures`      | 54               | ✅     |
| 20  | Lecture Detail | `/ar/lectures/1`    | 54               | ✅     |
| 21  | Checkout       | `/ar/checkout`      | 38               | ✅     |
| 22  | Exercises      | `/ar/exercises/1`   | 37               | ✅     |
| 23  | Homework       | `/ar/homework/1`    | 41               | ✅     |
| 24  | Auth Login     | `/ar/auth/login`    | 43               | ✅     |
| 25  | Auth Register  | `/ar/auth/register` | 54               | ✅     |
| 26  | 404 Page       | (any invalid URL)   | 6                | ✅     |

### Additional Audits Performed

#### Font Size Audit

- **Result:** 0 elements with font-size < 12px
- All text meets WCAG minimum font size requirements

#### Button Styling Consistency

The buttons follow a clear design system:

- **44px height**: Icon buttons (theme toggle, menu toggle) - `border-radius: 8px`
- **48px height**: Secondary/medium buttons - `border-radius: 16px` or `rounded-full`
- **56px height**: Primary/large CTA buttons - `border-radius: 16px`

#### Heading Hierarchy

- **H1**: 24px, font-weight: 700 (consistent)
- **H2**: 24px, font-weight: 700 (consistent)
- **H3**: 24px for section titles, 18px for card titles (intentional variation)
- **H4**: 18px, font-weight: 700 (consistent)

#### Horizontal Overflow

- Properly contained with `overflow-x: hidden` on HTML and body elements
- No horizontal scrolling issues on mobile viewport

---

### Fix 1: Checkbox Touch Target

**File:** `src/components/ui/checkbox.tsx`

**Issue:** Checkbox had only 20px width, failing WCAG touch target requirements.

**Solution:** Use inline styles instead of Tailwind arbitrary values (which weren't being applied correctly in Tailwind 4).

```typescript
// Before - Tailwind arbitrary values not working
className="min-w-[44px] min-h-[44px]"

// After - Inline styles work correctly
style={{ minWidth: "44px", minHeight: "44px" }}
```

**Current Implementation:**

```typescript
<CheckboxPrimitive.Root
  ref={ref}
  className={cn(
    "peer relative flex items-center justify-center shrink-0",
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  style={{ minWidth: "44px", minHeight: "44px" }}
  {...props}
>
  {/* Visual checkbox indicator - 20px visual, 44px touch target */}
  <span
    className={cn(
      "h-5 w-5 rounded-sm border border-primary",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    )}
    data-state={props.checked ? "checked" : "unchecked"}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current h-full w-full")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </span>
</CheckboxPrimitive.Root>
```

---

### Fix 2: Link+Button Touch Target Pattern

**Issue:** `<Link>` elements wrapping `<Button>` components had collapsed touch target heights (as low as 19px) because Link renders as `display: inline` by default, collapsing to text line-height.

**Solution:** Add block display and minimum height to Link, plus full height to Button.

```typescript
// Before - Link has collapsed height
<Link href="/ar/lessons/1">
  <Button>ابدأ الدرس</Button>
</Link>

// After - Link has proper touch target
<Link
  href="/ar/lessons/1"
  className="block w-full"
  style={{ minHeight: "44px" }}
>
  <Button className="h-full">ابدأ الدرس</Button>
</Link>
```

**Files Fixed:**

- `src/app/ar/lessons/[id]/page.tsx` - 4 instances
- `src/app/ar/auth/forgot-password/page.tsx` - 4 instances
- `src/app/ar/books/page.tsx` - 1 instance
- `src/app/ar/checkout/checkout-client.tsx` - 3 instances
- `src/app/ar/subscription/page.tsx` - 1 instance
- `src/app/ar/homework/[id]/page.tsx` - 3 instances
- `src/app/ar/exercises/[id]/page.tsx` - 4 instances
- `src/app/ar/forgot-password/page.tsx` - 2 instances

---

### Fix 3: Button Component Enhancements

**File:** `src/components/ui/button.tsx`

**Additions:**

1. New `rounded` variant with options: `default`, `lg`, `xl`, `2xl`, `full`
2. Font weight standardized to `font-semibold`
3. Transition timing standardized to `transition-all duration-200`

**Size Definitions:**

| Size      | Height (Mobile)  | Height (Desktop) |
| --------- | ---------------- | ---------------- |
| `default` | h-11 (44px)      | h-11 (44px)      |
| `sm`      | h-11 (44px)      | h-9 (36px)       |
| `lg`      | h-12 (48px)      | h-11 (44px)      |
| `xl`      | h-14 (56px)      | h-12 (48px)      |
| `icon`    | h-11 w-11 (44px) | h-10 w-10 (40px) |

**Rounded Variants:**

| Variant   | Class        |
| --------- | ------------ |
| `default` | rounded-md   |
| `lg`      | rounded-lg   |
| `xl`      | rounded-xl   |
| `2xl`     | rounded-2xl  |
| `full`    | rounded-full |

---

### Fix 4: Progress Component Size Variants

**File:** `src/components/ui/progress.tsx`

**Addition:** Size variant support using class-variance-authority (cva).

```typescript
const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1.5",
      default: "h-2.5",
      md: "h-3",
      lg: "h-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
```

---

### Fix 5: Accessibility Labels

**Files Modified:**

- `src/app/ar/lessons/[id]/page.tsx` - Video player controls
- `src/components/ui/notification-badge.tsx`
- `src/components/ui/notification-center.tsx`
- `src/components/ui/bubble-menu.tsx`

**Labels Added:**

- Play/Pause: `aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}`
- Skip Back: `aria-label="رجوع 10 ثواني"`
- Skip Forward: `aria-label="تقديم 10 ثواني"`
- Mute: `aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}`
- Volume: `aria-label="مستوى الصوت"`
- Settings: `aria-label="الإعدادات"` with `aria-expanded`
- Fullscreen: `aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}`

---

### Fix 6: Theme Toggle & Menu Toggle

**Files Modified:**

- `src/components/ui/theme-toggle.tsx`
- `src/components/layout/navigation.tsx`

**Issue:** Icon-only buttons had 40px dimensions.

**Solution:** Applied 44×44px minimum size for WCAG compliance.

```typescript
// Theme Toggle
<Button
  variant="ghost"
  size="icon"
  className="h-11 w-11 min-w-[44px] min-h-[44px]"
>

// Menu Toggle
<Button
  variant="ghost"
  size="icon"
  className="h-11 w-11 min-w-[44px] min-h-[44px]"
>
```

---

### Fix 7: WCAG Minimum Font Size

**File:** `src/app/globals.css`

**Issue:** Base font size was 14px (below WCAG recommended 16px minimum).

**Solution:** Set HTML root font-size to 16px.

```css
html {
  font-size: 16px;
}
```

---

### Fix 8: Badge Component Size Variants

**File:** `src/components/ui/badge.tsx`

**Addition:** Size variants for consistent badge sizing.

```typescript
const badgeVariants = cva("...", {
  variants: {
    size: {
      sm: "text-xs px-2 py-0.5",
      default: "text-sm px-2.5 py-0.5",
      lg: "text-base px-3 py-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
```

---

### Fix 9: Login/Signup Inline Links

**Files Modified:**

- `src/app/ar/login/login-client.tsx`
- `src/app/ar/signup/signup-client.tsx`

**Issue:** Inline links within text paragraphs had small touch targets.

**Solution:** Wrapped links in block-level elements with minimum touch target.

```typescript
// Before
<p>ليس لديك حساب؟ <Link href="/ar/signup">إنشاء حساب</Link></p>

// After
<p>ليس لديك حساب؟</p>
<Link href="/ar/signup" className="block" style={{ minHeight: "44px" }}>
  <span className="text-primary hover:underline flex items-center h-full">
    إنشاء حساب
  </span>
</Link>
```

---

### Fix 10: Mobile Hero Section Overflow

**File:** `src/components/sections/hero-section.tsx`

**Issue:** Hero section caused horizontal overflow on mobile.

**Solution:** Added overflow-hidden and proper max-width constraints.

```typescript
<section className="relative overflow-hidden max-w-full">
  <div className="container mx-auto px-4 max-w-full overflow-hidden">
    {/* Decorative elements hidden on mobile */}
    <div className="hidden md:block absolute ...">
```

---

### Fix 11: Bottom Navigation Labels

**File:** `src/app/ar/layout.tsx` (BottomNavigation component)

**Issue:** Bottom nav labels were 10px font-size.

**Solution:** Increased to 12px for readability.

```typescript
// Before
<span className="text-[10px]">الرئيسية</span>

// After
<span className="text-xs">الرئيسية</span>
```

---

### Design System Standards

#### Button Heights (Intentional Variation)

- **44px**: Icon buttons (theme toggle, menu toggle)
- **48px**: Secondary/medium buttons
- **56px**: Primary/large CTA buttons

#### Heading Sizes

- **H1**: 24px (consistent)
- **H3 Main Content**: 20px (`text-xl`)
- **H3 Footer**: 16px (`text-base`) - intentionally smaller for secondary navigation
- **H4**: 18px (consistent)

#### Touch Target Requirements

- Minimum: 44×44px (WCAG 2.2 AA)
- Icon buttons: Use `min-w-[44px] min-h-[44px]` or inline styles
- Links wrapping buttons: Use `className="block"` and `style={{ minHeight: "44px" }}`

---

### Tailwind 4 Specific Issues

**Problem:** Tailwind 4's arbitrary value syntax `min-w-[44px]` may not apply correctly in some cases.

**Solution:** Use inline styles as fallback:

```typescript
// Tailwind arbitrary values (may fail)
className="min-w-[44px] min-h-[44px]"

// Inline styles (always work)
style={{ minWidth: "44px", minHeight: "44px" }}
```

---

### Turbopack Caching Issues

**Problem:** Turbopack aggressive caching may serve stale code after edits.

**Solution:** Add unique comments to force recompile:

```typescript
// Force recompile: v2
```

---

### Testing Touch Targets with Playwright

```typescript
// Evaluate touch target sizes
const result = await page.evaluate(() => {
  const buttons = document.querySelectorAll('button, a, [role="button"]');
  let smallTouchTargets = 0;
  const samples = [];

  buttons.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (style.display === "none" || rect.width === 0) return;
    if (rect.width < 44 || rect.height < 44) {
      smallTouchTargets++;
      samples.push({
        text: el.textContent?.trim().substring(0, 30),
        width: rect.width.toFixed(1) + "px",
        height: rect.height.toFixed(1) + "px",
        tagName: el.tagName,
      });
    }
  });

  return { smallTouchTargets, samples };
});
```

---

## Shop Page System (December 2024)

### Overview

The shop page (`/ar/shop`) allows users to purchase cosmetic items, boosts, and functional items using virtual currencies (coins and gems).

### Shop Page Structure

**Section Order (Education-focused):**

1. **Header** - Shop title and description
2. **Currency Display** - Shows coins, gems, XP, streak
3. **How to Earn Currency** - Educational info on earning coins/gems
4. **Daily Deals** - Time-limited special offers
5. **Featured Items** - Curated premium items
6. **All Items** - Full shop catalog (RewardsSystem component)

### Theme Configuration

The shop uses a unified dark theme:

```typescript
// Page background
className = "min-h-screen bg-[#1a1a2e]";

// Card backgrounds
className = "bg-[#252540]";

// All Items container
className = "bg-[#1e1e35]";

// Equipped item highlight
className =
  "border-amber-500 bg-gradient-to-br from-amber-900/30 to-orange-900/20 shadow-lg shadow-amber-500/20";

// Owned items
className = "border-green-500/50 bg-[#1e3a2f]";
```

### Currency Cards (Gradient Style)

```typescript
// Coins - Orange/Amber gradient
<div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4">

// Gems - Pink/Purple gradient
<div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl p-4">

// XP - Green/Emerald gradient
<div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4">

// Streak - Cyan/Blue gradient
<div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl p-4">
```

### Shop Item Types

```typescript
interface RewardItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "cosmetic" | "boost" | "functional";
  cost: { coins?: number; gems?: number };
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  equipped?: boolean; // For cosmetic items
}
```

### Available Shop Items

| ID              | Name (Arabic)    | Type       | Cost       | Rarity    |
| --------------- | ---------------- | ---------- | ---------- | --------- |
| `avatar-crown`  | تاج الملك        | cosmetic   | 1000 coins | epic      |
| `double-xp-1h`  | مضاعف الخبرة     | boost      | 75 gems    | rare      |
| `energy-refill` | إعادة ملء القلوب | functional | 30 gems    | common    |
| `streak-freeze` | تجميد السلسلة    | functional | 50 gems    | rare      |
| `rainbow-theme` | ثيم قوس قزح      | cosmetic   | 150 gems   | legendary |
| `hint-pack-5`   | لفافة الحكمة     | functional | 40 gems    | rare      |

### Item Activation System

**Cosmetic Items (Crown, Theme):**

- After purchase → shows "تفعيل" (Activate) button in purple
- Click to activate → button changes to "مُفعّل ✓" (Activated) in amber/gold
- Card gets amber border and glow effect with badge
- Only ONE cosmetic can be active at a time (clicking another deactivates current)

**Functional/Boost Items:**

- Shows "استخدام" (Use) button in green
- Click to use → shows celebration effect and applies the effect

```typescript
// Apply or equip item
const applyItem = (itemId: string) => {
  const item = rewardItems.find((i) => i.id === itemId);
  if (!item || !item.owned) return;

  // For cosmetic items, toggle equipped state
  if (item.type === "cosmetic") {
    setRewardItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return { ...i, equipped: !i.equipped };
        }
        // Unequip other cosmetics (only one at a time)
        if (i.type === "cosmetic" && i.id !== itemId) {
          return { ...i, equipped: false };
        }
        return i;
      })
    );
    // Show celebration...
  }

  // For functional items, apply effect
  switch (itemId) {
    case "energy-refill":
      setCurrency((prev) => ({ ...prev, hearts: prev.maxHearts }));
      break;
    // ... other cases
  }
};
```

### Button States for Items

```typescript
// Owned cosmetic - Not equipped
<Button className="bg-purple-600 hover:bg-purple-500 text-white">
  <Crown className="w-4 h-4 mr-2" />
  تفعيل
</Button>

// Owned cosmetic - Equipped
<Button className="bg-amber-500 hover:bg-amber-400 text-black">
  <Star className="w-4 h-4 mr-2 fill-current" />
  مُفعّل ✓
</Button>

// Owned functional/boost
<Button className="bg-green-600 hover:bg-green-500 text-white">
  <Zap className="w-4 h-4 mr-2" />
  استخدام
</Button>

// Not owned (Buy button)
<Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
  <ShoppingCart className="w-4 h-4 mr-2" />
  شراء
</Button>
```

### Equipped Item Visual Indicator

```typescript
// Card with equipped state
<div className={`border-2 rounded-2xl p-5 relative ${
  item.equipped
    ? "border-amber-500 bg-gradient-to-br from-amber-900/30 to-orange-900/20 shadow-lg shadow-amber-500/20"
    : item.owned
      ? "border-green-500/50 bg-[#1e3a2f]"
      : "border-gray-600/50 bg-[#252540]"
}`}>
  {/* Equipped Badge */}
  {item.equipped && (
    <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
      مُفعّل ✓
    </div>
  )}
  {/* ... item content */}
</div>
```

### API Routes for Gems

**GET `/api/gamification/gems`**

- Returns current gem balance, total earned, total spent

**POST `/api/gamification/gems?operation=earn`**

- Body: `{ action: string, metadata?: object }`
- Earns gems based on action type

**POST `/api/gamification/gems?operation=spend`**

- Body: `{ itemId: string, quantity?: number }`
- Spends gems on shop items

### Default Test Currency

For testing, the following default values are set:

- **Coins:** 5,000 (in `shop-client.tsx` and `RewardsSystem.tsx`)
- **Gems:** 500 (in `/api/gamification/gems/route.ts`)
- **Hearts:** 5/5

### Key Files

| File                                            | Purpose                         |
| ----------------------------------------------- | ------------------------------- |
| `src/app/ar/shop/shop-client.tsx`               | Main shop page component        |
| `src/components/gamification/RewardsSystem.tsx` | Shop variant with item grid     |
| `src/app/api/gamification/gems/route.ts`        | Gems API (balance, earn, spend) |
| `src/contexts/GamificationContext.tsx`          | Gamification state provider     |
| `src/types/gamification.ts`                     | Type definitions                |

---

## Signup Page Multi-Step Wizard (December 2024)

### Overview

The signup page (`/ar/signup`) uses a 4-step registration wizard with comprehensive data collection for Egyptian secondary school students.

### Step Configuration

| Step | Title                | Fields                                                                                                        |
| ---- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1    | البيانات الشخصية     | First name, Middle name, Last name, Email, Password, Confirm Password, Phone                                  |
| 2    | البيانات الأكاديمية  | Grade, Division (علمي/أدبي), Track (علمي علوم/علمي رياضة), Governorate, City, Gender, School name, Birth date |
| 3    | بيانات أولياء الأمور | Father's phone, Mother's phone, ID/Birth certificate image upload                                             |
| 4    | الشروط والأحكام      | Terms & Conditions acceptance (4 sections)                                                                    |

### Form Data Structure

```typescript
interface FormData {
  // Step 1 - Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  // Step 2 - Academic Info
  grade: string; // "grade1" | "grade2" | "grade3"
  division: string; // "scientific" | "literary"
  scientificTrack: string; // "science" | "math" (only if scientific)
  governorate: string;
  city: string;
  gender: string; // "male" | "female"
  schoolName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;

  // Step 3 - Parent Contacts & ID
  fatherPhone: string;
  motherPhone: string;
  idImage: File | null;

  // Step 4 - Terms
  agreeToTerms: boolean;
}
```

### Dropdown Data

**Grades (الصف الدراسي):**

- `grade1`: الصف الأول الثانوي
- `grade2`: الصف الثاني الثانوي
- `grade3`: الصف الثالث الثانوي

**Divisions (الشعبة):**

- `scientific`: علمي
- `literary`: أدبي

**Scientific Tracks (التخصص):**

- `science`: علمي علوم
- `math`: علمي رياضة

**Governorates (المحافظات):**
All 27 Egyptian governorates with dependent city dropdowns:

- القاهرة (20+ cities including مدينة نصر, المعادي, التجمع الخامس)
- الجيزة (22+ cities including الدقي, المهندسين, 6 أكتوبر, الشيخ زايد)
- الإسكندرية (20+ cities including سيدي جابر, سموحة, المندرة)
- And 24 more governorates...

**Birth Date Range:**

- Years: 2005-2012
- Months: يناير through ديسمبر
- Days: 1-31

### Phone Validation (Egyptian Format)

```typescript
// Egyptian mobile format: 01[0125]XXXXXXXX
const phoneRegex = /^01[0125][0-9]{8}$/;
```

### ID Upload Configuration

- Max file size: 5MB
- Accepted formats: PNG, JPG (image/\*)
- Preview with remove button
- Required field

### Terms & Conditions Sections

1. **التسجيل / الحضور** - Registration and attendance rules
2. **المحاضرات / الباقات** - Lectures and packages policies
3. **الأكواد والمحفظة** - Codes and wallet terms
4. **شروط عامة** - General terms

### Key File

`src/app/ar/signup/signup-client.tsx` - 1253 lines containing:

- Complete governorates data with cities
- Multi-step form logic
- Validation per step
- Image upload handling
- RTL-optimized UI

---

## Build System & Development (December 2024)

### Turbopack Configuration

The project uses **Turbopack** as the default bundler for faster development:

```json
// package.json scripts
{
  "dev": "next dev --turbopack", // Default - uses Turbopack
  "dev:webpack": "next dev", // Fallback to Webpack
  "build": "next build",
  "start": "next start"
}
```

### Known Issues & Solutions

#### node_modules Corruption Fix

**Symptoms:**

- `fcopyfile failed: Operation timed out`
- `ENOENT: no such file or directory, open '.next/server/app-paths-manifest.json'`
- Build completes but manifest files are deleted

**Root Cause:** Corrupted `node_modules` folder (can happen with low disk space or interrupted installs)

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Turbopack Caching Issues

**Symptom:** Code changes not reflected after save

**Solution:** Add unique comment to force recompile:

```typescript
// Force recompile: v2
```

Or clear cache:

```bash
rm -rf .next && npm run dev
```

### Next.js Version

- **Current:** Next.js 15.5.4
- **Note:** This version has a known security vulnerability (CVE-2025-66478). Upgrade recommended.

### Bundle Analyzer

```bash
ANALYZE=true npm run build
```

Configured in `next.config.ts` with `@next/bundle-analyzer`.

---

## Select Component RTL Support

### File: `src/components/ui/select.tsx`

The Select component is configured for RTL with proper positioning:

```typescript
<SelectPrimitive.Content
  className={cn(
    "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md",
    "border bg-popover text-popover-foreground shadow-md",
    position === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:translate-x-1 data-[side=right]:-translate-x-1 data-[side=top]:-translate-y-1"
  )}
  position={position}
  {...props}
>
```

### Usage in Forms

```typescript
<Select value={formData.grade} onValueChange={(v) => handleInputChange("grade", v)}>
  <SelectTrigger className="h-12 bg-gray-100 dark:bg-gray-700 border-0">
    <SelectValue placeholder="اختر الصف" />
  </SelectTrigger>
  <SelectContent>
    {GRADES.map((g) => (
      <SelectItem key={g.value} value={g.value}>
        {g.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## Development Environment

### System Requirements

- Node.js 18+
- npm 9+
- macOS/Linux/Windows

### Server Start

```bash
cd mrf-edu-web
npm run dev
# Server runs on http://localhost:3000
```

### Port Check

```bash
lsof -i :3000
```

### Health Check

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ar/signup
# Should return: 200
```

---

Last Updated: December 2024
