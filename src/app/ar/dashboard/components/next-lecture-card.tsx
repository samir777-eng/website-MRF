"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  FileQuestion,
  Heart,
  Play,
  Video,
} from "lucide-react";
import Link from "next/link";
import { memo } from "react";

type LectureStep = "pre-quiz" | "videos" | "post-quiz" | "homework";

interface NextLectureData {
  id: string;
  lectureNumber: number;
  title: string;
  currentStep: LectureStep;
  stepProgress: number;
  daysRemaining: number;
  hoursRemaining: number;
  livesRemaining: number;
  maxLives: number;
  xpReward: number;
}

// Mock data - will be replaced with API
function getNextLecture(): NextLectureData {
  return {
    id: "5",
    lectureNumber: 5,
    title: "المبتدأ والخبر",
    currentStep: "videos",
    stepProgress: 40,
    daysRemaining: 5,
    hoursRemaining: 12,
    livesRemaining: 3,
    maxLives: 3,
    xpReward: 150,
  };
}

const stepConfig: Record<LectureStep, { label: string; icon: typeof Play; color: string; action: string; href: string }> = {
  "pre-quiz": {
    label: "الاختبار القبلي",
    icon: FileQuestion,
    color: "from-amber-500 to-orange-600",
    action: "ابدأ الاختبار",
    href: "/pre-quiz",
  },
  "videos": {
    label: "الفيديوهات",
    icon: Video,
    color: "from-blue-500 to-cyan-600",
    action: "شاهد الفيديو",
    href: "",
  },
  "post-quiz": {
    label: "الاختبار البعدي",
    icon: ClipboardList,
    color: "from-purple-500 to-pink-600",
    action: "ابدأ الاختبار",
    href: "/post-quiz",
  },
  "homework": {
    label: "الواجب",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600",
    action: "ابدأ الواجب",
    href: "/homework",
  },
};

function NextLectureCardComponent() {
  const lecture = getNextLecture();
  const step = stepConfig[lecture.currentStep];
  const StepIcon = step.icon;
  const actionHref = `/ar/lectures/${lecture.id}${step.href}`;

  return (
    <Card className={`border-0 shadow-xl bg-gradient-to-br ${step.color} text-white overflow-hidden relative`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 -translate-x-20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0">
                  محاضرة {lecture.lectureNumber}
                </Badge>
                <Badge className="bg-white/20 text-white border-0">
                  <StepIcon className="w-3 h-3 ms-1" />
                  {step.label}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold">{lecture.title}</h3>
            </div>
            {/* Lives display */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                {[...Array(lecture.maxLives)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < lecture.livesRemaining ? "fill-white text-white" : "text-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <Clock className="w-3 h-3" />
                <span>{lecture.daysRemaining}ي {lecture.hoursRemaining}س</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>تقدم المحاضرة</span>
              <span className="font-medium">{lecture.stepProgress}%</span>
            </div>
            <Progress value={lecture.stepProgress} className="h-2 bg-white/30" />
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
            {(["pre-quiz", "videos", "post-quiz", "homework"] as LectureStep[]).map((s, i) => {
              const isComplete = 
                (lecture.currentStep === "videos" && s === "pre-quiz") ||
                (lecture.currentStep === "post-quiz" && (s === "pre-quiz" || s === "videos")) ||
                (lecture.currentStep === "homework" && s !== "homework");
              const isCurrent = s === lecture.currentStep;
              const Icon = stepConfig[s].icon;

              return (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete ? "bg-white text-green-600" :
                    isCurrent ? "bg-white text-gray-900" :
                    "bg-white/20 text-white/60"
                  }`}>
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  {i < 3 && <div className={`w-6 md:w-10 h-0.5 ${isComplete ? "bg-white" : "bg-white/20"}`} />}
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <Link href={actionHref}>
            <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold">
              {step.action}
              <ArrowLeft className="w-5 h-5 me-2 rtl:-scale-x-100" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export const NextLectureCard = memo(NextLectureCardComponent);

