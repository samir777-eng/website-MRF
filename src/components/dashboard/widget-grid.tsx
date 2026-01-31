"use client";

import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
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
  const [layout, setLayout] = useState(
    widgets.map((widget, index) => ({
      i: widget.id,
      x: (index % 2) * 6,
      y: Math.floor(index / 2) * 4,
      w: widget.defaultSize.w,
      h: widget.defaultSize.h,
    })),
  );

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
    localStorage.setItem("dashboard_layout", JSON.stringify(newLayout));
  };

  return (
    <GridLayout
      className={cn("layout", className)}
      layout={layout}
      cols={12}
      rowHeight={80}
      width={1200}
      onLayoutChange={handleLayoutChange}
      isDraggable
      isResizable
      compactType="vertical"
      preventCollision={false}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="bg-card border rounded-lg p-4 overflow-auto"
        >
          <h3 className="font-semibold mb-4">{widget.title}</h3>
          {widget.component}
        </div>
      ))}
    </GridLayout>
  );
}

export default WidgetGrid;
