"use client";

import { cn } from "@/lib/utils";

interface ChartProps {
  data: { label: string; value: number }[];
  className?: string;
  type?: "bar" | "line";
}

export function Chart({ data, className, type: _type = "bar" }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
