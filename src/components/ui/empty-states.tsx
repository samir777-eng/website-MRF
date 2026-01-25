"use client";

import {
  Bell,
  BookOpen,
  Flame,
  Gift,
  MessageSquare,
  Search,
  ShoppingBag,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "./empty-state";

/**
 * Pre-configured empty states for common scenarios
 * Arabic text for MRF Educational Platform
 */

export function NoLessonsEmpty() {
  const router = useRouter();
  return (
    <EmptyState
      icon={BookOpen}
      title="لا توجد دروس بعد"
      description="لم تبدأ أي دروس حتى الآن. ابدأ رحلة التعلم الآن واكتشف المحتوى التعليمي المميز!"
      actionLabel="استكشف الدروس"
      onAction={() => router.push("/ar/lectures")}
    />
  );
}

export function NoChallengesEmpty() {
  const router = useRouter();
  return (
    <EmptyState
      icon={Target}
      title="لا توجد تحديات"
      description="لم تكمل أي تحديات بعد. جرب تحدياتنا التفاعلية لقياس مستواك!"
      actionLabel="ابدأ تحدياً"
      onAction={() => router.push("/ar/challenges")}
    />
  );
}

export function NoAchievementsEmpty() {
  const router = useRouter();
  return (
    <EmptyState
      icon={Trophy}
      title="لا توجد إنجازات بعد"
      description="ابدأ رحلة التعلم واكسب الإنجازات والشارات الخاصة بك!"
      actionLabel="ابدأ التعلم"
      onAction={() => router.push("/ar/lectures")}
    />
  );
}

export function NoSearchResultsEmpty({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="لا توجد نتائج"
      description={
        query
          ? `لم نجد نتائج لـ "${query}". جرب البحث بكلمات مختلفة.`
          : "لم نجد نتائج لبحثك. جرب البحث بكلمات مختلفة."
      }
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={Bell}
      title="لا توجد إشعارات"
      description="ستظهر هنا إشعاراتك الجديدة عندما يكون هناك شيء مهم."
    />
  );
}

export function NoMessagesEmpty() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="لا توجد رسائل"
      description="صندوق الرسائل فارغ حالياً. ستظهر هنا رسائلك الجديدة."
    />
  );
}

export function NoReviewsEmpty() {
  return (
    <EmptyState
      icon={Star}
      title="لا توجد مراجعات"
      description="لم تتم إضافة أي مراجعات بعد. كن أول من يضيف مراجعة!"
      actionLabel="أضف مراجعة"
    />
  );
}

export function NoStreakEmpty() {
  const router = useRouter();
  return (
    <EmptyState
      icon={Flame}
      title="ابدأ سلسلتك!"
      description="ادرس يومياً للحفاظ على سلسلة التعلم واكسب مكافآت إضافية!"
      actionLabel="ابدأ الآن"
      onAction={() => router.push("/ar/lectures")}
    />
  );
}

export function NoRewardsEmpty() {
  const router = useRouter();
  return (
    <EmptyState
      icon={Gift}
      title="لا توجد مكافآت"
      description="اكسب النقاط والجواهر لفتح المكافآت الخاصة في المتجر!"
      actionLabel="تصفح المتجر"
      onAction={() => router.push("/ar/store")}
    />
  );
}

export function EmptyCartState() {
  const router = useRouter();
  return (
    <EmptyState
      icon={ShoppingBag}
      title="سلة التسوق فارغة"
      description="لم تضف أي منتجات إلى سلة التسوق بعد. تصفح متجرنا واكتشف العروض!"
      actionLabel="تصفح المتجر"
      onAction={() => router.push("/ar/store")}
    />
  );
}
