// CSP-compliant utilities for loading scripts and styles
// Provides safe methods for dynamic content loading without violating CSP

/**
 * CSP-safe script loader
 * Loads external scripts without using eval or inline scripts
 */
export class CSPScriptLoader {
  private static loadedScripts = new Set<string>();
  private static loadingPromises = new Map<string, Promise<void>>();

  /**
   * Load an external script with CSP compliance
   */
  static async loadScript(
    src: string,
    options: {
      integrity?: string;
      crossOrigin?: "anonymous" | "use-credentials";
      defer?: boolean;
      async?: boolean;
      nonce?: string;
    } = {},
  ): Promise<void> {
    // Return immediately if already loaded
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    // Return existing promise if currently loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";

      if (options.integrity) {
        script.integrity = options.integrity;
      }

      if (options.crossOrigin) {
        script.crossOrigin = options.crossOrigin;
      }

      if (options.defer) {
        script.defer = true;
      }

      if (options.async) {
        script.async = true;
      }

      if (options.nonce) {
        script.nonce = options.nonce;
      }

      script.onload = () => {
        this.loadedScripts.add(src);
        this.loadingPromises.delete(src);
        resolve();
      };

      script.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Load multiple scripts in sequence
   */
  static async loadScriptsSequential(
    scripts: Array<{
      src: string;
      options?: Parameters<typeof CSPScriptLoader.loadScript>[1];
    }>,
  ): Promise<void> {
    for (const { src, options } of scripts) {
      await this.loadScript(src, options);
    }
  }

  /**
   * Load multiple scripts in parallel
   */
  static async loadScriptsParallel(
    scripts: Array<{
      src: string;
      options?: Parameters<typeof CSPScriptLoader.loadScript>[1];
    }>,
  ): Promise<void> {
    const promises = scripts.map(({ src, options }) =>
      this.loadScript(src, options),
    );
    await Promise.all(promises);
  }

  /**
   * Check if a script is loaded
   */
  static isScriptLoaded(src: string): boolean {
    return this.loadedScripts.has(src);
  }

  /**
   * Remove a loaded script from tracking
   */
  static unloadScript(src: string): void {
    this.loadedScripts.delete(src);
    this.loadingPromises.delete(src);

    // Remove script element from DOM
    const script = document.querySelector(`script[src="${src}"]`);
    if (script) {
      script.remove();
    }
  }
}

/**
 * CSP-safe stylesheet loader
 */
export class CSPStyleLoader {
  private static loadedStyles = new Set<string>();
  private static loadingPromises = new Map<string, Promise<void>>();

  /**
   * Load an external stylesheet with CSP compliance
   */
  static async loadStylesheet(
    href: string,
    options: {
      integrity?: string;
      crossOrigin?: "anonymous" | "use-credentials";
      media?: string;
      nonce?: string;
    } = {},
  ): Promise<void> {
    if (this.loadedStyles.has(href)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(href)) {
      return this.loadingPromises.get(href)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;

      if (options.integrity) {
        link.integrity = options.integrity;
      }

      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin;
      }

      if (options.media) {
        link.media = options.media;
      }

      if (options.nonce) {
        link.nonce = options.nonce;
      }

      link.onload = () => {
        this.loadedStyles.add(href);
        this.loadingPromises.delete(href);
        resolve();
      };

      link.onerror = () => {
        this.loadingPromises.delete(href);
        reject(new Error(`Failed to load stylesheet: ${href}`));
      };

      document.head.appendChild(link);
    });

    this.loadingPromises.set(href, promise);
    return promise;
  }

  /**
   * Inject CSS with nonce
   */
  static injectCSS(css: string, nonce?: string, id?: string): void {
    const style = document.createElement("style");
    style.textContent = css;

    if (nonce) {
      style.nonce = nonce;
    }

    if (id) {
      style.id = id;
    }

    document.head.appendChild(style);
  }
}

/**
 * CSP-safe event handler utilities
 */
export class CSPEventUtils {
  /**
   * Add event listener without inline handlers
   */
  static addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    element.addEventListener(type, listener, options);
  }

  /**
   * Create a safe click handler that doesn't use inline JavaScript
   */
  static createClickHandler(callback: () => void, element: HTMLElement): void {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      callback();
    });
  }

  /**
   * Safe form submission handler
   */
  static createFormHandler(
    form: HTMLFormElement,
    onSubmit: (formData: FormData) => void | Promise<void>,
  ): void {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      await onSubmit(formData);
    });
  }
}

/**
 * CSP violation reporter
 */
export class CSPViolationReporter {
  private static violations: Array<{
    timestamp: number;
    violation: SecurityPolicyViolationEvent;
  }> = [];

  /**
   * Initialize CSP violation reporting
   */
  static initialize(reportEndpoint?: string): void {
    document.addEventListener("securitypolicyviolation", (e) => {
      this.handleViolation(e, reportEndpoint);
    });
  }

  /**
   * Handle CSP violation
   */
  private static handleViolation(
    violation: SecurityPolicyViolationEvent,
    reportEndpoint?: string,
  ): void {
    const violationData = {
      timestamp: Date.now(),
      violation: violation as SecurityPolicyViolationEvent,
    };

    this.violations.push(violationData);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 CSP Violation Detected");
      console.error("Blocked URI:", violation.blockedURI);
      console.error("Violated Directive:", violation.violatedDirective);
      console.error("Source File:", violation.sourceFile);
      console.error("Line Number:", violation.lineNumber);
      console.error("Sample:", violation.sample);
      console.groupEnd();
    }

    // Report to endpoint if provided
    if (reportEndpoint) {
      this.reportViolation(violationData, reportEndpoint);
    }
  }

  /**
   * Report violation to endpoint
   */
  private static async reportViolation(
    violationData: any,
    endpoint: string,
  ): Promise<void> {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(violationData),
      });
    } catch (error) {
      console.error("Failed to report CSP violation:", error);
    }
  }

  /**
   * Get all recorded violations
   */
  static getViolations(): Array<{
    timestamp: number;
    violation: any;
  }> {
    return [...this.violations];
  }

  /**
   * Clear violation history
   */
  static clearViolations(): void {
    this.violations = [];
  }
}

/**
 * Initialize CSP utilities
 */
export function initializeCSPUtils(
  options: {
    reportEndpoint?: string;
    enableViolationReporting?: boolean;
  } = {},
): void {
  if (options.enableViolationReporting) {
    CSPViolationReporter.initialize(options.reportEndpoint);
  }

  // Add CSP debug info in development
  if (process.env.NODE_ENV === "development") {
    console.log("🔒 CSP Utils initialized");

    // Check for common CSP issues
    setTimeout(() => {
      const inlineScripts = document.querySelectorAll(
        "script:not([src]):not([nonce])",
      );
      const inlineStyles = document.querySelectorAll("style:not([nonce])");

      if (inlineScripts.length > 0 || inlineStyles.length > 0) {
        console.warn("⚠️ Found potential CSP violations:", {
          inlineScripts: inlineScripts.length,
          inlineStyles: inlineStyles.length,
        });
      }
    }, 1000);
  }
}
