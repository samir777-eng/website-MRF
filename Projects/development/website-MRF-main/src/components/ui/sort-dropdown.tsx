"use client";

import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  direction: "asc" | "desc";
  onChange: (value: string, direction: "asc" | "desc") => void;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  direction,
  onChange,
  className,
}: SortDropdownProps) {
  const currentOption = options.find((opt) => opt.value === value);

  const toggleDirection = () => {
    onChange(value, direction === "asc" ? "desc" : "asc");
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="خيارات الترتيب"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
            <span>ترتيب حسب: {currentOption?.label || "اختر"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value, direction)}
              className="gap-2"
            >
              <span className="w-4 shrink-0">
                {option.value === value && (
                  <Check className="w-4 h-4" aria-hidden="true" />
                )}
              </span>
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleDirection}
        aria-label={direction === "asc" ? "ترتيب تصاعدي" : "ترتيب تنازلي"}
        title={direction === "asc" ? "تصاعدي" : "تنازلي"}
      >
        {direction === "asc" ? (
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        ) : (
          <ArrowDown className="w-4 h-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
