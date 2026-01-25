import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for trapping focus within a container
 * 
 * ACCESSIBILITY: Ensures keyboard users can't tab outside of modals/dialogs
 * 
 * @param isActive - Whether the focus trap is active
 * @param options - Configuration options
 */
export function useFocusTrap(
  isActive: boolean,
  options?: {
    /** Element to focus when trap activates (defaults to first focusable) */
    initialFocus?: React.RefObject<HTMLElement>;
    /** Element to focus when trap deactivates (defaults to previously focused) */
    returnFocus?: boolean;
    /** Callback when escape is pressed */
    onEscape?: () => void;
  }
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => {
      // Filter out hidden elements
      return el.offsetParent !== null;
    });
  }, []);

  // Handle tab key to trap focus
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      // Handle Escape key
      if (event.key === 'Escape' && options?.onEscape) {
        event.preventDefault();
        options.onEscape();
        return;
      }

      // Handle Tab key
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: Move focus backwards
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move focus forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isActive, getFocusableElements, options]
  );

  // Set up focus trap
  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Focus the initial element or first focusable
    const focusInitial = () => {
      if (options?.initialFocus?.current) {
        options.initialFocus.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(focusInitial, 10);

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (options?.returnFocus !== false && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isActive, getFocusableElements, handleKeyDown, options]);

  return containerRef;
}

export default useFocusTrap;

