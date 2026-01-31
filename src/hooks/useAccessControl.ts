import { useAuth } from "@/contexts/AuthContext";
import type { GradeLevel } from "@/types/lecture";

export function useAccessControl() {
  const { user, isAuthenticated } = useAuth();

  /**
   * Check if user can access content for a specific grade
   * CRITICAL: Grade isolation - users can only access their own grade's content
   */
  const canAccessGrade = (contentGrade: GradeLevel): boolean => {
    if (!user) return false;
    return user.gradeLevel === contentGrade;
  };

  /**
   * Check if user has an active subscription
   */
  const hasActiveSubscription = (): boolean => {
    if (!user) return false;
    return user.subscriptionStatus === "active";
  };

  /**
   * Check if user's subscription is expired
   */
  const isSubscriptionExpired = (): boolean => {
    if (!user) return true;
    return user.subscriptionStatus === "expired";
  };

  /**
   * Check if user is in trial period
   */
  const isInTrial = (): boolean => {
    if (!user) return false;
    return user.subscriptionStatus === "trial";
  };

  /**
   * Get days until subscription expires
   */
  const getDaysUntilExpiry = (): number | null => {
    if (!user?.subscriptionEndDate) return null;
    const now = new Date();
    const endDate = new Date(user.subscriptionEndDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  const isSubscriptionExpiringSoon = (): boolean => {
    const daysUntilExpiry = getDaysUntilExpiry();
    if (daysUntilExpiry === null) return false;
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  };

  /**
   * Check if user can access a lecture
   */
  const canAccessLecture = (lectureGrade: GradeLevel): boolean => {
    return (
      isAuthenticated && canAccessGrade(lectureGrade) && hasActiveSubscription()
    );
  };

  /**
   * Check if user can access a quiz
   */
  const canAccessQuiz = (quizGrade: GradeLevel): boolean => {
    return (
      isAuthenticated && canAccessGrade(quizGrade) && hasActiveSubscription()
    );
  };

  /**
   * Check if user can access a lesson
   */
  const canAccessLesson = (lessonGrade: GradeLevel): boolean => {
    return (
      isAuthenticated && canAccessGrade(lessonGrade) && hasActiveSubscription()
    );
  };

  /**
   * Check if user can access an exercise
   */
  const canAccessExercise = (exerciseGrade: GradeLevel): boolean => {
    return (
      isAuthenticated &&
      canAccessGrade(exerciseGrade) &&
      hasActiveSubscription()
    );
  };

  /**
   * Check if user can access homework
   */
  const canAccessHomework = (homeworkGrade: GradeLevel): boolean => {
    return (
      isAuthenticated &&
      canAccessGrade(homeworkGrade) &&
      hasActiveSubscription()
    );
  };

  /**
   * Check if user is a student
   */
  const isStudent = (): boolean => {
    return user?.role === "student";
  };

  /**
   * Check if user is a teacher
   */
  const isTeacher = (): boolean => {
    return user?.role === "teacher";
  };

  /**
   * Check if user is an admin
   */
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  /**
   * Get access denial reason
   */
  const getAccessDenialReason = (contentGrade: GradeLevel): string => {
    if (!isAuthenticated) {
      return "يجب تسجيل الدخول للوصول إلى هذا المحتوى";
    }

    if (!canAccessGrade(contentGrade)) {
      return "هذا المحتوى غير متاح لصفك الدراسي";
    }

    if (!hasActiveSubscription()) {
      if (isSubscriptionExpired()) {
        return "اشتراكك منتهي. يرجى تجديد الاشتراك للمتابعة";
      }
      return "يتطلب هذا المحتوى اشتراكاً نشطاً";
    }

    return "غير مصرح بالوصول";
  };

  return {
    // Grade access
    canAccessGrade,

    // Subscription
    hasActiveSubscription,
    isSubscriptionExpired,
    isInTrial,
    getDaysUntilExpiry,
    isSubscriptionExpiringSoon,

    // Content access
    canAccessLecture,
    canAccessQuiz,
    canAccessLesson,
    canAccessExercise,
    canAccessHomework,

    // Roles
    isStudent,
    isTeacher,
    isAdmin,

    // Utilities
    getAccessDenialReason,
  };
}
