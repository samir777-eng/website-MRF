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
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader,
  Lock,
  Mail,
  Phone,
  User,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/store/auth-store";
import { getPasswordError } from "@/lib/validation/password";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterFormProps {
  locale: string;
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    grade: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grades = [
    { value: "grade1", label: t("grades.grade1") },
    { value: "grade2", label: t("grades.grade2") },
    { value: "grade3", label: t("grades.grade3") },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("auth.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("auth.nameTooShort");
    }

    if (!formData.email) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.emailInvalid");
    }

    if (!formData.phone) {
      newErrors.phone = t("auth.phoneRequired");
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = t("auth.phoneInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.passwordRequired");
    } else {
      // SECURITY: Strong password validation
      const passwordError = getPasswordError(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordMismatch");
    }

    if (!formData.grade) {
      newErrors.grade = t("auth.gradeRequired");
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t("auth.termsRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        grade: formData.grade,
      });
      router.push(
        `/${locale}/verify-otp?email=${encodeURIComponent(formData.email)}`
      );
    } catch (error) {
      setErrors({ general: t("auth.registerError") });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.register")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.registerDescription")}
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
            <Label htmlFor="name">{t("auth.name")}</Label>
            <div className="relative">
              <User className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder={t("auth.namePlaceholder")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.name ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

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
            <Label htmlFor="phone">{t("auth.phone")}</Label>
            <div className="relative">
              <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t("auth.phonePlaceholder")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.phone ? "border-red-500" : ""}`}
                disabled={isLoading}
                dir="ltr"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">{t("auth.grade")}</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={formData.grade}
                onValueChange={(value) => handleInputChange("grade", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`pl-10 rtl:pl-3 rtl:pr-10 ${errors.grade ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder={t("auth.gradePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.grade && (
              <p className="text-sm text-red-600">{errors.grade}</p>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`pl-10 pr-10 rtl:pl-10 rtl:pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={
                  showConfirmPassword
                    ? "إخفاء تأكيد كلمة المرور"
                    : "إظهار تأكيد كلمة المرور"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="terms"
              aria-label={t("auth.acceptTerms")}
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                handleInputChange("acceptTerms", checked as boolean)
              }
              disabled={isLoading}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm leading-5">
              {t("auth.acceptTerms")}{" "}
              <Link
                href={`/${locale}/terms`}
                className="text-primary-600 hover:text-primary-500 transition-colors"
                target="_blank"
              >
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="text-primary-600 hover:text-primary-500 transition-colors"
                target="_blank"
              >
                {t("auth.privacyPolicy")}
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                {t("common.loading")}
              </>
            ) : (
              t("auth.register")
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link
              href={`/${locale}/login`}
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
            >
              {t("auth.login")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
