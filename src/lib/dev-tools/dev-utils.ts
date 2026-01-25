import { devConfig } from "./dev-config";

// Development-only utilities that enhance the development experience

/**
 * Enhanced console logging with better formatting and context
 */
export const devLog = {
  info: (message: string, data?: any) => {
    if (!devConfig.isEnabled()) return;
    console.log(`ℹ️ [INFO] ${message}`, data || "");
  },

  success: (message: string, data?: any) => {
    if (!devConfig.isEnabled()) return;
    console.log(`✅ [SUCCESS] ${message}`, data || "");
  },

  warning: (message: string, data?: any) => {
    if (!devConfig.isEnabled()) return;
    console.warn(`⚠️ [WARNING] ${message}`, data || "");
  },

  error: (message: string, error?: any) => {
    if (!devConfig.isEnabled()) return;
    console.error(`❌ [ERROR] ${message}`, error || "");
  },

  debug: (message: string, data?: any) => {
    if (!devConfig.isEnabled()) return;
    console.debug(`🐛 [DEBUG] ${message}`, data || "");
  },

  performance: (label: string, fn: () => any) => {
    if (!devConfig.isEnabled()) return fn();

    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⚡ [PERFORMANCE] ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  group: (label: string, fn: () => void) => {
    if (!devConfig.isEnabled()) return;
    console.group(`📁 ${label}`);
    fn();
    console.groupEnd();
  },
};

/**
 * Component development helpers
 */
export const devComponent = {
  logRender: (componentName: string, props?: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(`Rendering ${componentName}`, props);
  },

  logMount: (componentName: string) => {
    if (!devConfig.isEnabled()) return;
    devLog.info(`${componentName} mounted`);
  },

  logUnmount: (componentName: string) => {
    if (!devConfig.isEnabled()) return;
    devLog.info(`${componentName} unmounted`);
  },

  logEffect: (
    componentName: string,
    effectName: string,
    dependencies?: any[],
  ) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(`${componentName} effect: ${effectName}`, dependencies);
  },

  logStateChange: (
    componentName: string,
    stateName: string,
    oldValue: any,
    newValue: any,
  ) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(`${componentName} state change: ${stateName}`, {
      from: oldValue,
      to: newValue,
    });
  },
};

/**
 * API development helpers
 */
export const devAPI = {
  logRequest: (method: string, url: string, data?: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.info(`API Request: ${method} ${url}`, data);
  },

  logResponse: (method: string, url: string, status: number, data?: any) => {
    if (!devConfig.isEnabled()) return;
    const emoji = status >= 400 ? "❌" : status >= 300 ? "⚠️" : "✅";
    devLog.info(`${emoji} API Response: ${method} ${url} (${status})`, data);
  },

  logError: (method: string, url: string, error: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.error(`API Error: ${method} ${url}`, error);
  },
};

/**
 * Store/State development helpers
 */
export const devStore = {
  logAction: (storeName: string, actionName: string, payload?: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(`Store Action: ${storeName}.${actionName}`, payload);
  },

  logStateChange: (storeName: string, oldState: any, newState: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(`Store State Change: ${storeName}`, {
      from: oldState,
      to: newState,
    });
  },

  logSubscription: (storeName: string, subscriberName: string) => {
    if (!devConfig.isEnabled()) return;
    devLog.debug(
      `Store Subscription: ${subscriberName} subscribed to ${storeName}`,
    );
  },
};

/**
 * Route development helpers
 */
export const devRoute = {
  logNavigation: (from: string, to: string) => {
    if (!devConfig.isEnabled()) return;
    devLog.info(`Navigation: ${from} → ${to}`);
  },

  logRouteChange: (route: string, params?: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.info(`Route Change: ${route}`, params);
  },

  logRouteError: (route: string, error: any) => {
    if (!devConfig.isEnabled()) return;
    devLog.error(`Route Error: ${route}`, error);
  },
};

/**
 * Development assertions and validations
 */
export const devAssert = {
  isType: (value: any, expectedType: string, context?: string) => {
    if (!devConfig.isEnabled()) return;
    const actualType = typeof value;
    if (actualType !== expectedType) {
      devLog.error(
        `Type assertion failed${context ? ` in ${context}` : ""}: expected ${expectedType}, got ${actualType}`,
        value,
      );
    }
  },

  isNotNull: (value: any, context?: string) => {
    if (!devConfig.isEnabled()) return;
    if (value === null || value === undefined) {
      devLog.error(
        `Null assertion failed${context ? ` in ${context}` : ""}: value is ${value}`,
      );
    }
  },

  hasProperty: (obj: any, property: string, context?: string) => {
    if (!devConfig.isEnabled()) return;
    if (!obj || !(property in obj)) {
      devLog.error(
        `Property assertion failed${context ? ` in ${context}` : ""}: ${property} not found in object`,
        obj,
      );
    }
  },

  isArray: (value: any, context?: string) => {
    if (!devConfig.isEnabled()) return;
    if (!Array.isArray(value)) {
      devLog.error(
        `Array assertion failed${context ? ` in ${context}` : ""}: value is not an array`,
        value,
      );
    }
  },
};

