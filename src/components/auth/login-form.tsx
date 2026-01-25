"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader, Lock, Mail } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.passwordTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      setErrors({ general: t("auth.loginError") });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.login")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.loginDescription")}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 rtl:pl-10 rtl:pr-10 ${errors.password ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  handleInputChange("rememberMe", checked as boolean)
                }
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm">
                {t("auth.rememberMe")}
              </Label>
            </div>

            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                {t("common.loading")}
              </>
            ) : (
              t("auth.login")
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
            >
              {t("auth.register")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
