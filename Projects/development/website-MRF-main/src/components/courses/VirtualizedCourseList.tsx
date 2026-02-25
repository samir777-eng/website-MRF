"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VirtualizedGrid } from "@/components/ui/virtualized-list";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  GraduationCap,
  Play,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  grade: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: string;
  level: string;
  progress: number;
  enrolled: boolean;
  certificate: boolean;
  features: string[];
  topics: string[];
  nextLesson: string | null;
  completionRate: number;
}

interface VirtualizedCourseListProps {
  courses: Course[];
  columns?: number;
  height?: number;
  className?: string;
}

export function VirtualizedCourseList({
  courses,
  columns = 2,
  height = 800,
  className,
}: VirtualizedCourseListProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ":
        return "border-green-500 text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400";
      case "متوسط":
        return "border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400";
      case "متقدم":
        return "border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400";
      default:
        return "border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-950/20 dark:text-gray-400";
    }
  };

  const renderCourseCard = (course: Course, _index: number) => (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 overflow-hidden hover:scale-[1.01] h-full">
      {/* Course Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <Badge variant="outline" className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-foreground">
                  {course.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({course.students.toLocaleString()} طالب)
                </span>
              </div>
            </div>
          </div>
          <div className="text-start">
            <div className="text-2xl font-bold text-green-600">
              {course.price}
            </div>
            {course.certificate && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm"
              >
                <Trophy className="w-3 h-3 ms-1" />
                شهادة معتمدة
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>بواسطة {course.instructor}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Play className="w-4 h-4" />
            <span>{course.lessons} درس</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()} طالب</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4" />
            <span>{course.completionRate}% إكمال</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {course.enrolled && course.progress > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">التقدم</span>
              <span className="font-bold text-foreground">
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {course.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {feature}
              </Badge>
            ))}
            {course.features.length > 3 && (
              <Badge variant="secondary" className="text-sm">
                +{course.features.length - 3} المزيد
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/ar/courses/${course.id}`}>
          <Button
            className={`w-full ${
              course.enrolled
                ? course.progress > 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            } text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
            aria-label={
              course.enrolled
                ? course.progress > 0
                  ? `متابعة الدورة - ${course.title}`
                  : `ابدأ الدورة - ${course.title}`
                : `التسجيل في الدورة - ${course.title}`
            }
          >
            {course.enrolled ? (
              course.progress > 0 ? (
                <>
                  <Play className="w-4 h-4 ms-2" aria-hidden="true" />
                  متابعة التعلم
                  <ArrowLeft className="w-4 h-4 me-2" aria-hidden="true" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 ms-2" aria-hidden="true" />
                  ابدأ الدورة
                  <ArrowLeft className="w-4 h-4 me-2" aria-hidden="true" />
                </>
              )
            ) : (
              <>
                <GraduationCap className="w-4 h-4 ms-2" aria-hidden="true" />
                التسجيل المجاني
                <ArrowLeft className="w-4 h-4 me-2" aria-hidden="true" />
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <VirtualizedGrid
      items={courses}
      renderItem={renderCourseCard}
      columns={columns}
      estimateSize={450} // Estimated height of each course card
      height={height}
      gap={32}
      className={className}
    />
  );
}

export default VirtualizedCourseList;
