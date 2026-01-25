interface PerformanceEntry {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: "navigation" | "resource" | "measure" | "mark" | "custom";
  metadata?: Record<string, any>;
}

interface ComponentRenderProfile {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  props?: any;
}

class PerformanceProfiler {
  private entries: PerformanceEntry[] = [];
  private activeTimers: Map<string, number> = new Map();
  private componentProfiles: Map<string, ComponentRenderProfile> = new Map();
  private maxEntries = 1000;

  constructor() {
    if (typeof window !== "undefined") {
      this.setupPerformanceObserver();
    }
  }

  private setupPerformanceObserver() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        // Observe navigation timing
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.addEntry({
              id: `nav_${Date.now()}`,
              name: entry.name,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              duration: entry.duration,
              type: "navigation",
              metadata: {
                entryType: entry.entryType,
                transferSize: (entry as any).transferSize,
                encodedBodySize: (entry as any).encodedBodySize,
              },
            });
          });
        });
        navObserver.observe({ entryTypes: ["navigation"] });

        // Observe resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.addEntry({
              id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              name: entry.name,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              duration: entry.duration,
              type: "resource",
              metadata: {
                entryType: entry.entryType,
                transferSize: (entry as any).transferSize,
                encodedBodySize: (entry as any).encodedBodySize,
                initiatorType: (entry as any).initiatorType,
              },
            });
          });
        });
        resourceObserver.observe({ entryTypes: ["resource"] });

        // Observe measures and marks
        const measureObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.addEntry({
              id: `${entry.entryType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              name: entry.name,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              duration: entry.duration,
              type: entry.entryType as "measure" | "mark",
            });
          });
        });
        measureObserver.observe({ entryTypes: ["measure", "mark"] });
      } catch (error) {
        console.warn("Performance Observer not fully supported:", error);
      }
    }
  }

  private addEntry(entry: PerformanceEntry) {
    this.entries.unshift(entry);

    // Keep only the most recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
  }

  // Start timing a custom operation
  startTimer(name: string, metadata?: Record<string, any>): string {
    const id = `timer_${name}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const startTime = performance.now();

    this.activeTimers.set(id, startTime);

    // Create a mark for the start
    if (typeof performance.mark === "function") {
      performance.mark(`${name}-start`);
    }

    return id;
  }

  // End timing a custom operation
  endTimer(id: string, metadata?: Record<string, any>): number | null {
    const startTime = this.activeTimers.get(id);
    if (!startTime) {
      console.warn(`Timer with id ${id} not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.activeTimers.delete(id);

    const name = id.split("_")[1] || "unknown";

    // Create a mark for the end and measure
    if (
      typeof performance.mark === "function" &&
      typeof performance.measure === "function"
    ) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.addEntry({
      id,
      name,
      startTime,
      endTime,
      duration,
      type: "custom",
      metadata,
    });

    return duration;
  }

  // Profile a function execution
  profile<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    const timerId = this.startTimer(name, metadata);
    try {
      const result = fn();
      this.endTimer(timerId, metadata);
      return result;
    } catch (error) {
      this.endTimer(timerId, {
        ...metadata,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // Profile an async function execution
  async profileAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    const timerId = this.startTimer(name, metadata);
    try {
      const result = await fn();
      this.endTimer(timerId, metadata);
      return result;
    } catch (error) {
      this.endTimer(timerId, {
        ...metadata,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // Profile React component renders
  profileComponentRender(
    componentName: string,
    renderFn: () => any,
    props?: any,
  ) {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    const existing = this.componentProfiles.get(componentName);
    if (existing) {
      existing.renderCount++;
      existing.totalRenderTime += duration;
      existing.averageRenderTime =
        existing.totalRenderTime / existing.renderCount;
      existing.lastRenderTime = duration;
      existing.props = props;
    } else {
      this.componentProfiles.set(componentName, {
        componentName,
        renderCount: 1,
        totalRenderTime: duration,
        averageRenderTime: duration,
        lastRenderTime: duration,
        props,
      });
    }

    return result;
  }

  // Get all performance entries
  getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  // Get entries by type
  getEntriesByType(type: PerformanceEntry["type"]): PerformanceEntry[] {
    return this.entries.filter((entry) => entry.type === type);
  }

  // Get entries by name pattern
  getEntriesByName(namePattern: string): PerformanceEntry[] {
    const regex = new RegExp(namePattern, "i");
    return this.entries.filter((entry) => regex.test(entry.name));
  }

  // Get component render profiles
  getComponentProfiles(): ComponentRenderProfile[] {
    return Array.from(this.componentProfiles.values());
  }

  // Get slowest operations
  getSlowestOperations(limit = 10): PerformanceEntry[] {
    return [...this.entries]
      .filter((entry) => entry.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit);
  }

  // Get performance statistics
  getStats() {
    const now = performance.now();
    const recentEntries = this.entries.filter(
      (entry) => now - entry.startTime < 60000,
    ); // Last minute

    const byType = this.entries.reduce(
      (acc, entry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const avgDurations = Object.keys(byType).reduce(
      (acc, type) => {
        const typeEntries = this.entries.filter(
          (entry) => entry.type === type && entry.duration,
        );
        const totalDuration = typeEntries.reduce(
          (sum, entry) => sum + (entry.duration || 0),
          0,
        );
        acc[type] =
          typeEntries.length > 0 ? totalDuration / typeEntries.length : 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalEntries: this.entries.length,
      recentEntries: recentEntries.length,
      byType,
      averageDurations: avgDurations,
      activeTimers: this.activeTimers.size,
      componentProfiles: this.componentProfiles.size,
      slowestOperations: this.getSlowestOperations(5),
    };
  }

  // Clear all data
  clear() {
    this.entries = [];
    this.activeTimers.clear();
    this.componentProfiles.clear();
  }

  // Export data for analysis
  export() {
    return {
      timestamp: Date.now(),
      entries: this.entries,
      componentProfiles: Array.from(this.componentProfiles.values()),
      stats: this.getStats(),
    };
  }
}

// Create singleton instance
export const performanceProfiler = new PerformanceProfiler();

// Export types
export type { PerformanceEntry, ComponentRenderProfile };
