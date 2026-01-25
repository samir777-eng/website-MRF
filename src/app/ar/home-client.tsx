"use client";

import { HeroSection } from "@/components/sections/hero-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HomepageSkeleton } from "@/components/loading/skeletons/HomepageSkeleton";
import { ArrowLeft, BookOpen, CheckCircle, Play, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  comparisonData,
  faqData,
  featuresData,
  gradeSelectionData,
  howItWorksSteps,
  testimonialsData,
} from "./landing-data";

export default function ArabicHomeClient() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("/ar/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show skeleton while checking auth (prevents flash)
  if (isChecking) {
    return <HomepageSkeleton />;
  }
  return (
    <div className="min-h-screen" dir="rtl">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. How It Works Section */}
      <section className="py-16 md:py-20 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              كيف تبدأ؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ثلاث خطوات بسيطة نحو التفوق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center group">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">
                    الخطوة {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Grade Selection Section */}
      <section className="py-16 md:py-20 page-background" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              اختر صفك الدراسي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              منهج مخصص لكل صف مع مسارات تعلم شخصية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto overflow-visible">
            {gradeSelectionData.map((item) => (
              <Card
                key={item.gradeId}
                className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${item.bgColor} hover:scale-[1.02] overflow-visible`}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {item.grade}
                  </CardTitle>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.students}
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {item.progress}% معدل النجاح
                      </span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <Link href={`/ar/signup?grade=${item.gradeId}`}>
                      <Button className="w-full" size="lg">
                        <Play className="w-5 h-5 ml-2" />
                        ابدأ التعلم
                        <ArrowLeft className="w-5 h-5 mr-2 rtl:-scale-x-100" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="py-16 md:py-20 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              مميزات المنصة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تجربة تعليمية متكاملة مع أحدث التقنيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto overflow-visible">
            {featuresData.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.bgColor} hover:scale-[1.02] overflow-visible`}
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-16 md:py-20 page-background" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              قصص نجاح طلابنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              شاهد كيف غيرت منصتنا حياة آلاف الطلاب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonialsData.map((student, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-card"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${student.avatarColor} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {student.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.grade}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                      {student.improvement} تحسن
                    </span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                      {student.score} النتيجة
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-muted-foreground italic leading-relaxed">
                    &ldquo;{student.testimonial}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Comparison Section */}
      <section className="py-16 md:py-20 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              لماذا تختار منصتنا؟
            </h2>
          </div>

          <Card className="border-0 shadow-xl max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Traditional */}
                <div className="p-8 bg-red-50 dark:bg-red-950/20">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {comparisonData.traditional.title}
                    </h3>
                    <p className="text-red-600 dark:text-red-400 font-bold text-lg mt-1">
                      {comparisonData.traditional.subtitle}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {comparisonData.traditional.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div className="p-8 bg-green-50 dark:bg-green-950/20">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Rocket className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {comparisonData.platform.title}
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-bold text-lg mt-1">
                      {comparisonData.platform.subtitle}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {comparisonData.platform.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-foreground text-sm font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. FAQ Section with Accordion */}
      <section className="py-16 md:py-20 page-background" dir="rtl">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              الأسئلة الشائعة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-xl border-0 shadow-sm px-6"
                >
                  <AccordionTrigger className="text-right font-bold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section
        className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-primary/5 to-background"
        dir="rtl"
      >
        <div className="container mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            ابدأ رحلة التفوق اليوم
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            انضم إلى آلاف الطلاب الذين حققوا أحلامهم مع منصتنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center overflow-visible">
            <Link href="/ar/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-6 h-6 ml-2" />
                سجل مجاناً الآن
                <ArrowLeft className="w-6 h-6 mr-2 rtl:-scale-x-100" />
              </Button>
            </Link>
            <Link href="/ar/courses">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="w-5 h-5 ml-2" />
                تصفح الدروس
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
