"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "framer-motion";
import {
  Award,
  BookOpen,
  Brain,
  Clock,
  Users,
  Trophy,
  Target,
  Lightbulb,
} from "lucide-react";
import { useRef } from "react";

interface CompetitiveAdvantage {
  icon: React.ElementType;
  title: string;
  description: string;
  competitor?: string;
  advantage: string;
  color: string;
}

const advantages: CompetitiveAdvantage[] = [
  {
    icon: Brain,
    title: "فهم حقيقي، ليس مجرد تبسيط",
    description: "نحن نعلم الفهم العميق، ليس مجرد حفظ المعلومات المبسطة",
    competitor: "بسطتهالك",
    advantage: "الفهم العميق مقابل التبسيط السطحي",
    color: "bg-blue-50 border-blue-200 text-blue-800",
  },
  {
    icon: Users,
    title: "فريق متكامل من الخبراء",
    description: "20+ أستاذ متخصص مقابل مدرس واحد في جميع المواد",
    competitor: "خالد صقر",
    advantage: "فريق متخصص مقابل مدرس واحد",
    color: "bg-green-50 border-green-200 text-green-800",
  },
  {
    icon: Trophy,
    title: "إنجليزي مهني للوظائف",
    description: "IELTS، TOEFL، إنجليزي الأعمال - ليس مجرد محادثة عادية",
    competitor: "محمد صلاح",
    advantage: "شهادات معتمدة مقابل دروس غير رسمية",
    color: "bg-purple-50 border-purple-200 text-purple-800",
  },
  {
    icon: Clock,
    title: "31 عاماً من الخبرة المثبتة",
    description: "عقود من النتائج المُثبتة، ليس تجربة حديثة",
    competitor: "المنافسين الجدد",
    advantage: "خبرة عقود مقابل شركات ناشئة",
    color: "bg-amber-50 border-amber-200 text-amber-800",
  },
  {
    icon: BookOpen,
    title: "منهج شامل متكامل",
    description: "جميع المواد في منصة واحدة مع مسار تعليمي واضح",
    advantage: "حل شامل مقابل مواد منفصلة",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
  },
  {
    icon: Target,
    title: "تفاعل حقيقي مباشر",
    description: "جلسات مباشرة وأسئلة فورية، ليس مجرد فيديوهات مسجلة",
    advantage: "تعلم تفاعلي مقابل مشاهدة سلبية",
    color: "bg-red-50 border-red-200 text-red-800",
  },
];

export function CompetitiveAdvantagesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            لماذا الفاروق؟
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            نحن مختلفون عن الباقي
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            31 عاماً من الخبرة المثبتة تجعلنا الخيار الأول للتعليم عن بُعد في
            مصر
          </p>
        </div>

        {/* Competitive Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card
                key={index}
                className={`
                  group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm
                  ${isInView ? "animate-in slide-in-from-bottom-8 duration-700" : "opacity-0"}
                `}
                style={{
                  animationDelay: isInView ? `${index * 150}ms` : "0ms",
                  animationFillMode: "both",
                }}
              >
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`
                      inline-flex items-center justify-center w-14 h-14 rounded-xl 
                      ${advantage.color} group-hover:scale-110 transition-transform duration-300
                    `}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {advantage.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {advantage.description}
                    </p>

                    {/* Competitive Advantage Highlight */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            ميزتنا التنافسية:
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {advantage.advantage}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Badge */}
                    {advantage.competitor && (
                      <div className="mt-4">
                        <Badge
                          variant="outline"
                          className="text-xs px-3 py-1 bg-gray-50 text-gray-600 border-gray-200"
                        >
                          مقارنة مع: {advantage.competitor}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
            <Award className="w-5 h-5" />
            <span className="font-medium">اختبر الفرق بنفسك - ابدأ مجاناً</span>
          </div>
        </div>
      </div>
    </section>
  );
}
