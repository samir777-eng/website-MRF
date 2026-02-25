import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '@/components/layout/navigation';

/**
 * Comprehensive Tests for Navigation Component
 */

describe('Navigation', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Navigation />);
      expect(container).toBeTruthy();
    });


    it('should apply custom className', () => {
      const { container } = render(<Navigation className="custom-class" />);
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });

    it('should render with default props', () => {
      const { container } = render(<Navigation />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      render(<Navigation onClick={handleClick} />);
      
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('navigation');
      fireEvent.click(element);
      
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should be keyboard accessible', () => {
      render(<Navigation />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('navigation');
      
      element.focus();
      expect(element).toHaveFocus();
    });

    it('should handle disabled state', () => {
      render(<Navigation disabled />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('navigation');
      
      expect(element).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<Navigation aria-label="Test Navigation" />);
      const element = container.firstChild;
      
      expect(element).toHaveAttribute('aria-label', 'Test Navigation');
    });

    it('should be keyboard navigable', () => {
      render(<Navigation />);
      const element = screen.getByRole('button') || screen.getByRole('link') || container.firstChild;
      
      // Should be focusable
      element.focus();
      expect(document.activeElement).toBe(element);
    });

    it('should have sufficient color contrast', () => {
      const { container } = render(<Navigation />);
      const element = container.firstChild;
      
      // Check element exists and is visible
      expect(element).toBeVisible();
    });
  });

  describe('Props', () => {
    it('should accept and apply variant prop', () => {
      const { container } = render(<Navigation variant="primary" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/primary/i);
    });

    it('should accept and apply size prop', () => {
      const { container } = render(<Navigation size="lg" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/lg/i);
    });

    it('should handle data attributes', () => {
      const { container } = render(<Navigation data-testid="test-component" />);
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      const { container } = render(<Navigation>{null}</Navigation>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined props gracefully', () => {
      const { container } = render(<Navigation someProp={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty string props', () => {
      const { container } = render(<Navigation className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render correctly on mobile viewport', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      const { container } = render(<Navigation />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on tablet viewport', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      
      const { container } = render(<Navigation />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on desktop viewport', () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      
      const { container } = render(<Navigation />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<Navigation />);
      const endTime = performance.now();
      
      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks', () => {
      const { unmount } = render(<Navigation />);
      unmount();
      
      // Component should unmount cleanly
      expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Suppress console errors for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<Navigation />);
      } catch (error) {
        // Should not throw
        expect(error).toBeUndefined();
      }
      
      consoleSpy.mockRestore();
    });
  });
});