/**
 * Development timing utilities
 */
export const devTiming = {
  time: (label: string) => {
    if (!devConfig.isEnabled()) return;
    console.time(`⏱️ ${label}`);
  },

  timeEnd: (label: string) => {
    if (!devConfig.isEnabled()) return;
    console.timeEnd(`⏱️ ${label}`);
  },

  measure: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    if (!devConfig.isEnabled()) return fn();

    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      devLog.performance(label, () => end - start);
      return result;
    } catch (error) {
      const end = performance.now();
      devLog.error(
        `${label} failed after ${(end - start).toFixed(2)}ms`,
        error,
      );
      throw error;
    }
  },
};

/**
 * Development memory utilities
 */
export const devMemory = {
  logUsage: () => {
    if (!devConfig.isEnabled()) return;
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      devLog.info("Memory Usage", {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  },

  trackLeaks: (componentName: string) => {
    if (!devConfig.isEnabled()) return;

    let initialMemory: number;

    return {
      start: () => {
        if ("memory" in performance) {
          initialMemory = (performance as any).memory.usedJSHeapSize;
          devLog.debug(
            `Memory tracking started for ${componentName}`,
            `${(initialMemory / 1024 / 1024).toFixed(2)} MB`,
          );
        }
      },

      end: () => {
        if ("memory" in performance && initialMemory) {
          const currentMemory = (performance as any).memory.usedJSHeapSize;
          const diff = currentMemory - initialMemory;
          const diffMB = diff / 1024 / 1024;

          if (diffMB > 1) {
            // Alert if more than 1MB difference
            devLog.warning(
              `Potential memory leak in ${componentName}`,
              `+${diffMB.toFixed(2)} MB`,
            );
          } else {
            devLog.debug(
              `Memory tracking ended for ${componentName}`,
              `${diffMB >= 0 ? "+" : ""}${diffMB.toFixed(2)} MB`,
            );
          }
        }
      },
    };
  },
};

/**
 * Development data utilities
 */
export const devData = {
  prettyPrint: (data: any, label?: string) => {
    if (!devConfig.isEnabled()) return;
    console.log(
      label ? `📄 ${label}:` : "📄 Data:",
      JSON.stringify(data, null, 2),
    );
  },

  compare: (obj1: any, obj2: any, label?: string) => {
    if (!devConfig.isEnabled()) return;
    const differences = findDifferences(obj1, obj2);
    if (differences.length > 0) {
      devLog.info(
        label ? `Differences in ${label}:` : "Object differences:",
        differences,
      );
    } else {
      devLog.info(
        label ? `No differences in ${label}` : "Objects are identical",
      );
    }
  },

  validate: (data: any, schema: any, context?: string) => {
    if (!devConfig.isEnabled()) return;
    // Simple validation - in a real app you'd use a proper schema validator
    const errors = validateAgainstSchema(data, schema);
    if (errors.length > 0) {
      devLog.error(
        `Validation failed${context ? ` in ${context}` : ""}`,
        errors,
      );
    } else {
      devLog.success(`Validation passed${context ? ` in ${context}` : ""}`);
    }
  },
};

// Helper functions
function findDifferences(obj1: any, obj2: any, path = ""): string[] {
  const differences: string[] = [];

  if (typeof obj1 !== typeof obj2) {
    differences.push(
      `${path}: type mismatch (${typeof obj1} vs ${typeof obj2})`,
    );
    return differences;
  }

  if (obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      differences.push(`${path}: ${obj1} vs ${obj2}`);
    }
    return differences;
  }

  if (typeof obj1 === "object") {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    for (const key of new Set([...keys1, ...keys2])) {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in obj1)) {
        differences.push(`${newPath}: missing in first object`);
      } else if (!(key in obj2)) {
        differences.push(`${newPath}: missing in second object`);
      } else {
        differences.push(...findDifferences(obj1[key], obj2[key], newPath));
      }
    }
  } else if (obj1 !== obj2) {
    differences.push(`${path}: ${obj1} vs ${obj2}`);
  }

  return differences;
}

function validateAgainstSchema(data: any, schema: any): string[] {
  // Simplified schema validation - replace with proper validator in production
  const errors: string[] = [];

  if (schema.type && typeof data !== schema.type) {
    errors.push(`Expected type ${schema.type}, got ${typeof data}`);
  }

  if (schema.required && Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Required field '${field}' is missing`);
      }
    }
  }

  return errors;
}
