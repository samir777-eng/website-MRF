"use client";

import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
}

export function SkipLinks() {
  const skipLinks: SkipLink[] = [
    {
      href: "#main-content",
      label: "تخطي إلى المحتوى الرئيسي",
    },
    {
      href: "#navigation",
      label: "تخطي إلى التنقل",
    },
    {
      href: "#footer",
      label: "تخطي إلى التذييل",
    },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Skip links">
        <ul className="flex flex-col gap-2 p-4 bg-primary text-primary-foreground">
          {skipLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "inline-block px-4 py-2 rounded-md",
                  "bg-primary-foreground text-primary",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200",
                )}
                onFocus={(e) => {
                  // Ensure the skip link is visible when focused
                  e.currentTarget.scrollIntoView({ block: "nearest" });
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// Focus management utilities
export function useFocusManagement() {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
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

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus the first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  };

  return {
    focusElement,
    focusFirstInteractiveElement,
    trapFocus,
  };
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const handleKeyDown = (
    e: KeyboardEvent,
    actions: Record<string, () => void>,
  ) => {
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const createKeyboardHandler = (actions: Record<string, () => void>) => {
    return (e: KeyboardEvent) => handleKeyDown(e, actions);
  };

  return {
    handleKeyDown,
    createKeyboardHandler,
  };
}

// Announce changes to screen readers
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
