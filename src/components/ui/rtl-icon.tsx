"use client";

/**
 * RTL-Aware Directional Icons
 *
 * These components provide semantically named icons that work correctly in RTL mode.
 *
 * IMPORTANT - Arabic/RTL Context:
 * - "Next/Forward" direction = LEFT (←) because Arabic reads right-to-left
 * - "Previous/Back" direction = RIGHT (→) because Arabic reads right-to-left
 *
 * Usage:
 * - Use ArrowNext/ChevronNext for: "التالي", "متابعة", "إرسال" buttons
 * - Use ArrowPrev/ChevronPrev for: "السابق", "رجوع", "إلغاء" buttons
 */

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DirectionalIconType =
  | "arrow-next" // Points in forward direction (left in RTL)
  | "arrow-prev" // Points in backward direction (right in RTL)
  | "chevron-next" // Points in forward direction (left in RTL)
  | "chevron-prev"; // Points in backward direction (right in RTL)

interface DirectionalIconProps extends LucideProps {
  /**
   * The semantic direction of the icon
   */
  icon: DirectionalIconType;
  className?: string;
}

/**
 * A semantically-named directional icon
 */
export function DirectionalIcon({
  icon,
  className,
  ...props
}: DirectionalIconProps) {
  // For RTL (Arabic), forward = left, backward = right
  // These icons are designed for RTL-first, so no flipping needed
  const iconComponents = {
    "arrow-next": ArrowLeft, // Forward in RTL = Left
    "arrow-prev": ArrowRight, // Backward in RTL = Right
    "chevron-next": ChevronLeft, // Forward in RTL = Left
    "chevron-prev": ChevronRight, // Backward in RTL = Right
  };

  const IconComponent = iconComponents[icon];

  return <IconComponent className={cn(className)} {...props} />;
}

/**
 * Arrow pointing FORWARD (left in RTL Arabic)
 * Use for: "التالي", "متابعة", "إرسال", next buttons
 */
export function ArrowNext({
  className,
  ...props
}: Omit<DirectionalIconProps, "icon">) {
  return <ArrowLeft className={cn(className)} {...props} />;
}

/**
 * Arrow pointing BACKWARD (right in RTL Arabic)
 * Use for: "السابق", "رجوع", "إلغاء", back buttons
 */
export function ArrowPrev({
  className,
  ...props
}: Omit<DirectionalIconProps, "icon">) {
  return <ArrowRight className={cn(className)} {...props} />;
}

/**
 * Chevron pointing FORWARD (left in RTL Arabic)
 * Use for: "المزيد", expand, navigate forward, breadcrumb separators
 */
export function ChevronNext({
  className,
  ...props
}: Omit<DirectionalIconProps, "icon">) {
  return <ChevronLeft className={cn(className)} {...props} />;
}

/**
 * Chevron pointing BACKWARD (right in RTL Arabic)
 * Use for: "عودة", collapse, navigate back
 */
export function ChevronPrev({
  className,
  ...props
}: Omit<DirectionalIconProps, "icon">) {
  return <ChevronRight className={cn(className)} {...props} />;
}

// Export all icons for convenience
export const RTLIcons = {
  ArrowNext,
  ArrowPrev,
  ChevronNext,
  ChevronPrev,
  DirectionalIcon,
};

export default DirectionalIcon;
