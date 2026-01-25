# 🎨 Pattern Crib - Design System Documentation

This directory contains design patterns, component examples, and visual references for the MRF Educational Platform.

## 📁 Directory Structure

```
pattern-crib/
├── README.md                    # This file
├── components/                  # Component patterns and examples
│   ├── gamification/           # XP badges, progress rings, streaks
│   ├── quiz/                   # Quiz components and interactions
│   ├── video/                  # Video player patterns
│   └── layout/                 # Header, footer, navigation patterns
├── design-tokens/              # Color palettes, typography, spacing
├── screenshots/                # Visual references and mockups
├── animations/                 # Animation patterns and examples
└── competitive-analysis/       # Research on similar platforms
```

## 🎯 Design Principles

### 1. Arabic-First Design

- **RTL Layout**: All components designed with RTL as primary consideration
- **Typography**: Arabic fonts optimized for readability and performance
- **Cultural Context**: Egyptian design elements and color psychology

### 2. Gen Z Engagement

- **Micro-interactions**: Subtle animations that provide feedback
- **Gamification**: Visual rewards and progress indicators
- **Mobile-first**: Touch-friendly interfaces with gesture support
- **Dark Mode**: Preferred by younger users for extended screen time

### 3. Educational Focus

- **Clear Hierarchy**: Information architecture that guides learning
- **Progress Visibility**: Always show where students are in their journey
- **Immediate Feedback**: Quick responses to user actions
- **Accessibility**: Support for different learning needs and abilities

## 🎨 Color System

### Primary Palette (Egyptian Blue)

```css
--primary-50: #eff6ff; /* Very light blue backgrounds */
--primary-100: #dbeafe; /* Light blue accents */
--primary-200: #bfdbfe; /* Subtle blue elements */
--primary-300: #93c5fd; /* Medium blue for secondary actions */
--primary-400: #60a5fa; /* Active blue states */
--primary-500: #3b82f6; /* Main brand blue */
--primary-600: #2563eb; /* Darker blue for emphasis */
--primary-700: #1d4ed8; /* Strong blue for important elements */
--primary-800: #1e40af; /* Very dark blue */
--primary-900: #1e3a8a; /* Darkest blue for text */
```

### Secondary Palette (Desert Sand)

```css
--secondary-50: #fffbeb; /* Warm light backgrounds */
--secondary-100: #fef3c7; /* Light sand accents */
--secondary-200: #fde68a; /* Subtle warm elements */
--secondary-300: #fcd34d; /* Medium warm for highlights */
--secondary-400: #fbbf24; /* Active warm states */
--secondary-500: #f59e0b; /* Main warm accent */
--secondary-600: #d97706; /* Darker warm for emphasis */
--secondary-700: #b45309; /* Strong warm for CTAs */
--secondary-800: #92400e; /* Very dark warm */
--secondary-900: #78350f; /* Darkest warm for text */
```

### Gamification Colors

```css
--xp-color: #eab308; /* Gold for XP points */
--streak-color: #ea580c; /* Orange for streaks */
--reward-color: #9333ea; /* Purple for rewards */
--achievement-color: #059669; /* Green for achievements */
--level-color: #dc2626; /* Red for level badges */
```

### Semantic Colors

```css
--success: #10b981; /* Green for success states */
--warning: #f59e0b; /* Orange for warnings */
--error: #ef4444; /* Red for errors */
--info: #3b82f6; /* Blue for information */
```

## 📝 Typography Scale

### Arabic Typography

```css
/* Primary Arabic Font */
font-family: "Noto Sans Arabic", "Cairo", system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem; /* 12px - Small labels */
--text-sm: 0.875rem; /* 14px - Body text */
--text-base: 1rem; /* 16px - Default body */
--text-lg: 1.125rem; /* 18px - Large body */
--text-xl: 1.25rem; /* 20px - Small headings */
--text-2xl: 1.5rem; /* 24px - Medium headings */
--text-3xl: 1.875rem; /* 30px - Large headings */
--text-4xl: 2.25rem; /* 36px - Extra large headings */

/* Line Heights for Arabic */
--leading-tight: 1.25; /* For headings */
--leading-normal: 1.5; /* For body text */
--leading-relaxed: 1.75; /* For long-form content */

/* Letter Spacing for Arabic */
--tracking-normal: 0; /* Default for Arabic */
--tracking-wide: 0.025em; /* For emphasis */
```

### English Typography

```css
/* Primary English Font */
font-family: "Inter", system-ui, sans-serif;

/* Same size scale as Arabic but different line heights */
--leading-tight-en: 1.2; /* Tighter for Latin scripts */
--leading-normal-en: 1.4; /* Normal for Latin scripts */
--leading-relaxed-en: 1.6; /* Relaxed for Latin scripts */
```

## 🎮 Gamification Components

### XP Badge Patterns

```tsx
// Small XP badge for inline display
<XPBadge xp={150} size="sm" />

// Large XP badge with animation
<XPBadge xp={2450} xpGained={100} size="lg" showAnimation />

// Custom styled XP badge
<XPBadge
  xp={1200}
  className="bg-gradient-to-r from-yellow-400 to-yellow-600"
/>
```

### Progress Ring Patterns

```tsx
// Basic progress ring
<ProgressRing progress={75} />

// Animated progress ring with custom color
<ProgressRing
  progress={85}
  color="success"
  showAnimation
  size={120}
>
  <div className="text-center">
    <div className="text-2xl font-bold">85%</div>
    <div className="text-sm text-muted-foreground">Complete</div>
  </div>
</ProgressRing>

// Multi-ring progress (for multiple subjects)
<ProgressRing progress={60} color="primary" size={100}>
  <ProgressRing progress={80} color="secondary" size={70}>
    <div className="text-center">
      <div className="text-lg font-bold">70%</div>
      <div className="text-xs">Avg</div>
    </div>
  </ProgressRing>
</ProgressRing>
```

