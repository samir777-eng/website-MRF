"use client";

import { cn } from "@/lib/utils";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type: "single" | "multiple";
}

interface FilterPanelProps {
  groups: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterPanel({
  groups,
  activeFilters,
  onFilterChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, values) => acc + values.length,
    0
  );

  const handleToggleFilter = (
    groupId: string,
    value: string,
    type: "single" | "multiple"
  ) => {
    const current = activeFilters[groupId] || [];

    if (type === "single") {
      onFilterChange(groupId, [value]);
    } else {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilterChange(groupId, next);
    }
  };

  const getActiveFilterLabels = () => {
    const labels: { groupId: string; value: string; label: string }[] = [];

    groups.forEach((group) => {
      const values = activeFilters[group.id] || [];
      values.forEach((value) => {
        const option = group.options.find((o) => o.value === value);
        if (option) {
          labels.push({ groupId: group.id, value, label: option.label });
        }
      });
    });

    return labels;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
          aria-label={isOpen ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
          aria-expanded={isOpen}
          aria-controls="filter-panel-content"
        >
          <Filter className="w-4 h-4" aria-hidden="true" />
          <span>تصفية</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ms-1">
              <span className="sr-only">فلاتر نشطة: </span>
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            aria-label="مسح جميع الفلاتر"
          >
            مسح الكل
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilterLabels().map((filter) => (
            <Badge
              key={`${filter.groupId}-${filter.value}`}
              variant="secondary"
              className="gap-2"
            >
              {filter.label}
              <button
                onClick={() => {
                  const group = groups.find((g) => g.id === filter.groupId);
                  if (group) {
                    handleToggleFilter(
                      filter.groupId,
                      filter.value,
                      group.type
                    );
                  }
                }}
                className="hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                aria-label={`إزالة فلتر ${filter.label}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Groups */}
      {isOpen && (
        <div
          id="filter-panel-content"
          className="border border-border rounded-xl p-4 space-y-4"
          role="region"
          aria-label="خيارات التصفية"
        >
          {groups.map((group) => (
            <fieldset key={group.id}>
              <legend className="font-semibold mb-2">{group.label}</legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isActive = (activeFilters[group.id] || []).includes(
                    option.value
                  );

                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handleToggleFilter(group.id, option.value, group.type)
                      }
                      aria-label={`${isActive ? "إلغاء تحديد" : "تحديد"} ${option.label}`}
                      aria-pressed={isActive}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </div>
  );
}
