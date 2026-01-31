"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  LogIn,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const router = useRouter();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "البريد الإلكتروني أو رقم الهاتف مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error("خطأ في النموذج", "يرجى تصحيح الأخطاء والمحاولة مرة أخرى");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store user data in localStorage (temporary solution)
      localStorage.setItem(
        "user",
        JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          isAuthenticated: true,
        }),
      );

      success("تم تسجيل الدخول بنجاح", "مرحباً بعودتك!");

      setIsLoading(false);

      // Redirect after a short delay to show the success toast
      setTimeout(() => {
        router.push("/ar/dashboard");
      }, 800);
    } catch (err) {
      setIsLoading(false);
      error("فشل تسجيل الدخول", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center page-bg-blue p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            الأستاذ رضا الفاروق
          </h1>
          <p className="text-muted-foreground">منصة التعليم الرقمي</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <LogIn className="w-6 h-6" />
              تسجيل الدخول
            </h2>
            <CardDescription className="text-center">
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.general}
                </div>
              )}

              {/* Email or Phone */}
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">
                  البريد الإلكتروني أو رقم الهاتف
                </Label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {formData.emailOrPhone.includes("@") ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </div>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="example@email.com أو 01012345678"
                    value={formData.emailOrPhone}
                    onChange={(e) =>
                      handleInputChange("emailOrPhone", e.target.value)
                    }
                    className={`ps-10 ${errors.emailOrPhone ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.emailOrPhone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`ps-10 pe-10 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 hover:bg-transparent h-11 w-11 min-h-[44px] min-w-[44px]"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                    title={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className="w-5 h-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    aria-label="تذكرني"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    تذكرني
                  </Label>
                </div>

                <Link
                  href="/ar/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center min-h-[44px] px-2"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 min-h-[48px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ms-2" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 ms-2" />
                    تسجيل الدخول
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link
                  href="/ar/signup"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  style={{
                    display: "inline-block",
                    padding: "12px 0",
                    margin: "-12px 0",
                  }}
                  data-testid="signup-link"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Additional Info */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          بتسجيل الدخول، أنت توافق على{" "}
          <Link
            href="/ar/terms"
            className="text-blue-600 hover:underline"
            style={{
              display: "inline-block",
              padding: "12px 0",
              margin: "-12px 0",
            }}
          >
            الشروط والأحكام
          </Link>{" "}
          و{" "}
          <Link
            href="/ar/privacy"
            className="text-blue-600 hover:underline"
            style={{
              display: "inline-block",
              padding: "12px 0",
              margin: "-12px 0",
            }}
          >
            سياسة الخصوصية
          </Link>
        </p>
      </div>
    </div>
  );
}
