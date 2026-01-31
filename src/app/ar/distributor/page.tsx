"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Building,
} from "lucide-react";

export default function DistributorPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    experience: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم إرسال طلبك بنجاح! سنتواصل معك قريباً");
  };

  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary">فرصة عمل مميزة</Badge>
          <h1 className="text-4xl font-bold mb-4">كن موزعاً لمنتجاتنا</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            انضم إلى شبكة موزعينا واحصل على دخل إضافي من خلال توزيع كتب ومنتجات
            الأستاذ رضا الفاروق
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">عمولة مجزية</h3>
              <p className="text-sm text-muted-foreground">
                احصل على عمولة تصل إلى 30% على كل عملية بيع
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">نمو مستمر</h3>
              <p className="text-sm text-muted-foreground">
                منتجات عالية الجودة ومطلوبة في السوق
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">دعم كامل</h3>
              <p className="text-sm text-muted-foreground">
                فريق دعم متخصص لمساعدتك في كل خطوة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">مكافآت وحوافز</h3>
              <p className="text-sm text-muted-foreground">
                برنامج مكافآت للموزعين المتميزين
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>متطلبات الانضمام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "خبرة في مجال التوزيع أو المبيعات (مفضل)",
                "القدرة على التواصل مع المدارس والمراكز التعليمية",
                "امتلاك وسيلة نقل (مفضل)",
                "الالتزام بمعايير الجودة والخدمة",
                "التواجد في محافظات مصر",
              ].map((req, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle>كيف يعمل النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { step: 1, text: "قدم طلب الانضمام من خلال النموذج" },
                { step: 2, text: "سنتواصل معك لمناقشة التفاصيل" },
                { step: 3, text: "احصل على المنتجات بأسعار خاصة" },
                { step: 4, text: "قم بالتوزيع واحصل على عمولتك" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {item.step}
                  </div>
                  <p className="text-sm pt-1">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>نموذج التقديم</CardTitle>
            <p className="text-sm text-muted-foreground">
              املأ البيانات التالية وسنتواصل معك في أقرب وقت
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="governorate">المحافظة *</Label>
                  <Input
                    id="governorate"
                    value={formData.governorate}
                    onChange={(e) =>
                      setFormData({ ...formData, governorate: e.target.value })
                    }
                    required
                    placeholder="المحافظة"
                  />
                </div>

                <div>
                  <Label htmlFor="city">المدينة *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    placeholder="المدينة"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">الخبرة في المجال</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="عدد سنوات الخبرة"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">رسالة إضافية</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-3 border rounded-md min-h-[120px]"
                  placeholder="أخبرنا المزيد عن نفسك وخبرتك..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Users className="w-5 h-5 ms-2" />
                إرسال الطلب
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>للاستفسار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">الهاتف</div>
                  <div className="font-medium">01234567890</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    البريد الإلكتروني
                  </div>
                  <div className="font-medium">
                    distributor@mrredaelfarouk.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">العنوان</div>
                  <div className="font-medium">القاهرة، مصر</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
