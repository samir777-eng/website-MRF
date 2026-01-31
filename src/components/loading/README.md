# Loading Components - Phase 1 Task 1.3

Premium skeleton loaders and optimistic UI utilities for the MRF Educational Platform.

## Components

### Enhanced Skeleton Components

```tsx
import {
  EnhancedSkeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonStatCard,
  SkeletonListItem,
} from '@/components/loading';

// Basic skeleton
<EnhancedSkeleton variant="rectangular" width="100%" height="200px" />

// Text skeleton with multiple lines
<SkeletonText lines={3} lastLineWidth="80%" />

// Card skeleton with all elements
<SkeletonCard hasImage hasTitle hasDescription hasActions />

// Avatar in different sizes
<SkeletonAvatar size="lg" />

// Button skeleton
<SkeletonButton size="md" />

// Stat card skeleton
<SkeletonStatCard />

// List item skeleton
<SkeletonListItem hasAvatar hasSecondaryText hasTrailing />
```

### Page-Specific Skeletons

```tsx
import {
  DashboardSkeleton,
  LecturesListSkeleton,
  LessonsListSkeleton,
  ProfileSkeleton,
} from "@/components/loading";

// In your loading.tsx file
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### Animation Types

- **shimmer** (default): Smooth shimmer animation
- **pulse**: Pulsing opacity animation
- **wave**: Wave animation effect

```tsx
<EnhancedSkeleton animation="shimmer" />
```

## Optimistic UI

### Using the Hook

```tsx
import { useOptimisticUpdate } from "@/lib/optimistic-updates";

function LessonCard({ lesson }) {
  const { performOptimisticUpdate, isUpdating } = useOptimisticUpdate();
  const [lessons, setLessons] = useState([]);

  const completeLesson = async () => {
    const result = await performOptimisticUpdate({
      currentData: lessons,
      updateFn: (data) =>
        data.map((l) =>
          l.id === lesson.id ? { ...l, completed: true, progress: 100 } : l,
        ),
      apiFn: () => api.completeLesson(lesson.id),
      onSuccess: () => {
        toast.success("تم إكمال الدرس");
        celebration.showXPGain(100);
      },
      onError: () => {
        toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
      },
    });

    if (result.success) {
      setLessons(result.data);
    }
  };

  return (
    <button onClick={completeLesson} disabled={isUpdating}>
      {isUpdating ? "جاري الحفظ..." : "إكمال الدرس"}
    </button>
  );
}
```

### Utility Functions

```tsx
import {
  optimisticUpdateArray,
  optimisticAddToArray,
  optimisticRemoveFromArray,
  optimisticUpdateNested,
} from "@/lib/optimistic-updates";

// Update single item in array
const updated = optimisticUpdateArray(lessons, lessonId, (lesson) => ({
  ...lesson,
  completed: true,
}));

// Add item to array
const added = optimisticAddToArray(lessons, newLesson);

// Remove item from array
const removed = optimisticRemoveFromArray(lessons, lessonId);

// Update nested property
const nested = optimisticUpdateNested(
  userStats,
  ["progress", "lessonsCompleted"],
  10,
);
```

## Best Practices

1. **Always show skeletons instead of spinners** for better UX
2. **Match skeleton layout to actual content** for smooth transitions
3. **Use optimistic updates** for instant feedback on user actions
4. **Always handle errors** and revert optimistic updates on failure
5. **Show loading indicators** during optimistic update API calls
6. **Use appropriate animation** based on content type (shimmer for most cases)

## Migration Guide

Replace existing loading spinners:

```tsx
// ❌ Before
{
  isLoading && <Spinner />;
}
{
  !isLoading && <Content />;
}

// ✅ After
{
  isLoading ? <DashboardSkeleton /> : <Content />;
}
```

Implement optimistic updates:

```tsx
// ❌ Before
const handleClick = async () => {
  setLoading(true);
  try {
    await api.update();
    setData(newData);
  } catch (error) {
    toast.error("Error");
  } finally {
    setLoading(false);
  }
};

// ✅ After
const { performOptimisticUpdate } = useOptimisticUpdate();

const handleClick = async () => {
  await performOptimisticUpdate({
    currentData: data,
    updateFn: (d) => ({ ...d, updated: true }),
    apiFn: () => api.update(),
    onSuccess: () => toast.success("تم التحديث"),
    onError: () => toast.error("حدث خطأ"),
  });
};
```

## Performance Considerations

- Skeletons use CSS animations for performance
- Optimistic updates minimize perceived latency
- Error handling ensures data consistency
- Automatic revert on API failures

## Accessibility

- All skeletons have `aria-hidden="true"` attribute
- Loading states announced to screen readers
- Keyboard navigation preserved during loading
