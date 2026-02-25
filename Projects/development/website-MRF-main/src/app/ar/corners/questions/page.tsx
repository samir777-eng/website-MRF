"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  HelpCircle,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock questions data
const questions = [
  {
    id: 1,
    title: "ما الفرق بين الفاعل والمفعول به؟",
    lecture: "المحاضرة الأولى",
    category: "النحو",
    status: "answered",
    answers: 3,
    date: "منذ ساعتين",
  },
  {
    id: 2,
    title: "كيف أعرب الجملة الاسمية؟",
    lecture: "المحاضرة الثانية",
    category: "النحو",
    status: "pending",
    answers: 0,
    date: "منذ يوم",
  },
  {
    id: 3,
    title: "ما هي أنواع البلاغة الثلاثة؟",
    lecture: "المحاضرة الخامسة",
    category: "البلاغة",
    status: "answered",
    answers: 5,
    date: "منذ 3 أيام",
  },
  {
    id: 4,
    title: "شرح قصيدة المتنبي في الحكمة",
    lecture: "المحاضرة العاشرة",
    category: "الأدب",
    status: "pending",
    answers: 0,
    date: "منذ أسبوع",
  },
];

const lectures = ["الكل", "المحاضرة الأولى", "المحاضرة الثانية", "المحاضرة الخامسة", "المحاضرة العاشرة"];

export default function QuestionsCornerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("الكل");

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.includes(searchQuery);
    const matchesLecture = selectedLecture === "الكل" || q.lecture === selectedLecture;
    return matchesSearch && matchesLecture;
  });

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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ركن الأسئلة</h1>
                <p className="text-sm text-muted-foreground">{questions.length} سؤال</p>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
            <MessageCircle className="w-4 h-4 me-2" />
            اسأل سؤالاً
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن سؤال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <Select value={selectedLecture} onValueChange={setSelectedLecture}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="اختر المحاضرة" />
            </SelectTrigger>
            <SelectContent>
              {lectures.map((lecture) => (
                <SelectItem key={lecture} value={lecture}>{lecture}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${question.status === "answered" ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                    {question.status === "answered" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{question.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{question.lecture}</Badge>
                      <Badge variant="outline">{question.category}</Badge>
                      <span>•</span>
                      <span>{question.date}</span>
                      {question.answers > 0 && (
                        <>
                          <span>•</span>
                          <span>{question.answers} إجابات</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">عرض</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">لا توجد أسئلة</h2>
            <p className="text-muted-foreground">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}

