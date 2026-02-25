# Dashboard Components - Phase 1 Task 1.5

Simplified dashboard with progressive disclosure and NextActionCard component.

## Components

### NextActionCard

Prominent card showing the most important next action for the user.

```tsx
import NextActionCard, { type NextAction } from '@/components/dashboard/NextActionCard';

const action: NextAction = {
  type: 'continue-lesson',
  id: 'lesson-15',
  title: 'أسلوب الاستثناء',
  subject: 'النحو',
  progress: 65,
  duration: '25 دقيقة متبقية',
  estimatedTime: '15 دقيقة',
  completionReward: {
    xp: 100,
    badge: 'نحوي متميز',
  },
};

<NextActionCard action={action} prominent size="large" />
```

#### Action Types

- `continue-lesson`: Resume an in-progress lesson
- `start-lesson`: Begin a new lesson
- `take-quiz`: Take an assessment
- `complete-homework`: Finish assigned homework

#### Props

- `action`: NextAction object with details
- `prominent`: Boolean, adds gradient background (default: true)
- `size`: 'default' | 'large' (default: 'large')

### SimplifiedDashboard

Complete dashboard layout with progressive disclosure pattern.

```tsx
import { SimplifiedDashboard } from '@/components/dashboard/SimplifiedDashboard';

export default function DashboardPage() {
  return <SimplifiedDashboard />;
}
```

## Dashboard Structure (Phase 1)

### 1. Next Action Card (Hero Section)
- Most prominent element
- Shows the single most important next action
- Large, colorful, with clear CTA

### 2. Core Stats (3 Only)
- **Level**: User's current level with icon
- **Streak**: Consecutive days of activity
- **Today Progress**: Daily goal completion percentage

### 3. Daily Quests
- Max 3 visible quests by default
- Expandable accordion for additional quests
- Shows completion status and XP rewards
- Total progress badge

### 4. Quick Access (4 Primary Items)
- **المحاضرات** (Lectures): Video lectures
- **الإنجازات** (Achievements): Unlocked badges
- **المتصدرون** (Leaderboard): Rankings
- **المتجر** (Store): Shop for rewards

### 5. Explore More (Progressive Disclosure)
- Collapsed by default
- Contains 6 secondary actions:
  - التحديات (Challenges)
  - الواجبات (Homework)
  - أسئلة وأجوبة (Q&A)
  - مراجعة الأخطاء (Review Mistakes)
  - إدارة المهام (Task Management)
  - الملف الشخصي (Profile)

## Design Principles (Phase 1 Task 1.5)

### Progressive Disclosure
- Show the most important information first
- Hide secondary actions in collapsible sections
- Reduce cognitive load and choice paralysis

### Clear Next Action
- Always show what the user should do next
- Make it unmissable and prominent
- Provide context (progress, time, rewards)

### Limited Options
- Max 4 quick access items (vs 10 previously)
- Max 3 visible daily quests (expandable)
- Core stats reduced to 3 (vs 4+ previously)

### Visual Hierarchy
1. **Primary**: Next Action Card (largest, most colorful)
2. **Secondary**: Core Stats (gradient cards)
3. **Tertiary**: Daily Quests (subtle background)
4. **Quaternary**: Quick Access (icon + label)
5. **Hidden**: Explore More (requires expansion)

## Comparison: Before vs After

### Before (Complex Dashboard)
- ❌ 10 quick access items
- ❌ 4+ stat cards
- ❌ All daily quests visible
- ❌ No clear next action
- ❌ Overwhelming choices

### After (Simplified Dashboard)
- ✅ 4 quick access items (+ 6 hidden)
- ✅ 3 core stats only
- ✅ 3 visible quests (expandable)
- ✅ Prominent next action card
- ✅ Progressive disclosure
- ✅ Reduced cognitive load

## Accessibility

- Proper semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in accordions
- Color contrast compliant (WCAG AA)

## Mobile Optimization

- Touch-friendly targets (min 44px)
- Responsive grid layouts
- Stack on small screens
- Optimized font sizes
- Fast loading with skeleton states

## Integration with Context

```tsx
// Example with real data from context
import { useGamification } from '@/contexts/GamificationContext';

function DashboardPage() {
  const { userStats, currentLesson, dailyQuests } = useGamification();

  const nextAction: NextAction = {
    type: 'continue-lesson',
    id: currentLesson.id,
    title: currentLesson.title,
    subject: currentLesson.subject,
    progress: currentLesson.progress,
    // ... more fields
  };

  return (
    <div>
      <NextActionCard action={nextAction} />
      {/* Rest of dashboard */}
    </div>
  );
}
```

## Performance

- Lazy load explore more section
- Optimize re-renders with React.memo
- Use skeleton loaders during initial load
- Minimize bundle size with code splitting

## Future Enhancements (Phase 2+)

- Personalized recommendations
- AI-powered next actions
- Smart quest prioritization
- Adaptive difficulty
- Social features integration
