"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  initialFocus?: string; // CSS selector for initial focus element
}

export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  initialFocus,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
      ) as NodeListOf<HTMLElement>;
    };

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus initial element or first focusable element
    if (initialFocus) {
      const initialElement = container.querySelector(
        initialFocus,
      ) as HTMLElement;
      if (initialElement) {
        initialElement.focus();
      } else {
        firstElement?.focus();
      }
    } else {
      firstElement?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const currentFocusableElements = getFocusableElements();
      const currentFirstElement = currentFocusableElements[0];
      const currentLastElement =
        currentFocusableElements[currentFocusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === currentFirstElement) {
          e.preventDefault();
          currentLastElement?.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === currentLastElement) {
          e.preventDefault();
          currentFirstElement?.focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);

      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, initialFocus, restoreFocus]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
}

// Hook for managing focus in components
export function useFocusManagement() {
  const focusElement = (selector: string, container?: HTMLElement) => {
    const element = (container || document).querySelector(
      selector,
    ) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const focusFirstInteractiveElement = (container?: HTMLElement) => {
    const containerElement = container || document;
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  };

  const announceToScreenReader = (
    message: string,
    priority: "polite" | "assertive" = "polite",
  ) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  return {
    focusElement,
    focusFirstInteractiveElement,
    announceToScreenReader,
  };
}

// Live region component for screen reader announcements
interface LiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  clearAfter?: number; // milliseconds
}

export function LiveRegion({
  message,
  priority = "polite",
  clearAfter = 1000,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clearAfter && regionRef.current) {
      const timer = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = "";
        }
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Screen reader only text component
interface ScreenReaderOnlyProps {
  children: ReactNode;
  as?: ElementType;
}

export function ScreenReaderOnly({
  children,
  as: Component = "span",
}: ScreenReaderOnlyProps) {
  return <Component className="sr-only">{children}</Component>;
}

// Visually hidden but accessible component
export function VisuallyHidden({
  children,
  as: Component = "span",
}: ScreenReaderOnlyProps) {
  return (
    <Component className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
      {children}
    </Component>
  );
}
