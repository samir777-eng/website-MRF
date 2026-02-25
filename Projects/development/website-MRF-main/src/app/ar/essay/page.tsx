"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Lightbulb,
  Play,
  Star,
} from "lucide-react";
import { useState } from "react";

const ESSAY_TYPES = [
  {
    id: "descriptive",
    titleAr: "التعبير الوصفي",
    descriptionAr: "وصف الأشخاص والأماكن والأشياء",
    lessons: 8,
    examples: 12,
    icon: Eye,
  },
  {
    id: "narrative",
    titleAr: "التعبير القصصي",
    descriptionAr: "سرد الأحداث والقصص",
    lessons: 6,
    examples: 10,
    icon: BookOpen,
  },
  {
    id: "argumentative",
    titleAr: "التعبير الحجاجي",
    descriptionAr: "عرض الآراء والحجج",
    lessons: 10,
    examples: 15,
    icon: Lightbulb,
  },
  {
    id: "functional",
    titleAr: "التعبير الوظيفي",
    descriptionAr: "الرسائل والتقارير",
    lessons: 7,
    examples: 9,
    icon: FileText,
  },
];

const SAMPLE_ESSAYS = [
  {
    id: "1",
    titleAr: "وصف فصل الربيع",
    type: "descriptive",
    typeAr: "وصفي",
    grade: "1",
    rating: 4.9,
    views: 5420,
    excerpt: "الربيع فصل الجمال والبهجة، حيث تتفتح الأزهار وتغرد الطيور...",
  },
  {
    id: "2",
    titleAr: "رحلة إلى الإسكندرية",
    type: "narrative",
    typeAr: "قصصي",
    grade: "2",
    rating: 4.8,
    views: 4850,
    excerpt:
      "في صباح يوم جميل، انطلقنا في رحلة ممتعة إلى عروس البحر المتوسط...",
  },
  {
    id: "3",
    titleAr: "أهمية التعليم",
    type: "argumentative",
    typeAr: "حجاجي",
    grade: "3",
    rating: 5.0,
    views: 7230,
    excerpt: "التعليم هو السلاح الأقوى الذي يمكن استخدامه لتغيير العالم...",
  },
];

const WRITING_TIPS = [
  {
    titleAr: "المقدمة الجذابة",
    descriptionAr: "ابدأ بمقدمة تجذب انتباه القارئ وتوضح الموضوع",
  },
  {
    titleAr: "التنظيم والترتيب",
    descriptionAr: "نظم أفكارك في فقرات واضحة ومترابطة",
  },
  {
    titleAr: "استخدام الأمثلة",
    descriptionAr: "دعم أفكارك بأمثلة واقعية ومقنعة",
  },
  {
    titleAr: "اللغة السليمة",
    descriptionAr: "استخدم لغة عربية فصيحة وخالية من الأخطاء",
  },
  {
    titleAr: "الخاتمة القوية",
    descriptionAr: "اختم موضوعك بخلاصة واضحة ومؤثرة",
  },
];

export default function EssayWritingPage() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredEssays =
    selectedType === "all"
      ? SAMPLE_ESSAYS
      : SAMPLE_ESSAYS.filter((e) => e.type === selectedType);

  return (
    <div className="min-h-screen page-bg-green">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">التعبير</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            تعلم فن كتابة التعبير وأتقن جميع أنواعه
          </p>
        </div>

        {/* Essay Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ESSAY_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{type.titleAr}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {type.descriptionAr}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>{type.lessons} دروس</span>
                    <span>{type.examples} مثال</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="examples">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="examples">أمثلة نموذجية</TabsTrigger>
            <TabsTrigger value="tips">نصائح الكتابة</TabsTrigger>
            <TabsTrigger value="practice">تدريبات</TabsTrigger>
          </TabsList>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEssays.map((essay) => (
                <Card
                  key={essay.id}
                  className="hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{essay.typeAr}</Badge>
                      <Badge variant="outline">الصف {essay.grade}</Badge>
                    </div>
                    <CardTitle className="text-lg">{essay.titleAr}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {essay.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {essay.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {essay.views.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <BookOpen className="w-4 h-4 ms-2" />
                        قراءة
                      </Button>
                      <Button variant="outline" size="icon" aria-label="تحميل">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WRITING_TIPS.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-green-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {tip.titleAr}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {tip.descriptionAr}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Video Tutorial */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>شاهد: كيف تكتب موضوع تعبير متميز</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950 rounded-lg flex items-center justify-center">
                  <Button size="lg">
                    <Play className="w-6 h-6 ms-2" />
                    مشاهدة الفيديو
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Card key={num} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge>تدريب {num}</Badge>
                      <Badge variant="outline">30 دقيقة</Badge>
                    </div>
                    <CardTitle className="text-lg">
                      اكتب موضوعاً عن:{" "}
                      {num === 1
                        ? "أهمية القراءة"
                        : num === 2
                          ? "فصل الصيف"
                          : num === 3
                            ? "رحلة لا تنسى"
                            : num === 4
                              ? "التكنولوجيا في حياتنا"
                              : num === 5
                                ? "الصداقة"
                                : "حلم المستقبل"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <FileText className="w-4 h-4 ms-2" />
                      ابدأ الكتابة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
