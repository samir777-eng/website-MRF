import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل معنا - منصة الأستاذ رضا الفاروق التعليمية",
};

export default function ContactPage() {
  return (
    <main role="main" className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">اتصل بنا</h1>
        <p className="text-lg text-muted-foreground">
          نحن هنا للإجابة على استفساراتك ومساعدتك
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              أرسل لنا رسالة
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" aria-label="نموذج الاتصال">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01234567890"
                />
              </div>
              <div>
                <Label htmlFor="subject">الموضوع</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="موضوع الرسالة"
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="message">الرسالة</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                  aria-required="true"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                aria-label="إرسال الرسالة"
              >
                إرسال الرسالة
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                معلومات الاتصال
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">الهاتف</h3>
                  <p className="text-muted-foreground" dir="ltr">
                    +20 123 456 7890
                  </p>
                  <p className="text-muted-foreground" dir="ltr">
                    +20 100 123 4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">
                    info@mrredaelfarouk.com
                  </p>
                  <p className="text-muted-foreground">
                    support@mrredaelfarouk.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">العنوان</h3>
                  <p className="text-muted-foreground">القاهرة، مصر</p>
                  <p className="text-muted-foreground">شارع الجامعة، المعادي</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">ساعات العمل</h3>
                  <p className="text-muted-foreground">
                    السبت - الخميس: 9:00 ص - 6:00 م
                  </p>
                  <p className="text-muted-foreground">الجمعة: مغلق</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                الأسئلة الشائعة
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                قبل التواصل معنا، يمكنك الاطلاع على الأسئلة الشائعة للحصول على
                إجابات سريعة.
              </p>
              <Button
                variant="outline"
                className="w-full"
                aria-label="عرض الأسئلة الشائعة"
              >
                عرض الأسئلة الشائعة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