### Streak Counter Patterns

```tsx
// Basic streak counter
<StreakCounter days={7} />

// Animated streak with custom size
<StreakCounter days={15} animated size="lg" />

// Streak with milestone celebration
<StreakCounter
  days={30}
  milestone={30}
  celebrationEffect="confetti"
/>
```

## 🎯 Quiz Component Patterns

### Question Types

```tsx
// Multiple choice question
<QuizCard
  question={{
    id: '1',
    question: 'ما هو إعراب كلمة "الطالب" في جملة "جاء الطالب"؟',
    options: [
      { id: 'a', text: 'فاعل مرفوع', isCorrect: true },
      { id: 'b', text: 'مفعول به منصوب', isCorrect: false },
      // ... more options
    ],
    difficulty: 'easy',
    points: 10
  }}
  onAnswer={(optionId, isCorrect, points) => {
    // Handle answer
  }}
/>

// True/False question
<QuizCard
  question={{
    type: 'boolean',
    question: 'الفعل المضارع يبدأ بأحد أحرف "أنيت"',
    correctAnswer: true,
    difficulty: 'medium',
    points: 15
  }}
/>
```

### Quiz Results

```tsx
<QuizResults
  score={85}
  totalQuestions={10}
  correctAnswers={8}
  xpGained={120}
  achievements={["first_quiz", "high_score"]}
  onRetry={() => {}}
  onContinue={() => {}}
/>
```

## 🎥 Video Player Patterns

### Basic Video Player

```tsx
<VideoPlayer
  src="/videos/lesson-1.mp4"
  poster="/thumbnails/lesson-1.jpg"
  title="مقدمة في النحو العربي"
  onProgress={(progress) => {
    // Save progress
  }}
  onComplete={() => {
    // Award XP, unlock next lesson
  }}
/>
```

### Video with Quiz Integration

```tsx
<VideoPlayer
  src="/videos/lesson-1.mp4"
  quizPoints={[
    { time: 300, quizId: "quiz-1" }, // Quiz at 5 minutes
    { time: 600, quizId: "quiz-2" }, // Quiz at 10 minutes
  ]}
  onQuizTrigger={(quizId) => {
    // Show quiz overlay
  }}
/>
```

## 📱 Responsive Patterns

### Mobile-First Breakpoints

```css
/* Mobile (default) */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container {
    padding: 4rem;
  }
}
```

### RTL/LTR Responsive Patterns

```css
/* Use logical properties for RTL support */
.card {
  margin-inline-start: 1rem; /* Instead of margin-left */
  padding-inline: 1rem; /* Instead of padding-left/right */
  border-inline-start: 2px solid; /* Instead of border-left */
}

/* Tailwind RTL utilities */
.rtl\:text-right {
  text-align: right;
}
.ltr\:text-left {
  text-align: left;
}
```

## 🎨 Animation Patterns

### Micro-interactions

```tsx
// Button hover animation
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
>
  ابدأ التعلم
</motion.button>

// Card entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="bg-white rounded-lg shadow-lg p-6"
>
  {/* Card content */}
</motion.div>
```

### Page Transitions

```tsx
// Page entrance animation
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

### Success Celebrations

```tsx
// XP gain celebration
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 30,
  }}
  className="fixed inset-0 flex items-center justify-center z-50"
>
  <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg">+100 XP!</div>
</motion.div>
```

## 🔧 Component Composition Patterns

### Layout Composition

```tsx
// Dashboard layout with sidebar
<DashboardLayout>
  <Sidebar>
    <Navigation />
    <ProgressSummary />
  </Sidebar>
  <MainContent>
    <Header />
    <Content />
  </MainContent>
</DashboardLayout>

// Lesson layout with video and sidebar
<LessonLayout>
  <VideoSection>
    <VideoPlayer />
    <VideoControls />
  </VideoSection>
  <ContentSection>
    <LessonNotes />
    <QuizSection />
  </ContentSection>
</LessonLayout>
```

### Form Patterns

```tsx
// Multi-step form with progress
<MultiStepForm
  steps={[
    { id: "profile", title: "الملف الشخصي" },
    { id: "preferences", title: "التفضيلات" },
    { id: "confirmation", title: "التأكيد" },
  ]}
  currentStep={1}
  onStepChange={(step) => {}}
>
  <FormStep id="profile">
    <ProfileForm />
  </FormStep>
  <FormStep id="preferences">
    <PreferencesForm />
  </FormStep>
  <FormStep id="confirmation">
    <ConfirmationForm />
  </FormStep>
</MultiStepForm>
```

## 📊 Data Visualization Patterns

### Progress Charts

```tsx
// Weekly progress chart
<ProgressChart
  data={weeklyProgress}
  type="line"
  color="primary"
  showGrid
  showTooltip
/>

// Subject comparison chart
<ComparisonChart
  subjects={['نحو', 'بلاغة', 'أدب', 'نصوص']}
  scores={[85, 92, 78, 88]}
  colors={['primary', 'secondary', 'accent', 'success']}
/>
```

### Leaderboard Patterns

```tsx
<Leaderboard
  entries={leaderboardData}
  currentUser={currentUser}
  showRank
  showXP
  showAvatar
  highlightCurrentUser
/>
```

---

This pattern crib serves as a living document that grows with the platform. Each pattern should be tested across different screen sizes, themes (light/dark), and languages (Arabic RTL/English LTR).
