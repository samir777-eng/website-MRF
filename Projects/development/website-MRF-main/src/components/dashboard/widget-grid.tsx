"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultSize: { w: number; h: number };
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

interface WidgetGridProps {
  widgets: Widget[];
  onLayoutChange?: (layout: LayoutItem[]) => void;
  className?: string;
}

export function WidgetGrid({
  widgets,
  onLayoutChange,
  className,
}: WidgetGridProps) {
  // Simple grid layout using CSS Grid instead of react-grid-layout
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className,
      )}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="bg-card border rounded-lg p-4 overflow-auto min-h-[320px]"
        >
          <h3 className="font-semibold mb-4">{widget.title}</h3>
          {widget.component}
        </div>
      ))}
    </div>
  );
}

export default WidgetGrid;
