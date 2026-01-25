"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import {
  AlertCircle,
  Award,
  Calendar,
  Check,
  CreditCard,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const {
    hasActiveSubscription,
    getDaysUntilExpiry,
    isSubscriptionExpiringSoon,
  } = useAccessControl();

  const plans = [
    {
      id: "monthly",
      name: "شهري",
      price: 150,
      duration: "شهر واحد",
      features: [
        "الوصول لجميع المحاضرات",
        "الاختبارات والتمارين",
        "الواجبات المنزلية",
        "ملاحظات المعلم",
        "الدعم الفني",
      ],
      popular: false,
    },
    {
      id: "semester",
      name: "فصل دراسي",
      price: 750,
      originalPrice: 900,
      duration: "6 أشهر",
      features: [
        "جميع مميزات الخطة الشهرية",
        "خصم 17%",
        "أولوية في الدعم",
        "محتوى إضافي",
        "مراجعات مجانية",
      ],
      popular: true,
      badge: "الأكثر شعبية",
    },
    {
      id: "yearly",
      name: "سنوي",
      price: 1400,
      originalPrice: 1800,
      duration: "12 شهر",
      features: [
        "جميع مميزات الفصل الدراسي",
        "خصم 22%",
        "جلسات خاصة مع المعلم",
        "محتوى حصري",
        "شهادة إتمام",
      ],
      popular: false,
      badge: "أفضل قيمة",
    },
  ];

  const handleSubscribe = (planId: string) => {
    // TODO: Integrate with payment gateway
    // Redirect to payment page with plan details
    console.log("Subscribe to:", planId);
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const showExpiryWarning = isSubscriptionExpiringSoon();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            الاشتراكات
          </Badge>
          <h1 className="text-4xl font-bold mb-3">اختر خطتك المناسبة</h1>
          <p className="text-muted-foreground text-lg">
            استثمر في مستقبلك التعليمي مع أفضل الأسعار
          </p>
        </div>

        {/* Current Subscription Status */}
        {user && (
          <Card className="border-0 shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    حالة الاشتراك الحالي
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-base px-3 py-1 ${
                        hasActiveSubscription()
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {hasActiveSubscription() ? "✓ نشط" : "✗ منتهي"}
                    </Badge>
                    {user.subscriptionPlan && (
                      <span className="text-muted-foreground">
                        الخطة:{" "}
                        {user.subscriptionPlan === "monthly"
                          ? "شهري"
                          : user.subscriptionPlan === "semester"
                            ? "فصل دراسي"
                            : "سنوي"}
                      </span>
                    )}
                  </div>
                  {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <Calendar className="w-4 h-4 inline ms-1" />
                      متبقي {daysUntilExpiry} يوم
                    </p>
                  )}
                </div>
                {user.subscriptionEndDate && (
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      تاريخ الانتهاء
                    </p>
                    <p className="text-lg font-bold">
                      {new Date(user.subscriptionEndDate).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Expiry Warning */}
              {showExpiryWarning && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">
                      اشتراكك على وشك الانتهاء!
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      جدد اشتراكك الآن لتجنب انقطاع الوصول إلى المحتوى التعليمي
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-0 shadow-xl relative ${
                plan.popular ? "ring-2 ring-blue-600" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {plan.name}
                </CardTitle>
                <div className="text-center mt-4">
                  {plan.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice} جنيه
                    </p>
                  )}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">جنيه</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.duration}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full text-lg py-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <CreditCard className="w-5 h-5 ms-2" />
                  اشترك الآن
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              لماذا تشترك معنا؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">محتوى عالي الجودة</h3>
                <p className="text-sm text-muted-foreground">
                  محاضرات مسجلة بجودة عالية مع شرح مفصل ومبسط
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">تحديثات مستمرة</h3>
                <p className="text-sm text-muted-foreground">
                  محاضرة جديدة كل أسبوع مع تمارين وواجبات
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">دعم فني متواصل</h3>
                <p className="text-sm text-muted-foreground">
                  فريق دعم جاهز للإجابة على استفساراتك
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              الأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  هل يمكنني إلغاء الاشتراك في أي وقت؟
                </h4>
                <p className="text-sm text-muted-foreground">
                  نعم، يمكنك إلغاء الاشتراك في أي وقت. سيستمر وصولك حتى نهاية
                  الفترة المدفوعة.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  هل يمكنني تغيير الخطة لاحقاً؟
                </h4>
                <p className="text-sm text-muted-foreground">
                  نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق
                  بشكل تناسبي.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">ما هي طرق الدفع المتاحة؟</h4>
                <p className="text-sm text-muted-foreground">
                  نقبل الدفع عبر البطاقات الائتمانية، فودافون كاش، وفوري.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  هل يمكنني تغيير الصف الدراسي؟
                </h4>
                <p className="text-sm text-muted-foreground">
                  الصف الدراسي لا يمكن تغييره بعد التسجيل. للتغيير، يرجى التواصل
                  مع الإدارة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        {user && (
          <div className="text-center mt-8">
            <Link
              href="/ar/dashboard"
              className="inline-block"
              style={{ minHeight: "44px" }}
            >
              <Button variant="outline" className="h-full">
                العودة إلى لوحة التحكم
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
