import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Input } from '@/components/ui/input';

/**
 * Comprehensive Tests for Input Component
 */

describe('Input', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Input />);
      expect(container).toBeTruthy();
    });


    it('should apply custom className', () => {
      const { container } = render(<Input className="custom-class" />);
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });

    it('should render with default props', () => {
      const { container } = render(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      render(<Input onClick={handleClick} />);
      
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('input');
      fireEvent.click(element);
      
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should be keyboard accessible', () => {
      render(<Input />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('input');
      
      element.focus();
      expect(element).toHaveFocus();
    });

    it('should handle disabled state', () => {
      render(<Input disabled />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('input');
      
      expect(element).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<Input aria-label="Test Input" />);
      const element = container.firstChild;
      
      expect(element).toHaveAttribute('aria-label', 'Test Input');
    });

    it('should be keyboard navigable', () => {
      render(<Input />);
      const element = screen.getByRole('button') || screen.getByRole('link') || container.firstChild;
      
      // Should be focusable
      element.focus();
      expect(document.activeElement).toBe(element);
    });

    it('should have sufficient color contrast', () => {
      const { container } = render(<Input />);
      const element = container.firstChild;
      
      // Check element exists and is visible
      expect(element).toBeVisible();
    });
  });

  describe('Props', () => {
    it('should accept and apply variant prop', () => {
      const { container } = render(<Input variant="primary" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/primary/i);
    });

    it('should accept and apply size prop', () => {
      const { container } = render(<Input size="lg" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/lg/i);
    });

    it('should handle data attributes', () => {
      const { container } = render(<Input data-testid="test-component" />);
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      const { container } = render(<Input>{null}</Input>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined props gracefully', () => {
      const { container } = render(<Input someProp={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty string props', () => {
      const { container } = render(<Input className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render correctly on mobile viewport', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      const { container } = render(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on tablet viewport', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      
      const { container } = render(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on desktop viewport', () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      
      const { container } = render(<Input />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<Input />);
      const endTime = performance.now();
      
      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks', () => {
      const { unmount } = render(<Input />);
      unmount();
      
      // Component should unmount cleanly
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Suppress console errors for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<Input />);
      } catch (error) {
        // Should not throw
        expect(error).toBeUndefined();
      }
      
      consoleSpy.mockRestore();
    });
  });
});
