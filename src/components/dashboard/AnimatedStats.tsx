"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Brain,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

export function AnimatedStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats: StatItem[] = [
    {
      label: "الدروس المكتملة",
      value: 47,
      suffix: " درس",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      trend: 12,
    },
    {
      label: "الاختبارات المنجزة",
      value: 32,
      suffix: " اختبار",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      trend: 8,
    },
    {
      label: "ساعات الدراسة",
      value: 156,
      suffix: " ساعة",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
      trend: 15,
    },
    {
      label: "معدل النجاح",
      value: 92,
      suffix: "%",
      icon: Target,
      color: "from-orange-500 to-red-500",
      trend: 5,
    },
    {
      label: "الإنجازات",
      value: 18,
      suffix: " إنجاز",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      trend: 3,
    },
    {
      label: "نقاط الخبرة",
      value: 8450,
      suffix: " XP",
      icon: Zap,
      color: "from-indigo-500 to-purple-500",
      trend: 450,
    },
    {
      label: "الترتيب",
      value: 7,
      prefix: "#",
      icon: Award,
      color: "from-pink-500 to-rose-500",
      trend: -2, // Negative means improved ranking
    },
    {
      label: "أيام متتالية",
      value: 23,
      suffix: " يوم",
      icon: TrendingUp,
      color: "from-teal-500 to-cyan-500",
      trend: 1,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <AnimatedStatCard
          key={index}
          stat={stat}
          delay={index * 100}
          mounted={mounted}
        />
      ))}
    </div>
  );
}

interface AnimatedStatCardProps {
  stat: StatItem;
  delay: number;
  mounted: boolean;
}

function AnimatedStatCard({ stat, delay, mounted }: AnimatedStatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return;

    // Intersection Observer for animation trigger
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = stat.value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep));
      } else {
        setCount(stat.value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  const Icon = stat.icon;
  const trendIsPositive =
    stat.label === "الترتيب"
      ? (stat.trend || 0) < 0 // For ranking, negative is good
      : (stat.trend || 0) > 0;

  return (
    <Card
      ref={cardRef}
      className={`border-0 shadow-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {stat.trend !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${
                trendIsPositive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${!trendIsPositive && "rotate-180"}`}
              />
              {Math.abs(stat.trend)}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">
            {stat.prefix}
            {count.toLocaleString("ar-EG")}
            {stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {stat.label}
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-2000 ease-out`}
            style={{
              width: isVisible ? "100%" : "0%",
              transitionDelay: `${delay}ms`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default AnimatedStats;
