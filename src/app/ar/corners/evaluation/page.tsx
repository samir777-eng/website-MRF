"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ChevronDown, ChevronUp, LineChart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock mastery data
const topics = [
  {
    id: "nahw",
    name: "النحو",
    mastery: 78,
    color: "bg-blue-500",
    subtopics: [
      { name: "الفاعل والمفعول به", mastery: 92 },
      { name: "المبتدأ والخبر", mastery: 85 },
      { name: "الحال والتمييز", mastery: 65 },
      { name: "الإضافة", mastery: 70 },
    ],
  },
  {
    id: "balagha",
    name: "البلاغة",
    mastery: 65,
    color: "bg-purple-500",
    subtopics: [
      { name: "التشبيه", mastery: 80 },
      { name: "الاستعارة", mastery: 55 },
      { name: "الكناية", mastery: 60 },
    ],
  },
  {
    id: "qissa",
    name: "القصة",
    mastery: 88,
    color: "bg-green-500",
    subtopics: [
      { name: "تحليل الشخصيات", mastery: 90 },
      { name: "الحبكة الدرامية", mastery: 85 },
    ],
  },
  {
    id: "adab",
    name: "الأدب",
    mastery: 72,
    color: "bg-amber-500",
    subtopics: [
      { name: "الشعر الجاهلي", mastery: 78 },
      { name: "الشعر العباسي", mastery: 70 },
      { name: "النثر", mastery: 68 },
    ],
  },
  {
    id: "qiraa",
    name: "القراءة",
    mastery: 80,
    color: "bg-teal-500",
    subtopics: [
      { name: "فهم المقروء", mastery: 85 },
      { name: "التحليل النقدي", mastery: 75 },
    ],
  },
];

function getMasteryColor(mastery: number) {
  if (mastery >= 80) return "text-green-600 dark:text-green-400";
  if (mastery >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function EvaluationCornerPage() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const overallMastery = Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length);

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950 pb-24 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ar/corners">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ركن التقييم</h1>
                <p className="text-sm text-muted-foreground">{topics.length} مواضيع</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="border-purple-500/20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-foreground">الإتقان الكلي</span>
              </div>
              <span className={`text-3xl font-bold ${getMasteryColor(overallMastery)}`}>
                {overallMastery}%
              </span>
            </div>
            <Progress value={overallMastery} className="h-3" />
          </CardContent>
        </Card>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-3 h-12 rounded-full ${topic.color}`} />
                  <div className="flex-1 text-start">
                    <div className="font-semibold text-foreground">{topic.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {topic.subtopics.length} مواضيع فرعية
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getMasteryColor(topic.mastery)}`}>
                    {topic.mastery}%
                  </div>
                  {expandedTopic === topic.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedTopic === topic.id && (
                  <div className="px-5 pb-5 pt-2 border-t space-y-3">
                    {topic.subtopics.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground mb-1">{sub.name}</div>
                          <Progress value={sub.mastery} className="h-2" />
                        </div>
                        <span className={`text-sm font-semibold ${getMasteryColor(sub.mastery)}`}>
                          {sub.mastery}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

