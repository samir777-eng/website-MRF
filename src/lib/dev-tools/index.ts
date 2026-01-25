// Development Tools - Main Export File
// This file provides a centralized export for all development tools

// Core dev tools
export { DebugPanel } from "./debug-panel";
export { DevToolbar } from "./dev-toolbar";
export { errorLogger } from "./error-logger";
export { performanceProfiler } from "./performance-profiler";
export { apiMonitor } from "./api-monitor";
export { consoleEnhancer } from "./console-enhancer";

// Configuration and utilities
export {
  devConfig,
  getEnvironmentConfig,
  shouldLoadDevTools,
} from "./dev-config";

// Import instances for global access
import { errorLogger } from "./error-logger";
import { performanceProfiler } from "./performance-profiler";
import { apiMonitor } from "./api-monitor";
import { consoleEnhancer } from "./console-enhancer";
import { devConfig } from "./dev-config";
export {
  devLog,
  devComponent,
  devAPI,
  devStore,
  devRoute,
  devAssert,
  devTiming,
  devMemory,
  devData,
} from "./dev-utils";

// Types
export type { ErrorLogEntry } from "./error-logger";
export type {
  PerformanceEntry,
  ComponentRenderProfile,
} from "./performance-profiler";
export type { APICall } from "./api-monitor";
export type { ConsoleEntry } from "./console-enhancer";
export type { DevConfig } from "./dev-config";

// Initialize dev tools function
const initializeDevTools = () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("🛠️ Dev Tools initialized");
    // Initialize all dev tools
    if (
      "initialize" in errorLogger &&
      typeof errorLogger.initialize === "function"
    ) {
      errorLogger.initialize();
    }
    if (
      "initialize" in performanceProfiler &&
      typeof performanceProfiler.initialize === "function"
    ) {
      performanceProfiler.initialize();
    }
    if (
      "initialize" in apiMonitor &&
      typeof apiMonitor.initialize === "function"
    ) {
      apiMonitor.initialize();
    }
    if (
      "initialize" in consoleEnhancer &&
      typeof consoleEnhancer.initialize === "function"
    ) {
      consoleEnhancer.initialize();
    }
  }
};

// Initialize dev tools when imported (only in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Initialize dev tools after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeDevTools();
  }, 100);
}

// Global dev tools interface for browser console access
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).__DEV_TOOLS__ = {
    errorLogger,
    performanceProfiler,
    apiMonitor,
    consoleEnhancer,
    devConfig,

    // Quick access methods
    exportAll: () => {
      const data = {
        timestamp: Date.now(),
        errors: errorLogger.exportLogs(),
        performance: performanceProfiler.export(),
        api: apiMonitor.exportCalls(),
        console: consoleEnhancer.exportEntries(),
        config: devConfig.exportConfig(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dev-tools-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log("📥 All dev tools data exported");
    },

    clearAll: () => {
      errorLogger.clearLogs();
      performanceProfiler.clear();
      apiMonitor.clearCalls();
      consoleEnhancer.clearEntries();
      localStorage.removeItem("dev_tools_config");
      console.log("🗑️ All dev tools data cleared");
    },

    getStats: () => {
      return {
        errors: errorLogger.getStats(),
        performance: performanceProfiler.getStats(),
        api: apiMonitor.getStats(),
        console: consoleEnhancer.getStats(),
      };
    },

    help: () => {
      console.log(`
🛠️ MRF Educational Platform - Development Tools

Available in window.__DEV_TOOLS__:

📊 Data Access:
  - errorLogger: Error logging and tracking
  - performanceProfiler: Performance monitoring
  - apiMonitor: API call tracking
  - consoleEnhancer: Enhanced console logging
  - devConfig: Configuration management

🚀 Quick Actions:
  - exportAll(): Export all dev data to JSON file
  - clearAll(): Clear all dev tool data
  - getStats(): Get statistics from all tools
  - help(): Show this help message

⌨️ Keyboard Shortcuts:
  - Ctrl+Shift+D: Toggle dev toolbar
  - Ctrl+Shift+P: Toggle debug panel
  - Ctrl+Shift+C: Clear all data (with confirmation)

🔧 Individual Tool Methods:
  - errorLogger.getLogs(): Get error logs
  - performanceProfiler.getEntries(): Get performance entries
  - apiMonitor.getCalls(): Get API calls
  - consoleEnhancer.getEntries(): Get console entries

📝 Logging Utilities:
  - devLog.info(msg, data): Enhanced info logging
  - devLog.success(msg, data): Success logging
  - devLog.warning(msg, data): Warning logging
  - devLog.error(msg, error): Error logging
  - devLog.debug(msg, data): Debug logging
  - devLog.performance(label, fn): Performance timing

🧩 Component Helpers:
  - devComponent.logRender(name, props): Log component renders
  - devComponent.logMount(name): Log component mounts
  - devComponent.logStateChange(name, state, old, new): Log state changes

🌐 API Helpers:
  - devAPI.logRequest(method, url, data): Log API requests
  - devAPI.logResponse(method, url, status, data): Log API responses
  - devAPI.logError(method, url, error): Log API errors

⏱️ Timing Utilities:
  - devTiming.time(label): Start timing
  - devTiming.timeEnd(label): End timing
  - devTiming.measure(label, asyncFn): Measure async function

🧠 Memory Utilities:
  - devMemory.logUsage(): Log current memory usage
  - devMemory.trackLeaks(componentName): Track memory leaks

📋 Data Utilities:
  - devData.prettyPrint(data, label): Pretty print objects
  - devData.compare(obj1, obj2, label): Compare objects
  - devData.validate(data, schema, context): Validate data

Example Usage:
  __DEV_TOOLS__.getStats()
  __DEV_TOOLS__.exportAll()
  devLog.info('Hello from dev tools!')
  devTiming.measure('API Call', () => fetch('/api/data'))
      `);
    },
  };

  // Log initialization
  console.log(`
🛠️ MRF Educational Platform - Development Tools Loaded

Type __DEV_TOOLS__.help() for available commands and utilities.
Press Ctrl+Shift+D to toggle the development toolbar.
  `);
}
