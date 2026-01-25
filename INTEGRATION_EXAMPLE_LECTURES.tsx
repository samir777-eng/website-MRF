// EXAMPLE: How to integrate authentication with the Lectures page
// This file shows the changes needed to add auth to src/app/ar/lectures/page.tsx

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Lock,
  Play,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

// ✅ ADD: Import authentication hooks
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

type GradeLevel = '1' | '2' | '3';
type LectureStatus = 'upcoming' | 'current' | 'past' | 'locked';

interface Lecture {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  gradeLevel: GradeLevel;
  scheduledDate: Date;
  startTime: string;
  duration: number;
  status: LectureStatus;
  requiresPreviousQuiz: boolean;
  totalLessons: number;
  estimatedDuration: number;
  enrolledStudents: number;
}

// ✅ CHANGE: Separate content component
function LecturesPageContent() {
  // ✅ ADD: Get user from auth context
  const { user } = useAuth();
  const { hasActiveSubscription, isSubscriptionExpiringSoon, getDaysUntilExpiry } = useAccessControl();
  
  // ✅ CHANGE: Get grade from authenticated user instead of hardcoded
  const userGrade: GradeLevel = user?.gradeLevel || '1';
  
  const [selectedStatus, setSelectedStatus] = useState<LectureStatus | 'all'>('all');
  const [currentWeek, setCurrentWeek] = useState(5);

  // Mock data - In production, fetch from API with user's grade
  // GET /api/lectures?gradeLevel={userGrade}
  const allLectures: Lecture[] = [
    {
      id: '1',
      title: 'مقدمة في النحو العربي',
      description: 'أساسيات النحو والإعراب',
      weekNumber: 1,
      gradeLevel: '1',
      scheduledDate: new Date('2025-01-05'),
      startTime: '18:00',
      duration: 90,
      status: 'past',
      requiresPreviousQuiz: false,
      totalLessons: 4,
      estimatedDuration: 120,
      enrolledStudents: 245,
    },
    // ... more lectures
  ];

  // ✅ CRITICAL: Filter lectures by user's grade
  const gradeLectures = allLectures.filter(
    lecture => lecture.gradeLevel === userGrade
  );

  const filteredLectures = selectedStatus === 'all'
    ? gradeLectures
    : gradeLectures.filter(lecture => lecture.status === selectedStatus);

  // ✅ ADD: Subscription expiry warning
  const showExpiryWarning = isSubscriptionExpiringSoon();
  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ✅ ADD: Subscription expiry warning */}
        {showExpiryWarning && (
          <Card className="border-0 shadow-lg mb-6 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  اشتراكك على وشك الانتهاء!
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  متبقي {daysUntilExpiry} يوم. جدد اشتراكك الآن لتجنب انقطاع الوصول.
                </p>
              </div>
              <Link href="/ar/subscription">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  تجديد الآن
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">المحاضرات الأسبوعية</h1>
              <p className="text-muted-foreground text-lg">
                محاضرة جديدة كل أسبوع في اللغة العربية
              </p>
            </div>
            {/* ✅ ADD: Display user's grade */}
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-4 py-2">
              <GraduationCap className="w-5 h-5 ml-2" />
              الصف {userGrade === '1' ? 'الأول' : userGrade === '2' ? 'الثاني' : 'الثالث'} الثانوي
            </Badge>
          </div>

          {/* ✅ ADD: Grade isolation info banner */}
          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>ملاحظة:</strong> يتم عرض المحاضرات الخاصة بصفك الدراسي فقط.
                  المحاضرات الخاصة بالصفوف الأخرى غير متاحة.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                disabled={currentWeek === 1}
              >
                <ChevronRight className="w-5 h-5" />
                الأسبوع السابق
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">الأسبوع الحالي</p>
                <p className="text-3xl font-bold">{currentWeek}</p>
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                الأسبوع التالي
                <ChevronLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Filter */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">تصفية حسب الحالة:</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'الكل' },
                  { value: 'current', label: 'جارية' },
                  { value: 'upcoming', label: 'قادمة' },
                  { value: 'past', label: 'سابقة' },
                  { value: 'locked', label: 'مغلقة' },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedStatus === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus(filter.value as LectureStatus | 'all')}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <Card
              key={lecture.id}
              className="border-0 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <CardContent className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={
                      lecture.status === 'current'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : lecture.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                        : lecture.status === 'past'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }
                  >
                    {lecture.status === 'current' && '● جارية'}
                    {lecture.status === 'upcoming' && '○ قادمة'}
                    {lecture.status === 'past' && '✓ منتهية'}
                    {lecture.status === 'locked' && '🔒 مغلقة'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    الأسبوع {lecture.weekNumber}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-2">{lecture.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {lecture.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      {lecture.scheduledDate.toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>{lecture.duration} دقيقة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span>{lecture.totalLessons} دروس</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>{lecture.enrolledStudents}</span>
                  </div>
                </div>

                {/* Action Button */}
                {lecture.status === 'locked' ? (
                  <Button disabled className="w-full" variant="outline">
                    <Lock className="w-4 h-4 ml-2" />
                    مغلقة
                  </Button>
                ) : (
                  <Link href={`/ar/lectures/${lecture.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Play className="w-4 h-4 ml-2" />
                      {lecture.status === 'past' ? 'مراجعة' : 'بدء المحاضرة'}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredLectures.length === 0 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">لا توجد محاضرات</h3>
              <p className="text-muted-foreground">
                لا توجد محاضرات متاحة حالياً لهذا الفلتر
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ✅ ADD: Wrap with ProtectedRoute
export default function LecturesPage() {
  return (
    <ProtectedRoute requireAuth={true} requireSubscription={true}>
      <LecturesPageContent />
    </ProtectedRoute>
  );
}

