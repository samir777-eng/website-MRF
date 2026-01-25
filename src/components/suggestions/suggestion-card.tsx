import { Button } from "@/components/ui/button";
import { BookOpen, FileQuestion, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  type: "lesson" | "quiz" | "schedule";
  title: string;
  reason: string;
  priority: number;
  onAccept: () => void;
  className?: string;
}

const typeConfig = {
  lesson: {
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "درس مقترح",
  },
  quiz: {
    icon: FileQuestion,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "اختبار مقترح",
  },
  schedule: {
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "نصيحة دراسية",
  },
};

export function SuggestionCard({
  type,
  title,
  reason,
  priority,
  onAccept,
  className,
}: SuggestionCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border rounded-lg p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-sm font-medium", config.color)}>
              {config.label}
            </span>
            {priority === 1 && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                أولوية عالية
              </span>
            )}
          </div>

          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{reason}</p>

          <Button size="sm" onClick={onAccept} className="gap-2">
            {type === "lesson" && "ابدأ الدرس"}
            {type === "quiz" && "ابدأ الاختبار"}
            {type === "schedule" && "عرض التفاصيل"}
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

