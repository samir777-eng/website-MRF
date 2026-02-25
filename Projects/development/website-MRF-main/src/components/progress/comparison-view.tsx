import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonData {
  label: string;
  current: number;
  previous: number;
  unit?: string;
}

interface ComparisonViewProps {
  data: ComparisonData[];
  period: "week" | "month";
  className?: string;
}

export function ComparisonView({ data, period, className }: ComparisonViewProps) {
  const periodLabel = period === "week" ? "الأسبوع الماضي" : "الشهر الماضي";

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getMotivationalMessage = () => {
    const totalChange = data.reduce(
      (acc, item) => acc + getChangePercentage(item.current, item.previous),
      0
    );
    const avgChange = totalChange / data.length;

    if (avgChange > 20) return "أداء رائع! استمر في التقدم المذهل! 🎉";
    if (avgChange > 10) return "تحسن ملحوظ! أنت على الطريق الصحيح! 💪";
    if (avgChange > 0) return "تقدم جيد! استمر في المحاولة! 👍";
    if (avgChange === 0) return "حافظ على مستواك الحالي! 📊";
    return "لا تستسلم! كل يوم فرصة جديدة! 🌟";
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center p-4 bg-primary/10 rounded-lg">
        <p className="text-lg font-semibold">{getMotivationalMessage()}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">مقارنة مع {periodLabel}</h3>
        
        {data.map((item, index) => {
          const change = getChangePercentage(item.current, item.previous);
          const isPositive = change > 0;
          const isNegative = change < 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">
                  {item.previous} {item.unit} → {item.current} {item.unit}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getChangeIcon(change)}
                <span
                  className={cn(
                    "font-semibold",
                    isPositive && "text-green-500",
                    isNegative && "text-red-500"
                  )}
                >
                  {change > 0 && "+"}
                  {change.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

