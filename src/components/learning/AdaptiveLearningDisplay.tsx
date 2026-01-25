"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpacedRepetition } from "@/contexts/SpacedRepetitionContext";
import {
  AdaptivePath,
  LearningProfile,
  LearningRecommendation,
  MOCK_LEARNING_PROFILE,
  generateLearningPath,
  generateRecommendations,
} from "@/lib/adaptiveLearning";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  Eye,
  FileText,
  Hand,
  Headphones,
  Lightbulb,
  Settings,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AdaptiveLearningDisplayProps {
  variant?: "compact" | "detailed" | "dashboard";
  showRecommendations?: boolean;
  showLearningPaths?: boolean;
}

export default function AdaptiveLearningDisplay({
  variant = "compact",
  showRecommendations = true,
  showLearningPaths = true,
}: AdaptiveLearningDisplayProps) {
  const { reviewItems } = useSpacedRepetition();
  const [learningProfile] = useState<LearningProfile>(MOCK_LEARNING_PROFILE);
  const [recommendations, setRecommendations] = useState<
    LearningRecommendation[]
  >([]);
  const [adaptivePaths] = useState<AdaptivePath[]>([
    generateLearningPath(learningProfile, "نحو", 4),
    generateLearningPath(learningProfile, "بلاغة", 3),
  ]);

  // Generate recommendations on mount
  useEffect(() => {
    const mockRecentPerformance = [
      {
        accuracy: 72,
        subject: "نحو",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        accuracy: 85,
        subject: "بلاغة",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        accuracy: 68,
        subject: "تعبير",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    const recs = generateRecommendations(
      learningProfile,
      reviewItems,
      mockRecentPerformance
    );
    setRecommendations(recs);
  }, [reviewItems, learningProfile]);

  // Get learning style icon
  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case "visual":
        return <Eye className="w-4 h-4" />;
      case "auditory":
        return <Headphones className="w-4 h-4" />;
      case "kinesthetic":
        return <Hand className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  // Compact variant for sidebar
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            التعلم التكيفي
          </h3>
          <Badge variant="outline">{recommendations.length}</Badge>
        </div>

        <div className="space-y-2">
          {/* Learning Profile Summary */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getLearningStyleIcon(learningProfile.learningStyle)}
              <span className="text-sm font-medium text-purple-800">
                {learningProfile.learningStyle === "visual"
                  ? "بصري"
                  : learningProfile.learningStyle === "auditory"
                    ? "سمعي"
                    : learningProfile.learningStyle === "kinesthetic"
                      ? "حركي"
                      : learningProfile.learningStyle === "reading"
                        ? "قرائي"
                        : "مختلط"}
              </span>
            </div>
            <div className="text-sm text-purple-600">
              الدقة: {learningProfile.overallAccuracy.toFixed(0)}%
            </div>
          </div>

          {/* Top Recommendations */}
          {showRecommendations &&
            recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                className={`p-2 rounded-lg border ${
                  rec.priority === "high"
                    ? "border-orange-200 bg-orange-50 dark:bg-orange-950/20"
                    : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <Badge className={getPriorityColor(rec.priority)} size="sm">
                    {rec.priority === "high"
                      ? "عالي"
                      : rec.priority === "medium"
                        ? "متوسط"
                        : "منخفض"}
                  </Badge>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {rec.title}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {rec.description}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === "dashboard") {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            التعلم التكيفي
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Learning Profile Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {learningProfile.overallAccuracy.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">الدقة العامة</div>
            </div>

            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {learningProfile.strongAreas.length}
              </div>
              <div className="text-sm text-muted-foreground">مجالات قوية</div>
            </div>
          </div>

          {/* Learning Style */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              {getLearningStyleIcon(learningProfile.learningStyle)}
              <span className="font-medium text-purple-800">
                نمط التعلم:{" "}
                {learningProfile.learningStyle === "visual"
                  ? "بصري"
                  : learningProfile.learningStyle === "auditory"
                    ? "سمعي"
                    : learningProfile.learningStyle === "kinesthetic"
                      ? "حركي"
                      : learningProfile.learningStyle === "reading"
                        ? "قرائي"
                        : "مختلط"}
              </span>
            </div>
            <div className="text-sm text-purple-700">
              المستوى المفضل: {learningProfile.preferredDifficulty}/5 • الوتيرة:{" "}
              {learningProfile.studyPace === "slow"
                ? "بطيئة"
                : learningProfile.studyPace === "moderate"
                  ? "متوسطة"
                  : "سريعة"}
            </div>
          </div>

          {/* Top Recommendations */}
          {showRecommendations && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                التوصيات الشخصية
              </h4>

              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/10 rounded-xl"
                  >
                    <Badge className={getPriorityColor(rec.priority)} size="sm">
                      {rec.priority === "urgent"
                        ? "عاجل"
                        : rec.priority === "high"
                          ? "عالي"
                          : rec.priority === "medium"
                            ? "متوسط"
                            : "منخفض"}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {rec.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rec.reasoning}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas */}
          {learningProfile.weakAreas.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                المجالات التي تحتاج تحسين
              </h4>

              <div className="space-y-2">
                {learningProfile.weakAreas.slice(0, 2).map((area) => (
                  <div
                    key={area}
                    className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
                  >
                    <span className="text-sm font-medium text-orange-800">
                      {area}
                    </span>
                    <span className="text-sm text-orange-600">
                      {learningProfile.subjectAccuracies[area]?.toFixed(0) || 0}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Detailed variant for dedicated page
  return (
    <div className="space-y-6">
      {/* Learning Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {learningProfile.overallAccuracy.toFixed(0)}%
            </div>
            <div className="text-purple-100">الدقة العامة</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {learningProfile.strongAreas.length}
            </div>
            <div className="text-green-100">مجالات قوية</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {learningProfile.weakAreas.length}
            </div>
            <div className="text-orange-100">تحتاج تحسين</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {(learningProfile.consistencyScore * 100).toFixed(0)}%
            </div>
            <div className="text-blue-100">الثبات</div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              ملف التعلم الشخصي
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getLearningStyleIcon(learningProfile.learningStyle)}
                  <span className="text-sm font-medium">نمط التعلم</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {learningProfile.learningStyle === "visual"
                    ? "بصري"
                    : learningProfile.learningStyle === "auditory"
                      ? "سمعي"
                      : learningProfile.learningStyle === "kinesthetic"
                        ? "حركي"
                        : learningProfile.learningStyle === "reading"
                          ? "قرائي"
                          : "مختلط"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">المستوى المفضل</span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {learningProfile.preferredDifficulty}/5
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  وتيرة التعلم
                </span>
                <span className="font-medium">
                  {learningProfile.studyPace === "slow"
                    ? "بطيئة"
                    : learningProfile.studyPace === "moderate"
                      ? "متوسطة"
                      : "سريعة"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  مدة الجلسة المفضلة
                </span>
                <span className="font-medium">
                  {learningProfile.sessionLength === "short"
                    ? "10-15 دقيقة"
                    : learningProfile.sessionLength === "medium"
                      ? "15-30 دقيقة"
                      : "30-45 دقيقة"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  تكرار الجلسات
                </span>
                <span className="font-medium">
                  {learningProfile.sessionFrequency} مرات/أسبوع
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  مستوى الدافعية
                </span>
                <Badge
                  className={
                    learningProfile.motivationLevel === "high"
                      ? "bg-green-100 text-green-800"
                      : learningProfile.motivationLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {learningProfile.motivationLevel === "high"
                    ? "عالي"
                    : learningProfile.motivationLevel === "medium"
                      ? "متوسط"
                      : "منخفض"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              الأداء حسب المادة
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {Object.entries(learningProfile.subjectAccuracies).map(
              ([subject, accuracy]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {accuracy.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              التوصيات الشخصية ({recommendations.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 border-2 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === "urgent"
                        ? "عاجل"
                        : rec.priority === "high"
                          ? "عالي"
                          : rec.priority === "medium"
                            ? "متوسط"
                            : "منخفض"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        {(rec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  <p className="text-sm text-muted-foreground/80 mb-3">
                    {rec.reasoning}
                  </p>

                  {rec.actionable && (
                    <Button size="sm" className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      تطبيق التوصية
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Learning Paths */}
      {showLearningPaths && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              المسارات التعليمية المخصصة
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adaptivePaths.map((path) => (
                <div
                  key={path.id}
                  className="p-6 border-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">{path.name}</h3>
                    <Badge variant="outline">المستوى {path.difficulty}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {path.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        المدة المتوقعة
                      </span>
                      <span className="font-medium">
                        {path.estimatedDuration} يوم
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">المعالم</span>
                      <span className="font-medium">
                        {path.milestones.length} معلم
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">التقدم</span>
                        <span className="font-medium">
                          {path.completionRate.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={path.completionRate} className="h-2" />
                    </div>
                  </div>

                  <Button className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {path.completionRate > 0 ? "متابعة المسار" : "بدء المسار"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
