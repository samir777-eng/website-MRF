"use client";

import { VirtualizedCourseList } from "@/components/courses/VirtualizedCourseList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PaginatedGrid } from "@/components/ui/paginated-list";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  GraduationCap,
  Play,
  Star,
  Target,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ArabicCoursesClient() {
  const [selectedGrade, setSelectedGrade] = useState("all");

  // Course action handlers
  const handleViewCurriculum = (courseTitle: string) => {
    alert(`عرض منهج: ${courseTitle}`);
  };

  const handlePreviewCourse = (courseTitle: string) => {
    alert(`معاينة: ${courseTitle}`);
  };

  const courses = [
    {
      id: 1,
      title: "النحو العربي الشامل",
      grade: "1",
      description:
        "دورة شاملة في النحو العربي تغطي جميع القواعد الأساسية والمتقدمة",
      instructor: "الأستاذ رضا الفاروق",
      duration: "12 أسبوع",
      lessons: 48,
      students: 2500,
      rating: 4.9,
      price: "مجاني",
      level: "مبتدئ إلى متقدم",
      progress: 65,
      enrolled: true,
      certificate: true,
      features: [
        "48 درس تفاعلي",
        "اختبارات أسبوعية",
        "شهادة معتمدة",
        "دعم مباشر",
      ],
      topics: [
        "الجملة الاسمية والفعلية",
        "الإعراب والبناء",
        "النواسخ",
        "المنصوبات",
        "المجرورات",
      ],
      nextLesson: "الدرس 31: المفعول المطلق",
      completionRate: 89,
    },
    {
      id: 2,
      title: "الأدب العربي عبر العصور",
      grade: "2",
      description:
        "رحلة شاملة عبر تاريخ الأدب العربي من الجاهلية حتى العصر الحديث",
      instructor: "الأستاذ رضا الفاروق",
      duration: "16 أسبوع",
      lessons: 64,
      students: 1800,
      rating: 4.8,
      price: "مجاني",
      level: "متوسط",
      progress: 0,
      enrolled: false,
      certificate: true,
      features: [
        "64 درس تفاعلي",
        "تحليل النصوص",
        "شهادة معتمدة",
        "مكتبة رقمية",
      ],
      topics: [
        "الشعر الجاهلي",
        "الأدب الإسلامي",
        "الأدب الأندلسي",
        "الأدب الحديث",
        "النقد الأدبي",
      ],
      nextLesson: null,
      completionRate: 76,
    },
    {
      id: 3,
      title: "البلاغة العربية التطبيقية",
      grade: "3",
      description:
        "تعلم فنون البلاغة العربية مع التطبيق العملي على النصوص الأدبية",
      instructor: "الأستاذ رضا الفاروق",
      duration: "10 أسبوع",
      lessons: 40,
      students: 1200,
      rating: 4.7,
      price: "مجاني",
      level: "متقدم",
      progress: 25,
      enrolled: true,
      certificate: true,
      features: ["40 درس تطبيقي", "تحليل بلاغي", "شهادة معتمدة", "ورش عملية"],
      topics: [
        "علم البيان",
        "علم المعاني",
        "علم البديع",
        "التطبيق على النصوص",
        "الإعجاز البلاغي",
      ],
      nextLesson: "الدرس 11: الاستعارة التصريحية",
      completionRate: 82,
    },
    {
      id: 4,
      title: "مهارات القراءة والفهم",
      grade: "1",
      description: "تطوير مهارات القراءة النقدية والفهم العميق للنصوص المختلفة",
      instructor: "الأستاذ رضا الفاروق",
      duration: "8 أسبوع",
      lessons: 32,
      students: 2200,
      rating: 4.6,
      price: "مجاني",
      level: "مبتدئ إلى متوسط",
      progress: 0,
      enrolled: false,
      certificate: true,
      features: ["32 درس تفاعلي", "نصوص متنوعة", "شهادة معتمدة", "تقييم مستمر"],
      topics: [
        "استراتيجيات القراءة",
        "الفهم الحرفي",
        "الفهم الاستنتاجي",
        "النقد والتحليل",
        "القراءة السريعة",
      ],
      nextLesson: null,
      completionRate: 91,
    },
    {
      id: 5,
      title: "فن الكتابة والتعبير",
      grade: "2",
      description: "إتقان فنون الكتابة العربية والتعبير الإبداعي والوظيفي",
      instructor: "الأستاذ رضا الفاروق",
      duration: "12 أسبوع",
      lessons: 48,
      students: 1500,
      rating: 4.8,
      price: "مجاني",
      level: "متوسط إلى متقدم",
      progress: 40,
      enrolled: true,
      certificate: true,
      features: ["48 درس عملي", "تطبيقات كتابية", "شهادة معتمدة", "تصحيح فردي"],
      topics: [
        "المقال",
        "القصة القصيرة",
        "الرسائل الرسمية",
        "التلخيص",
        "الإبداع الأدبي",
      ],
      nextLesson: "الدرس 20: كتابة المقال الأدبي",
      completionRate: 85,
    },
    {
      id: 6,
      title: "الإملاء والخط العربي",
      grade: "1",
      description: "إتقان قواعد الإملاء العربي وتحسين الخط العربي",
      instructor: "الأستاذ رضا الفاروق",
      duration: "6 أسبوع",
      lessons: 24,
      students: 1800,
      rating: 4.5,
      price: "مجاني",
      level: "مبتدئ",
      progress: 0,
      enrolled: false,
      certificate: true,
      features: [
        "24 درس تطبيقي",
        "تمارين يومية",
        "شهادة معتمدة",
        "متابعة فردية",
      ],
      topics: [
        "قواعد الإملاء",
        "الهمزة",
        "التاء المربوطة والمفتوحة",
        "الخط النسخ",
        "الخط الرقعة",
      ],
      nextLesson: null,
      completionRate: 94,
    },
  ];

  const filteredCourses = courses.filter(
    (course) => selectedGrade === "all" || course.grade === selectedGrade,
  );

  const getLevelColor = (level: string) => {
    if (level.includes("مبتدئ"))
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
    if (level.includes("متوسط"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
    if (level.includes("متقدم"))
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    return "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
  };

  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            كتالوج الدورات التعليمية
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من الدورات التعليمية المتخصصة في اللغة العربية
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {courses.length}
              </div>
              <div className="text-blue-600 font-medium">دورة متاحة</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {courses
                  .reduce((sum, course) => sum + course.students, 0)
                  .toLocaleString()}
              </div>
              <div className="text-green-600 font-medium">طالب مسجل</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {courses.filter((c) => c.enrolled).length}
              </div>
              <div className="text-purple-600 font-medium">دورة مسجل بها</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-700 mb-1">
                {Math.round(
                  courses.reduce(
                    (sum, course) => sum + course.completionRate,
                    0,
                  ) / courses.length,
                )}
                %
              </div>
              <div className="text-orange-600 font-medium">معدل الإكمال</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">تصفية حسب الصف:</span>
                </div>

                <div className="flex gap-2">
                  {["all", "1", "2", "3"].map((grade) => (
                    <Button
                      key={grade}
                      variant={selectedGrade === grade ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGrade(grade)}
                      className="rounded-full"
                      data-testid="open-filters"
                      aria-label={`تصفية حسب ${grade === "all" ? "الكل" : `الصف ${grade}`}`}
                    >
                      {grade === "all"
                        ? "جميع الصفوف"
                        : `الصف ${grade} الثانوي`}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid - Use different strategies based on list size */}
        {filteredCourses.length > 50 ? (
          // Large lists: Use virtualization
          <VirtualizedCourseList
            courses={filteredCourses}
            columns={2}
            height={800}
            className="mb-8"
          />
        ) : filteredCourses.length > 6 ? (
          // Medium lists: Use pagination
          <PaginatedGrid
            items={filteredCourses}
            renderItem={(course) => (
              <Card
                key={course.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 overflow-hidden hover:scale-[1.01]"
              >
                {/* Course Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={getLevelColor(course.level)}
                        >
                          {course.level}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          الصف {course.grade} الثانوي
                        </div>
                      </div>
                    </div>

                    {course.enrolled && (
                      <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        مسجل
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-foreground leading-tight mb-2">
                    {course.title}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {course.description}
                  </p>

                  {/* Progress Bar for Enrolled Courses */}
                  {course.enrolled && course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">التقدم</span>
                        <span className="font-medium text-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      {course.nextLesson && (
                        <div className="text-sm text-muted-foreground mt-2">
                          التالي: {course.nextLesson}
                        </div>
                      )}
                    </div>
                  )}
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

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-current" : "text-zinc-300 dark:text-zinc-600"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {course.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({course.students} تقييم)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      مميزات الدورة:
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {course.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      المواضيع الرئيسية:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="text-sm bg-muted/50 text-muted-foreground px-2 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                      {course.topics.length > 3 && (
                        <span className="text-sm bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
                          +{course.topics.length - 3} المزيد
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="mb-6 p-3 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        ر.ف
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {course.instructor}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          مدرس خبير - 31 عام خبرة
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {course.enrolled ? (
                      <Link href={`/ar/courses/${course.id}`}>
                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-2xl text-base transition-all duration-300 hover:scale-[1.02] shadow-lg"
                          data-testid="continue-learning"
                          aria-label={
                            course.progress > 0 ? "متابعة التعلم" : "بدء الدورة"
                          }
                        >
                          <Play className="w-5 h-5 ms-2" />
                          {course.progress > 0 ? "متابعة التعلم" : "بدء الدورة"}
                          <ArrowLeft className="w-5 h-5 me-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/ar/signup?course=${course.id}`}>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-2xl text-base transition-all duration-300 hover:scale-[1.02] shadow-lg"
                          data-testid="enroll-course"
                          aria-label="التسجيل في الدورة"
                        >
                          <BookOpen className="w-5 h-5 ms-2" />
                          التسجيل في الدورة
                          <ArrowLeft className="w-5 h-5 me-2" />
                        </Button>
                      </Link>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        data-testid="view-curriculum"
                        aria-label="عرض المنهج"
                        onClick={() => handleViewCurriculum(course.title)}
                      >
                        <FileText className="w-4 h-4 ms-1" />
                        المنهج
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        data-testid="preview-course"
                        aria-label="معاينة الدورة"
                        onClick={() => handlePreviewCourse(course.title)}
                      >
                        <Video className="w-4 h-4 ms-1" />
                        معاينة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            itemsPerPage={6}
            columns={2}
            gridClassName="grid-cols-1 lg:grid-cols-2 gap-8"
            className="mb-8"
          />
        ) : (
          // Small lists: Render all items
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 overflow-hidden hover:scale-[1.01]"
              >
                {/* Course Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={getLevelColor(course.level)}
                        >
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
                    <div className="text-left">
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
                    <h2 className="text-2xl font-semibold leading-none tracking-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h2>
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
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-sm"
                        >
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

                  {/* Topics */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {course.topics.slice(0, 4).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={
                        course.enrolled
                          ? `/ar/courses/${course.id}`
                          : `/ar/signup?course=${course.id}`
                      }
                      className="flex-1"
                    >
                      <Button
                        className={`w-full ${
                          course.enrolled
                            ? course.progress > 0
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        } text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                        data-testid="enroll-course"
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
                              <Play className="w-4 h-4 ms-2" />
                              متابعة التعلم
                              <ArrowLeft className="w-4 h-4 me-2" />
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 ms-2" />
                              ابدأ الدورة
                              <ArrowLeft className="w-4 h-4 me-2" />
                            </>
                          )
                        ) : (
                          <>
                            <GraduationCap className="w-4 h-4 ms-2" />
                            التسجيل المجاني
                            <ArrowLeft className="w-4 h-4 me-2" />
                          </>
                        )}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      data-testid="preview-course"
                      aria-label="معاينة الدورة"
                      onClick={() => handlePreviewCourse(course.title)}
                    >
                      <Video className="w-4 h-4 ms-1" />
                      معاينة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              لا توجد دورات متاحة
            </h2>
            <p className="text-muted-foreground">
              جرب تغيير المرشحات للعثور على دورات أخرى
            </p>
          </div>
        )}

        {/* Learning Path Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                مسار التعلم المقترح
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    ابدأ بالأساسيات
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    النحو العربي الشامل + مهارات القراءة والفهم
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">طور مهاراتك</h3>
                  <p className="text-muted-foreground text-sm">
                    الأدب العربي + فن الكتابة والتعبير
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">أتقن التخصص</h3>
                  <p className="text-muted-foreground text-sm">
                    البلاغة العربية التطبيقية + الإملاء والخط
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
