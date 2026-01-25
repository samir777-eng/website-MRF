"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  KeyRound,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateInput = () => {
    if (!emailOrPhone) {
      setError("البريد الإلكتروني أو رقم الهاتف مطلوب");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleInputChange = (value: string) => {
    setEmailOrPhone(value);
    if (error) {
      setError("");
    }
  };

  if (isSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center page-bg-blue p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md">
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
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">
                تم إرسال رابط إعادة التعيين
              </h2>
              <CardDescription className="text-base mt-2">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى:
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <div className="p-3 bg-muted rounded-lg mb-6">
                <p className="font-medium text-foreground">{emailOrPhone}</p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground text-right">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  تحقق من صندوق الوارد أو الرسائل النصية
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  قد يستغرق الأمر بضع دقائق للوصول
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  تحقق من مجلد الرسائل غير المرغوب فيها
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={() => router.push("/ar/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ArrowRight className="w-4 h-4 ms-2" />
                العودة لتسجيل الدخول
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="w-full"
              >
                إرسال الرابط مرة أخرى
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
              <KeyRound className="w-6 h-6" />
              نسيت كلمة المرور؟
            </h2>
            <CardDescription className="text-center">
              أدخل بريدك الإلكتروني أو رقم هاتفك لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Email or Phone */}
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">
                  البريد الإلكتروني أو رقم الهاتف
                </Label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {emailOrPhone.includes("@") ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </div>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="example@email.com أو 01012345678"
                    value={emailOrPhone}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`ps-10 ${error ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  سنرسل لك رابطاً لإعادة تعيين كلمة المرور عبر البريد الإلكتروني
                  أو رسالة نصية
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ms-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 ms-2" />
                    إرسال رابط إعادة التعيين
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <span>تذكرت كلمة المرور؟</span>
                <Link
                  href="/ar/login"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors inline-flex items-center justify-center"
                  style={{ minHeight: "44px", minWidth: "44px" }}
                >
                  تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
          <h3 className="font-bold text-center mb-3">هل تحتاج مساعدة؟</h3>
          <p className="text-sm text-muted-foreground text-center mb-3">
            إذا واجهت أي مشكلة في إعادة تعيين كلمة المرور، يمكنك التواصل معنا
          </p>
          <div className="flex gap-2">
            <Link
              href="/ar/help"
              className="flex-1 block"
              style={{ minHeight: "44px" }}
            >
              <Button variant="outline" className="w-full h-full">
                مركز المساعدة
              </Button>
            </Link>
            <Link
              href="https://wa.me/201012345678"
              target="_blank"
              className="flex-1 block"
              style={{ minHeight: "44px" }}
            >
              <Button variant="outline" className="w-full h-full">
                واتساب
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
