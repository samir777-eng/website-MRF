"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

/**
 * Screen Reader Announcer - Centralized announcement system for accessibility
 * 
 * Features:
 * - Polite announcements (queued, non-interrupting)
 * - Assertive announcements (immediate, important)
 * - Arabic language support
 * - Quiz-specific announcements
 * - Navigation announcements
 * - Form validation announcements
 * - Timer warnings
 */

type Politeness = "polite" | "assertive" | "off";

interface Announcement {
  id: string;
  message: string;
  politeness: Politeness;
  timestamp: number;
}

interface AnnouncerContextType {
  // Core announcements
  announce: (message: string, politeness?: Politeness) => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  
  // Quiz-specific announcements
  announceQuestion: (questionNumber: number, totalQuestions: number, questionText: string) => void;
  announceAnswer: (isCorrect: boolean, explanation?: string) => void;
  announceQuizStart: (quizTitle: string, questionCount: number, duration: number) => void;
  announceQuizEnd: (score: number, correctCount: number, totalCount: number) => void;
  announceTimeWarning: (minutesLeft: number) => void;
  
  // Navigation announcements
  announcePageChange: (pageTitle: string) => void;
  announceModalOpen: (modalTitle: string) => void;
  announceModalClose: () => void;
  
  // Form announcements
  announceFormError: (fieldName: string, errorMessage: string) => void;
  announceFormSuccess: (message: string) => void;
  
  // Achievement/Gamification announcements
  announceAchievement: (achievementName: string, xpGained?: number) => void;
  announceXPGain: (xpAmount: number, reason?: string) => void;
  announceLevelUp: (newLevel: number) => void;
  announceStreakUpdate: (streakDays: number) => void;
  
