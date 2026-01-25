/**
 * Production-safe logging utility
 * Only logs in development mode, silent in production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  context?: string;
  data?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : "";
    return `[${timestamp}] ${level.toUpperCase()} ${context} ${message}`;
  }

  debug(message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return;
    
    const formatted = this.formatMessage("debug", message, options);
    console.debug(formatted);
    
    if (options?.data) {
      console.debug("Data:", options.data);
    }
  }

  info(message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return;
    
    const formatted = this.formatMessage("info", message, options);
    console.info(formatted);
    
    if (options?.data) {
      console.info("Data:", options.data);
    }
  }

  warn(message: string, options?: LogOptions): void {
    const formatted = this.formatMessage("warn", message, options);
    console.warn(formatted);
    
    if (options?.data) {
      console.warn("Data:", options.data);
    }
  }

  error(message: string, error?: Error | unknown, options?: LogOptions): void {
    const formatted = this.formatMessage("error", message, options);
    console.error(formatted);
    
    if (error instanceof Error) {
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);
    } else if (error) {
      console.error("Error:", error);
    }
    
    if (options?.data) {
      console.error("Data:", options.data);
    }
  }

  group(label: string): void {
    if (!this.isDevelopment) return;
    console.group(label);
  }

  groupEnd(): void {
    if (!this.isDevelopment) return;
    console.groupEnd();
  }

  table(data: any): void {
    if (!this.isDevelopment) return;
    console.table(data);
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, unit: string = "ms"): void {
    if (!this.isDevelopment) return;
    console.info(`⚡ Performance: ${metric} = ${value}${unit}`);
  }

  /**
   * Log analytics events
   */
  analytics(event: string, data?: Record<string, any>): void {
    if (!this.isDevelopment) return;
    console.info(`📊 Analytics: ${event}`, data);
  }

  /**
   * Log security events
   */
  security(event: string, data?: Record<string, any>): void {
    console.warn(`🔒 Security: ${event}`, data);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogLevel, LogOptions };

