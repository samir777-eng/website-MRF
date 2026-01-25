"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@/components/ui/icons";
import { AlertCircle } from "lucide-react";
import React from "react";
import { ErrorBoundary } from "./error-boundary";

interface SectionErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  sectionName?: string;
}

function SectionErrorFallback({
  error,
  resetError,
  sectionName = "هذا القسم",
}: SectionErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>خطأ في تحميل {sectionName}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          عذراً، حدث خطأ أثناء تحميل {sectionName}. يرجى المحاولة مرة أخرى.
        </p>
        {resetError && (
          <Button
            onClick={resetError}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        )}
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm">تفاصيل الخطأ</summary>
            <pre className="text-sm mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
  fallback?: React.ReactNode;
}

export function SectionErrorBoundary({
  children,
  sectionName,
  fallback,
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={fallback || <SectionErrorFallback sectionName={sectionName} />}
      onError={(error, errorInfo) => {
        console.error(`Error in section "${sectionName}":`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specific error boundaries for different app sections
export function HeaderErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="شريط التنقل">
      {children}
    </SectionErrorBoundary>
  );
}

export function FooterErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="تذييل الصفحة">
      {children}
    </SectionErrorBoundary>
  );
}

export function LessonErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="المحاضرة">
      {children}
    </SectionErrorBoundary>
  );
}

export function QuizErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SectionErrorBoundary sectionName="الاختبار">
      {children}
    </SectionErrorBoundary>
  );
}

export function DashboardErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="لوحة التحكم">
      {children}
    </SectionErrorBoundary>
  );
}

// Video player error boundary with specific fallback
export function VideoPlayerErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="مشغل الفيديو">
      {children}
    </SectionErrorBoundary>
  );
}

// Gamification components error boundary
export function GamificationErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="نظام النقاط والإنجازات">
      {children}
    </SectionErrorBoundary>
  );
}

// Exercise/Homework error boundary
export function ExerciseErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="التمرين">
      {children}
    </SectionErrorBoundary>
  );
}

// Leaderboard error boundary
export function LeaderboardErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="قائمة المتصدرين">
      {children}
    </SectionErrorBoundary>
  );
}

// Achievement display error boundary
export function AchievementErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="الإنجازات">
      {children}
    </SectionErrorBoundary>
  );
}

// Notes/Bookmarks error boundary
export function NotesErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="الملاحظات">
      {children}
    </SectionErrorBoundary>
  );
}

// Progress tracking error boundary
export function ProgressErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="تتبع التقدم">
      {children}
    </SectionErrorBoundary>
  );
}

// Form error boundary
export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SectionErrorBoundary sectionName="النموذج">
      {children}
    </SectionErrorBoundary>
  );
}

// Search error boundary
export function SearchErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionErrorBoundary sectionName="البحث">{children}</SectionErrorBoundary>
  );
}
