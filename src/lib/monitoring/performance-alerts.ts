"use client";

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: "greater_than" | "less_than" | "equals";
  threshold: number;
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  cooldown: number; // Minutes between alerts
  actions: AlertAction[];
}

interface AlertAction {
  type: "notification" | "email" | "webhook" | "console";
  config: Record<string, any>;
}

interface AlertInstance {
  id: string;
  ruleId: string;
  metric: string;
  value: number;
  threshold: number;
  severity: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
}

class PerformanceAlertManager {
  private rules: AlertRule[] = [];
  private alerts: AlertInstance[] = [];
  private lastAlertTime: Map<string, number> = new Map();
  private notificationPermission: NotificationPermission = "default";

  constructor() {
    this.initializeDefaultRules();
    this.requestNotificationPermission();
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        id: "fcp-critical",
        name: "First Contentful Paint Critical",
        metric: "fcp",
        condition: "greater_than",
        threshold: 3000,
        severity: "critical",
        enabled: true,
        cooldown: 5,
        actions: [
          { type: "notification", config: { title: "Critical FCP Alert" } },
          { type: "console", config: {} },
        ],
      },
      {
        id: "lcp-warning",
        name: "Largest Contentful Paint Warning",
        metric: "lcp",
        condition: "greater_than",
        threshold: 2500,
        severity: "medium",
        enabled: true,
        cooldown: 10,
        actions: [{ type: "console", config: {} }],
      },
      {
        id: "cls-critical",
        name: "Cumulative Layout Shift Critical",
        metric: "cls",
        condition: "greater_than",
        threshold: 0.25,
        severity: "critical",
        enabled: true,
        cooldown: 5,
        actions: [
          { type: "notification", config: { title: "Critical CLS Alert" } },
          { type: "console", config: {} },
        ],
      },
      {
        id: "memory-warning",
        name: "Memory Usage Warning",
        metric: "memoryUsed",
        condition: "greater_than",
        threshold: 50 * 1024 * 1024, // 50MB
        severity: "medium",
        enabled: true,
        cooldown: 15,
        actions: [{ type: "console", config: {} }],
      },
      {
        id: "error-rate-high",
        name: "High Error Rate",
        metric: "jsError",
        condition: "greater_than",
        threshold: 5, // 5 errors
        severity: "high",
        enabled: true,
        cooldown: 5,
        actions: [
          { type: "notification", config: { title: "High Error Rate Alert" } },
          { type: "console", config: {} },
        ],
      },
    ];
  }

  private async requestNotificationPermission() {
    if ("Notification" in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
  }

  public checkMetric(
    metric: string,
    value: number,
    extra?: Record<string, any>,
  ) {
    const applicableRules = this.rules.filter(
      (rule) => rule.enabled && rule.metric === metric,
    );

    for (const rule of applicableRules) {
      if (this.evaluateCondition(rule, value)) {
        this.triggerAlert(rule, value, extra);
      }
    }
  }

  private evaluateCondition(rule: AlertRule, value: number): boolean {
    switch (rule.condition) {
      case "greater_than":
        return value > rule.threshold;
      case "less_than":
        return value < rule.threshold;
      case "equals":
        return value === rule.threshold;
      default:
        return false;
    }
  }

  private triggerAlert(
    rule: AlertRule,
    value: number,
    extra?: Record<string, any>,
  ) {
    // Check cooldown
    const lastAlert = this.lastAlertTime.get(rule.id);
    const now = Date.now();
    const cooldownMs = rule.cooldown * 60 * 1000;

    if (lastAlert && now - lastAlert < cooldownMs) {
      return; // Still in cooldown
    }

    // Create alert instance
    const alert: AlertInstance = {
      id: `${rule.id}-${now}`,
      ruleId: rule.id,
      metric: rule.metric,
      value,
      threshold: rule.threshold,
      severity: rule.severity,
      timestamp: now,
      acknowledged: false,
      resolved: false,
    };

    this.alerts.push(alert);
    this.lastAlertTime.set(rule.id, now);

    // Execute actions
    for (const action of rule.actions) {
      this.executeAction(action, alert, rule, extra);
    }

    // Limit stored alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  private executeAction(
    action: AlertAction,
    alert: AlertInstance,
    rule: AlertRule,
    extra?: Record<string, any>,
  ) {
    switch (action.type) {
      case "notification":
        this.showNotification(alert, rule, action.config);
        break;
      case "console":
        this.logToConsole(alert, rule, extra);
        break;
      case "webhook":
        this.sendWebhook(alert, rule, action.config, extra);
        break;
      case "email":
        // Would integrate with email service
        console.log("Email alert would be sent:", alert);
        break;
    }
  }

  private showNotification(alert: AlertInstance, rule: AlertRule, config: any) {
    if (this.notificationPermission !== "granted") return;

    const title = config.title || `Performance Alert: ${rule.name}`;
    const body = `${rule.metric}: ${alert.value} (threshold: ${alert.threshold})`;

    const notification = new Notification(title, {
      body,
      icon: "/icons/alert.png",
      badge: "/icons/badge.png",
      tag: alert.ruleId,
      requireInteraction: alert.severity === "critical",
      data: { alertId: alert.id },
    });

    notification.onclick = () => {
      window.focus();
      this.acknowledgeAlert(alert.id);
      notification.close();
    };

    // Auto-close after 10 seconds for non-critical alerts
    if (alert.severity !== "critical") {
      setTimeout(() => notification.close(), 10000);
    }
  }

  private logToConsole(
    alert: AlertInstance,
    rule: AlertRule,
    extra?: Record<string, any>,
  ) {
    const severity = alert.severity;
    const method =
      severity === "critical" ? "error" : severity === "high" ? "warn" : "info";

    console[method](`🚨 Performance Alert: ${rule.name}`, {
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold,
      severity: alert.severity,
      timestamp: new Date(alert.timestamp).toISOString(),
      extra,
    });
  }

  private async sendWebhook(
    alert: AlertInstance,
    rule: AlertRule,
    config: any,
    extra?: Record<string, any>,
  ) {
    if (!config.url) return;

    try {
      await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: JSON.stringify({
          alert,
          rule,
          extra,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send webhook alert:", error);
    }
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public getAlerts(): AlertInstance[] {
    return [...this.alerts];
  }

  public getActiveAlerts(): AlertInstance[] {
    return this.alerts.filter((a) => !a.resolved);
  }

  public getRules(): AlertRule[] {
    return [...this.rules];
  }

  public addRule(rule: AlertRule) {
    this.rules.push(rule);
  }

  public updateRule(ruleId: string, updates: Partial<AlertRule>) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      Object.assign(rule, updates);
    }
  }

  public deleteRule(ruleId: string) {
    this.rules = this.rules.filter((r) => r.id !== ruleId);
  }

  public enableRule(ruleId: string) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = true;
    }
  }

  public disableRule(ruleId: string) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = false;
    }
  }
}

// Global instance
export const performanceAlerts = new PerformanceAlertManager();

export default performanceAlerts;
export type { AlertRule, AlertAction, AlertInstance };
