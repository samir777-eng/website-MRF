"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getFirstError, useZodForm } from "@/lib/hooks/use-zod-form";
import { loginSchema, type LoginInput } from "@/lib/validation/auth-schemas";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Screen reader announcements
  const {
    useScreenReaderAnnouncer,
  } = require("@/components/accessibility/screen-reader-announcer");
  const { announceFormError, announceFormSuccess, announceLoading } =
    useScreenReaderAnnouncer();

  // Use Zod form hook for consistent validation
  const form = useZodForm<LoginInput>({
    schema: loginSchema,
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate form with Zod
    const isValid = form.validateForm();
    if (!isValid) {
      // Announce first error for screen readers
      const firstError = getFirstError(loginSchema, form.values);
      if (firstError) {
        const fieldName =
          firstError.field === "email" ? "البريد الإلكتروني" : "كلمة المرور";
        announceFormError(fieldName, firstError.message);
      }
      return;
    }

    announceLoading(true, "تسجيل الدخول");

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form.values),
      // });

      // MOCK: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // MOCK: Simulate successful login
      const success = true;

      if (success) {
        announceLoading(false);
        handleSuccess("LOGIN_SUCCESS");
        announceFormSuccess("تم تسجيل الدخول بنجاح، جاري التحويل...");
        router.push("/ar/dashboard");
      } else {
        throw { code: "INVALID_CREDENTIALS" };
      }
    } catch (error) {
      announceLoading(false);
      const { message } = handleError(error, { showToast: true });
      setGeneralError(message);
      announceFormError("تسجيل الدخول", message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            تسجيل الدخول
          </Badge>
          <h1 className="text-4xl font-bold mb-3">مرحباً بعودتك</h1>
          <p className="text-muted-foreground text-lg">سجل دخولك للمتابعة</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <LogIn className="w-7 h-7 text-blue-600" />
              تسجيل الدخول
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {generalError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{generalError}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-base flex items-center gap-2 mb-2"
                >
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </Label>
                <input
                  id="email"
                  type="email"
                  value={form.values.email}
                  onChange={(e) => form.setValue("email", e.target.value)}
                  onBlur={() => form.setTouched("email")}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    form.errors.email ? "border-red-500" : "border-input"
                  } bg-background focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="example@email.com"
                  dir="ltr"
                  autoComplete="email"
                  aria-invalid={!!form.errors.email}
                  aria-describedby={
                    form.errors.email ? "email-error" : undefined
                  }
                />
                {form.errors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {form.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label
                    htmlFor="password"
                    className="text-base flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </Label>
                  <Link
                    href="/ar/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.values.password}
                    onChange={(e) => form.setValue("password", e.target.value)}
                    onBlur={() => form.setTouched("password")}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      form.errors.password ? "border-red-500" : "border-input"
                    } bg-background focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل كلمة المرور"
                    dir="ltr"
                    autoComplete="current-password"
                    aria-invalid={!!form.errors.password}
                    aria-describedby={
                      form.errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                    title={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {form.errors.password && (
                  <p
                    id="password-error"
                    className="text-sm text-red-600 mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {form.errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={form.values.rememberMe || false}
                  onChange={(e) =>
                    form.setValue("rememberMe", e.target.checked)
                  }
                  className="h-5 w-5 rounded-sm border border-primary accent-primary"
                />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  تذكرني
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={form.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {form.isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 ml-2" aria-hidden="true" />
                    تسجيل الدخول
                  </>
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                <span>ليس لديك حساب؟</span>
                <Link
                  href="/ar/signup"
                  className="text-blue-600 hover:underline font-medium inline-flex items-center justify-center"
                  style={{ minHeight: "44px", minWidth: "44px" }}
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials (Remove in production) */}
        <Card className="mt-6 border-0 shadow-lg bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              🔧 للتجربة (سيتم إزالتها في الإنتاج)
            </p>
            <div className="text-sm space-y-1 text-center">
              <p>البريد: student@example.com</p>
              <p>كلمة المرور: Student123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
