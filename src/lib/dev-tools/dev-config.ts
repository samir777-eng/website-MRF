export interface DevConfig {
  enabled: boolean;
  features: {
    debugPanel: boolean;
    errorLogger: boolean;
    performanceProfiler: boolean;
    apiMonitor: boolean;
    consoleEnhancer: boolean;
    toolbar: boolean;
  };
  settings: {
    maxLogEntries: number;
    maxApiCalls: number;
    maxPerformanceEntries: number;
    autoExportOnError: boolean;
    showTimestamps: boolean;
    enableKeyboardShortcuts: boolean;
    persistData: boolean;
  };
  shortcuts: {
    toggleToolbar: string;
    toggleDebugPanel: string;
    clearAllData: string;
    exportLogs: string;
  };
}

const defaultConfig: DevConfig = {
  enabled: process.env.NODE_ENV === "development",
  features: {
    debugPanel: true,
    errorLogger: true,
    performanceProfiler: true,
    apiMonitor: true,
    consoleEnhancer: true,
    toolbar: true,
  },
  settings: {
    maxLogEntries: 500,
    maxApiCalls: 100,
    maxPerformanceEntries: 1000,
    autoExportOnError: false,
    showTimestamps: true,
    enableKeyboardShortcuts: true,
    persistData: true,
  },
  shortcuts: {
    toggleToolbar: "Ctrl+Shift+D",
    toggleDebugPanel: "Ctrl+Shift+P",
    clearAllData: "Ctrl+Shift+C",
    exportLogs: "Ctrl+Shift+E",
  },
};

class DevConfigManager {
  private config: DevConfig;
  private storageKey = "dev_tools_config";

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): DevConfig {
    if (typeof window === "undefined") {
      return defaultConfig;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        return { ...defaultConfig, ...parsedConfig };
      }
    } catch (error) {
      console.warn("Failed to load dev tools config:", error);
    }

    return defaultConfig;
  }

  private saveConfig() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (error) {
      console.warn("Failed to save dev tools config:", error);
    }
  }

  getConfig(): DevConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<DevConfig>) {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  updateFeatures(features: Partial<DevConfig["features"]>) {
    this.config.features = { ...this.config.features, ...features };
    this.saveConfig();
  }

  updateSettings(settings: Partial<DevConfig["settings"]>) {
    this.config.settings = { ...this.config.settings, ...settings };
    this.saveConfig();
  }

  updateShortcuts(shortcuts: Partial<DevConfig["shortcuts"]>) {
    this.config.shortcuts = { ...this.config.shortcuts, ...shortcuts };
    this.saveConfig();
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  isFeatureEnabled(feature: keyof DevConfig["features"]): boolean {
    return this.config.enabled && this.config.features[feature];
  }

  getSetting<K extends keyof DevConfig["settings"]>(
    key: K,
  ): DevConfig["settings"][K] {
    return this.config.settings[key];
  }

  getShortcut(action: keyof DevConfig["shortcuts"]): string {
    return this.config.shortcuts[action];
  }

  resetToDefaults() {
    this.config = { ...defaultConfig };
    this.saveConfig();
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configJson: string): boolean {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...defaultConfig, ...importedConfig };
      this.saveConfig();
      return true;
    } catch (error) {
      console.error("Failed to import config:", error);
      return false;
    }
  }
}

// Create singleton instance
export const devConfig = new DevConfigManager();

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV as
    | "development"
    | "production"
    | "test"
    | "staging";

  switch (env) {
    case "development":
      return {
        enabled: true,
        verboseLogging: true,
        showAllErrors: true,
        enableAllFeatures: true,
      };

    case "staging":
      return {
        enabled: true,
        verboseLogging: false,
        showAllErrors: true,
        enableAllFeatures: false,
      };

    case "production":
      return {
        enabled: false,
        verboseLogging: false,
        showAllErrors: false,
        enableAllFeatures: false,
      };

    default:
      return {
        enabled: false,
        verboseLogging: false,
        showAllErrors: false,
        enableAllFeatures: false,
      };
  }
};

// Feature flags for conditional dev tool loading
export const shouldLoadDevTools = () => {
  const envConfig = getEnvironmentConfig();
  return envConfig.enabled && devConfig.isEnabled();
};

// Utility functions for dev tool initialization
export const initializeDevTools = () => {
  if (!shouldLoadDevTools()) return;

  // Initialize dev tools based on configuration
  const config = devConfig.getConfig();

  console.log("🛠️ Initializing development tools...", {
    features: config.features,
    settings: config.settings,
  });

  // Set up keyboard shortcuts
  if (config.settings.enableKeyboardShortcuts) {
    setupKeyboardShortcuts();
  }

  // Auto-export on critical errors if enabled
  if (config.settings.autoExportOnError) {
    setupAutoExport();
  }
};

const setupKeyboardShortcuts = () => {
  const config = devConfig.getConfig();

  document.addEventListener("keydown", (event) => {
    const key = `${event.ctrlKey ? "Ctrl+" : ""}${event.shiftKey ? "Shift+" : ""}${event.altKey ? "Alt+" : ""}${event.key}`;

    switch (key) {
      case config.shortcuts.toggleToolbar:
        event.preventDefault();
        // Toolbar toggle logic will be handled by the toolbar component
        break;

      case config.shortcuts.clearAllData:
        event.preventDefault();
        if (confirm("Clear all development data? This cannot be undone.")) {
          // Clear all dev tool data
          localStorage.removeItem("dev_error_logs");
          localStorage.removeItem("dev_api_calls");
          localStorage.removeItem("dev_console_entries");
          console.log("🗑️ All development data cleared");
        }
        break;
    }
  });
};

const setupAutoExport = () => {
  // Auto-export on critical errors
  window.addEventListener("error", (event) => {
    if (event.error && event.error.stack) {
      console.warn("🚨 Critical error detected, auto-exporting logs...");
      // Auto-export logic would go here
    }
  });
};
