"use client";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "mrf-edu-cookie-consent";
const COOKIE_CONSENT_VERSION = "1.0";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  version: string;
  timestamp: number;
}

export function CookieConsent() {
  const isMounted = useMounted();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    version: COOKIE_CONSENT_VERSION,
    timestamp: Date.now(),
  });

  // Only check localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    if (!isMounted) return;

    // Check if user has already given consent
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        // Check if consent version matches
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setShowBanner(false);
          return;
        }
      } catch (_e) {
        // Invalid consent data, show banner
      }
    }

    // Show banner after a short delay
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMounted]);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setShowBanner(false);

    // Trigger analytics consent update if needed
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        ad_storage: prefs.marketing ? "granted" : "denied",
      });
    }
  };

  const acceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      version: COOKIE_CONSENT_VERSION,
      timestamp: Date.now(),
    };
    savePreferences(prefs);
  };

  const acceptNecessary = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      version: COOKIE_CONSENT_VERSION,
      timestamp: Date.now(),
    };
    savePreferences(prefs);
  };

  const saveCustomPreferences = () => {
    savePreferences({
      ...preferences,
      timestamp: Date.now(),
    });
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg"
      role="dialog"
      aria-label="إعدادات ملفات تعريف الارتباط"
     
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  نستخدم ملفات تعريف الارتباط
                </h3>
                <p className="text-sm text-muted-foreground">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام
                  الموقع. بالمتابعة، فإنك توافق على استخدامنا لملفات تعريف
                  الارتباط الضرورية.{" "}
                  <Link
                    href="/ar/privacy"
                    className="text-primary hover:underline inline-flex items-center"
                    style={{ minHeight: "44px" }}
                  >
                    سياسة الخصوصية
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                onClick={() => setShowDetails(true)}
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
              >
                تخصيص
              </Button>
              <Button
                onClick={acceptNecessary}
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
              >
                الضرورية فقط
              </Button>
              <Button
                onClick={acceptAll}
                size="sm"
                className="flex-1 md:flex-none text-[var(--color-purple-500)]"
              >
                قبول الكل
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                إعدادات ملفات تعريف الارتباط
              </h3>
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {/* Necessary cookies */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-5 w-5 rounded-sm border border-primary accent-primary"
                  aria-label="ملفات تعريف الارتباط الضرورية"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">
                    ملفات تعريف الارتباط الضرورية
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ضرورية لعمل الموقع بشكل صحيح. لا يمكن تعطيلها.
                  </p>
                </div>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      analytics: e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 rounded-sm border border-primary accent-primary"
                  aria-label="ملفات تعريف الارتباط التحليلية"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">
                    ملفات تعريف الارتباط التحليلية
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    تساعدنا على فهم كيفية استخدام الزوار للموقع لتحسين الأداء.
                  </p>
                </div>
              </div>

              {/* Marketing cookies */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      marketing: e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 rounded-sm border border-primary accent-primary"
                  aria-label="ملفات تعريف الارتباط التسويقية"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">
                    ملفات تعريف الارتباط التسويقية
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    تُستخدم لعرض إعلانات ذات صلة بك واهتماماتك.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <Button onClick={acceptNecessary} variant="outline" size="sm">
                الضرورية فقط
              </Button>
              <Button onClick={saveCustomPreferences} size="sm">
                حفظ التفضيلات
              </Button>
              <Button onClick={acceptAll} size="sm" className="text-[var(--color-purple-500)]">
                قبول الكل
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