  // Loading states
  announceLoading: (isLoading: boolean, context?: string) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(undefined);

interface AnnouncerProviderProps {
  children: ReactNode;
}

export function ScreenReaderAnnouncerProvider({ children }: AnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");
  const announcementQueue = useRef<Announcement[]>([]);
  const isProcessing = useRef(false);
  const announcementId = useRef(0);

  // Process announcement queue
  const processQueue = useCallback(() => {
    if (isProcessing.current || announcementQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const announcement = announcementQueue.current.shift();
    
    if (announcement) {
      if (announcement.politeness === "assertive") {
        setAssertiveMessage(announcement.message);
      } else {
        setPoliteMessage(announcement.message);
      }
      
      // Clear after announcement
      setTimeout(() => {
        setPoliteMessage("");
        setAssertiveMessage("");
        isProcessing.current = false;
        processQueue(); // Process next in queue
      }, 1000);
    }
  }, []);

  // Core announce function
  const announce = useCallback((message: string, politeness: Politeness = "polite") => {
    if (!message || politeness === "off") return;
    
    const id = `announcement-${++announcementId.current}`;
    
    if (politeness === "assertive") {
      // Assertive messages bypass queue
      setAssertiveMessage(message);
      setTimeout(() => setAssertiveMessage(""), 1000);
    } else {
      announcementQueue.current.push({
        id,
        message,
        politeness,
        timestamp: Date.now(),
      });
      processQueue();
    }
  }, [processQueue]);

  // Convenience methods
  const announcePolite = useCallback((message: string) => announce(message, "polite"), [announce]);
  const announceAssertive = useCallback((message: string) => announce(message, "assertive"), [announce]);

  // Quiz-specific announcements
  const announceQuestion = useCallback((questionNumber: number, totalQuestions: number, questionText: string) => {
    announce(`السؤال ${questionNumber} من ${totalQuestions}: ${questionText}`, "assertive");
  }, [announce]);

  const announceAnswer = useCallback((isCorrect: boolean, explanation?: string) => {
    const message = isCorrect 
      ? `إجابة صحيحة!${explanation ? ` التفسير: ${explanation}` : ""}`
      : `إجابة خاطئة.${explanation ? ` التفسير: ${explanation}` : ""}`;
    announce(message, "assertive");
  }, [announce]);

  const announceQuizStart = useCallback((quizTitle: string, questionCount: number, duration: number) => {
    announce(`بدء الاختبار: ${quizTitle}. ${questionCount} سؤال في ${duration} دقيقة.`, "assertive");
  }, [announce]);

  const announceQuizEnd = useCallback((score: number, correctCount: number, totalCount: number) => {
    const message = `انتهى الاختبار! النتيجة: ${score} بالمائة. ${correctCount} إجابة صحيحة من ${totalCount}.`;
    announce(message, "assertive");
  }, [announce]);

  const announceTimeWarning = useCallback((minutesLeft: number) => {
    if (minutesLeft === 5) {
      announce("تحذير: متبقي 5 دقائق على انتهاء الوقت", "assertive");
    } else if (minutesLeft === 1) {
      announce("تحذير: متبقي دقيقة واحدة!", "assertive");
    }
  }, [announce]);

  // Navigation announcements
  const announcePageChange = useCallback((pageTitle: string) => {
    announce(`تم الانتقال إلى: ${pageTitle}`, "polite");
  }, [announce]);

  const announceModalOpen = useCallback((modalTitle: string) => {
    announce(`تم فتح نافذة: ${modalTitle}`, "polite");
  }, [announce]);

  const announceModalClose = useCallback(() => {
    announce("تم إغلاق النافذة", "polite");
  }, [announce]);

  // Form announcements
  const announceFormError = useCallback((fieldName: string, errorMessage: string) => {
    announce(`خطأ في ${fieldName}: ${errorMessage}`, "assertive");
  }, [announce]);

  const announceFormSuccess = useCallback((message: string) => {
    announce(message, "polite");
  }, [announce]);

  // Achievement/Gamification announcements
  const announceAchievement = useCallback((achievementName: string, xpGained?: number) => {
    const message = xpGained 
      ? `تهانينا! حصلت على إنجاز: ${achievementName}. +${xpGained} نقطة خبرة`
      : `تهانينا! حصلت على إنجاز: ${achievementName}`;
    announce(message, "assertive");
  }, [announce]);

  const announceXPGain = useCallback((xpAmount: number, reason?: string) => {
    const message = reason 
      ? `+${xpAmount} نقطة خبرة: ${reason}`
      : `+${xpAmount} نقطة خبرة`;
    announce(message, "polite");
  }, [announce]);

  const announceLevelUp = useCallback((newLevel: number) => {
    announce(`تهانينا! وصلت إلى المستوى ${newLevel}!`, "assertive");
  }, [announce]);

  const announceStreakUpdate = useCallback((streakDays: number) => {
    if (streakDays === 1) {
      announce("بدأت سلسلة يومية جديدة!", "polite");
    } else {
      announce(`سلسلة يومية: ${streakDays} يوم متتالي!`, "polite");
    }
  }, [announce]);

  // Loading states
  const announceLoading = useCallback((isLoading: boolean, context?: string) => {
    if (isLoading) {
      announce(`جاري التحميل${context ? `: ${context}` : "..."}`, "polite");
    } else if (context) {
      announce(`تم تحميل ${context}`, "polite");
    }
  }, [announce]);

  const value: AnnouncerContextType = {
    announce,
    announcePolite,
    announceAssertive,
    announceQuestion,
    announceAnswer,
    announceQuizStart,
    announceQuizEnd,
    announceTimeWarning,
    announcePageChange,
    announceModalOpen,
    announceModalClose,
    announceFormError,
    announceFormSuccess,
    announceAchievement,
    announceXPGain,
    announceLevelUp,
    announceStreakUpdate,
    announceLoading,
  };

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      {/* Polite live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive live region */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useScreenReaderAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Return no-op functions if outside provider
    return {
      announce: () => {},
      announcePolite: () => {},
      announceAssertive: () => {},
      announceQuestion: () => {},
      announceAnswer: () => {},
      announceQuizStart: () => {},
      announceQuizEnd: () => {},
      announceTimeWarning: () => {},
      announcePageChange: () => {},
      announceModalOpen: () => {},
      announceModalClose: () => {},
      announceFormError: () => {},
      announceFormSuccess: () => {},
      announceAchievement: () => {},
      announceXPGain: () => {},
      announceLevelUp: () => {},
      announceStreakUpdate: () => {},
      announceLoading: () => {},
    } as AnnouncerContextType;
  }
  return context;
}

// Hook for route change announcements
export function useRouteAnnouncement(pageTitle: string) {
  const { announcePageChange } = useScreenReaderAnnouncer();
  
  useEffect(() => {
    announcePageChange(pageTitle);
  }, [pageTitle, announcePageChange]);
}

