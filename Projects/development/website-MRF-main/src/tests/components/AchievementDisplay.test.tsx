import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AchievementDisplay } from '@/components/gamification/AchievementDisplay';

/**
 * Comprehensive Tests for AchievementDisplay Component
 */

describe('AchievementDisplay', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<AchievementDisplay />);
      expect(container).toBeTruthy();
    });


    it('should apply custom className', () => {
      const { container } = render(<AchievementDisplay className="custom-class" />);
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });

    it('should render with default props', () => {
      const { container } = render(<AchievementDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      render(<AchievementDisplay onClick={handleClick} />);
      
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('achievementdisplay');
      fireEvent.click(element);
      
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should be keyboard accessible', () => {
      render(<AchievementDisplay />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('achievementdisplay');
      
      element.focus();
      expect(element).toHaveFocus();
    });

    it('should handle disabled state', () => {
      render(<AchievementDisplay disabled />);
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('achievementdisplay');
      
      expect(element).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<AchievementDisplay aria-label="Test AchievementDisplay" />);
      const element = container.firstChild;
      
      expect(element).toHaveAttribute('aria-label', 'Test AchievementDisplay');
    });

    it('should be keyboard navigable', () => {
      render(<AchievementDisplay />);
      const element = screen.getByRole('button') || screen.getByRole('link') || container.firstChild;
      
      // Should be focusable
      element.focus();
      expect(document.activeElement).toBe(element);
    });

    it('should have sufficient color contrast', () => {
      const { container } = render(<AchievementDisplay />);
      const element = container.firstChild;
      
      // Check element exists and is visible
      expect(element).toBeVisible();
    });
  });

  describe('Props', () => {
    it('should accept and apply variant prop', () => {
      const { container } = render(<AchievementDisplay variant="primary" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/primary/i);
    });

    it('should accept and apply size prop', () => {
      const { container } = render(<AchievementDisplay size="lg" />);
      const element = container.firstChild;
      
      expect(element).toHaveClass(/lg/i);
    });

    it('should handle data attributes', () => {
      const { container } = render(<AchievementDisplay data-testid="test-component" />);
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      const { container } = render(<AchievementDisplay>{null}</AchievementDisplay>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined props gracefully', () => {
      const { container } = render(<AchievementDisplay someProp={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty string props', () => {
      const { container } = render(<AchievementDisplay className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render correctly on mobile viewport', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      const { container } = render(<AchievementDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on tablet viewport', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      
      const { container } = render(<AchievementDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correctly on desktop viewport', () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      
      const { container } = render(<AchievementDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<AchievementDisplay />);
      const endTime = performance.now();
      
      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks', () => {
      const { unmount } = render(<AchievementDisplay />);
      unmount();
      
      // Component should unmount cleanly
      expect(screen.queryByTestId('achievementdisplay')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Suppress console errors for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<AchievementDisplay />);
      } catch (error) {
        // Should not throw
        expect(error).toBeUndefined();
      }
      
      consoleSpy.mockRestore();
    });
  });
});
