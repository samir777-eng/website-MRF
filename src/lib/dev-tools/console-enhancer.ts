interface ConsoleEntry {
  id: string;
  timestamp: number;
  level: "log" | "info" | "warn" | "error" | "debug";
  args: any[];
  stack?: string;
  source?: string;
}

class ConsoleEnhancer {
  private entries: ConsoleEntry[] = [];
  private maxEntries = 500;
  private originalConsole: {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
  };

  constructor() {
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    if (typeof window !== "undefined") {
      this.enhanceConsole();
    }
  }

  private enhanceConsole() {
    const createEnhancedMethod = (
      level: ConsoleEntry["level"],
      originalMethod: (...args: any[]) => void,
    ) => {
      return (...args: any[]) => {
        // Get stack trace for source location
        const stack = new Error().stack;
        const source = this.extractSource(stack);

        const entry: ConsoleEntry = {
          id: `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          level,
          args: args.map((arg) => this.serializeArg(arg)),
          stack,
          source,
        };

        this.addEntry(entry);

        // Call original method with enhanced formatting
        if (process.env.NODE_ENV === "development") {
          const timestamp = new Date().toLocaleTimeString();
          const emoji = this.getLevelEmoji(level);
          const sourceInfo = source ? ` [${source}]` : "";

          originalMethod.call(
            console,
            `${emoji} ${timestamp}${sourceInfo}`,
            ...args,
          );
        } else {
          originalMethod.call(console, ...args);
        }
      };
    };

    console.log = createEnhancedMethod("log", this.originalConsole.log);
    console.info = createEnhancedMethod("info", this.originalConsole.info);
    console.warn = createEnhancedMethod("warn", this.originalConsole.warn);
    console.error = createEnhancedMethod("error", this.originalConsole.error);
    console.debug = createEnhancedMethod("debug", this.originalConsole.debug);

    // Add custom console methods
    (console as any).success = (...args: any[]) => {
      const entry: ConsoleEntry = {
        id: `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        level: "info",
        args: args.map((arg) => this.serializeArg(arg)),
        source: this.extractSource(new Error().stack),
      };
      this.addEntry(entry);

      if (process.env.NODE_ENV === "development") {
        const timestamp = new Date().toLocaleTimeString();
        this.originalConsole.log(`✅ ${timestamp}`, ...args);
      }
    };

    (console as any).performance = (label: string, fn: () => any) => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      const duration = end - start;

      const entry: ConsoleEntry = {
        id: `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        level: "info",
        args: [`Performance: ${label}`, `${duration.toFixed(2)}ms`],
        source: this.extractSource(new Error().stack),
      };
      this.addEntry(entry);

      if (process.env.NODE_ENV === "development") {
        const timestamp = new Date().toLocaleTimeString();
        this.originalConsole.log(
          `⚡ ${timestamp} Performance: ${label} - ${duration.toFixed(2)}ms`,
        );
      }

      return result;
    };

    (console as any).table = (data: any, columns?: string[]) => {
      const entry: ConsoleEntry = {
        id: `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        level: "log",
        args: [data, columns].filter(Boolean),
        source: this.extractSource(new Error().stack),
      };
      this.addEntry(entry);

      if (
        "table" in this.originalConsole &&
        typeof (this.originalConsole as any).table === "function"
      ) {
        (this.originalConsole as any).table.call(console, data, columns);
      } else {
        this.originalConsole.log("Table:", data);
      }
    };
  }

  private serializeArg(arg: any): any {
    try {
      if (arg === null || arg === undefined) return arg;
      if (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean"
      )
        return arg;
      if (arg instanceof Error)
        return { name: arg.name, message: arg.message, stack: arg.stack };
      if (arg instanceof Date) return arg.toISOString();
      if (typeof arg === "function")
        return `[Function: ${arg.name || "anonymous"}]`;
      if (typeof arg === "object") {
        // Avoid circular references
        return JSON.parse(
          JSON.stringify(arg, (key, value) => {
            if (typeof value === "function")
              return `[Function: ${value.name || "anonymous"}]`;
            if (value instanceof Error)
              return { name: value.name, message: value.message };
            return value;
          }),
        );
      }
      return String(arg);
    } catch {
      return "[Unserializable]";
    }
  }

  private extractSource(stack?: string): string | undefined {
    if (!stack) return undefined;

    const lines = stack.split("\n");
    // Skip the first few lines (Error, this method, enhanced method)
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("at ") && !line.includes("console-enhancer")) {
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
          const [, functionName, file, lineNum] = match;
          const fileName = file.split("/").pop() || file;
          return `${functionName} (${fileName}:${lineNum})`;
        }
      }
    }
    return undefined;
  }

  private getLevelEmoji(level: ConsoleEntry["level"]): string {
    switch (level) {
      case "error":
        return "❌";
      case "warn":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "debug":
        return "🐛";
      default:
        return "📝";
    }
  }

  private addEntry(entry: ConsoleEntry) {
    this.entries.unshift(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }

    // Store recent entries in localStorage
    try {
      const recentEntries = this.entries.slice(0, 100);
      localStorage.setItem(
        "dev_console_entries",
        JSON.stringify(recentEntries),
      );
    } catch (_e) {
      // Handle localStorage quota exceeded
    }
  }

  getEntries(): ConsoleEntry[] {
    return [...this.entries];
  }

  getEntriesByLevel(level: ConsoleEntry["level"]): ConsoleEntry[] {
    return this.entries.filter((entry) => entry.level === level);
  }

  getRecentEntries(minutes = 5): ConsoleEntry[] {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.entries.filter((entry) => entry.timestamp > cutoff);
  }

  searchEntries(query: string): ConsoleEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries.filter(
      (entry) =>
        entry.args.some((arg) =>
          String(arg).toLowerCase().includes(lowerQuery),
        ) ||
        (entry.source && entry.source.toLowerCase().includes(lowerQuery)),
    );
  }

  getStats() {
    const now = Date.now();
    const recentEntries = this.entries.filter(
      (entry) => now - entry.timestamp < 300000,
    ); // Last 5 minutes

    const levelCounts = this.entries.reduce(
      (acc, entry) => {
        acc[entry.level] = (acc[entry.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sourceCounts = this.entries.reduce(
      (acc, entry) => {
        if (entry.source) {
          acc[entry.source] = (acc[entry.source] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalEntries: this.entries.length,
      recentEntries: recentEntries.length,
      levelCounts,
      topSources: Object.entries(sourceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([source, count]) => ({ source, count })),
    };
  }

  clearEntries() {
    this.entries = [];
    localStorage.removeItem("dev_console_entries");
  }

  exportEntries(): string {
    return JSON.stringify(
      {
        timestamp: Date.now(),
        entries: this.entries,
        stats: this.getStats(),
      },
      null,
      2,
    );
  }

  loadPersistedEntries() {
    try {
      const stored = localStorage.getItem("dev_console_entries");
      if (stored) {
        const parsedEntries = JSON.parse(stored);
        if (Array.isArray(parsedEntries)) {
          this.entries = parsedEntries.slice(0, this.maxEntries);
        }
      }
    } catch (_e) {
      console.warn("Could not load persisted console entries:", _e);
    }
  }

  restore() {
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.debug = this.originalConsole.debug;

    // Remove custom methods
    delete (console as any).success;
    delete (console as any).performance;
  }
}

// Create singleton instance
export const consoleEnhancer = new ConsoleEnhancer();

// Load persisted entries on initialization
if (typeof window !== "undefined") {
  consoleEnhancer.loadPersistedEntries();
}

// Export types
export type { ConsoleEntry };
