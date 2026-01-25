"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Star } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { CURRENT_LESSON, TEXT } from "../dashboard-data";

function ContinueLearningCardComponent() {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 -translate-x-20" />
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Play className="w-6 h-6" />
          {TEXT.continueLearningTitle}
        </CardTitle>
        <CardDescription className="text-blue-100">
          {TEXT.continueLearningDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                {CURRENT_LESSON.title}
              </h3>
              <p className="text-blue-100">{CURRENT_LESSON.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Star className="w-3 h-3 ml-1" />+{CURRENT_LESSON.xpReward}{" "}
                  نقطة عند الإكمال
                </Badge>
              </div>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold mb-1">
                %{CURRENT_LESSON.progress}
              </div>
              <div className="text-blue-100">مكتمل</div>
            </div>
          </div>
          <Progress
            value={CURRENT_LESSON.progress}
            size="lg"
            className="bg-blue-400"
          />
          <Link href="/ar/lectures">
            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              تابع الدرس واكسب النقاط
              <Play className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export const ContinueLearningCard = memo(ContinueLearningCardComponent);
