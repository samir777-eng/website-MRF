import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Database, Eye, FileText, Lock, Shield, UserCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية - منصة الأستاذ رضا الفاروق التعليمية",
};

export default function PrivacyPage() {
  return (
    <main role="main" className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold mb-4">سياسة الخصوصية</h1>
        <p className="text-muted-foreground">آخر تحديث: يناير 2025</p>
      </header>

      <article className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5" aria-hidden="true" />
              مقدمة
            </h2>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              نحن في منصة الأستاذ رضا الفاروق التعليمية نلتزم بحماية خصوصيتك
              وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية
              معلوماتك الشخصية عند استخدام منصتنا التعليمية.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5" aria-hidden="true" />
              المعلومات التي نجمعها
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">المعلومات الشخصية</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>الاسم الكامل</li>
                <li>البريد الإلكتروني</li>
                <li>رقم الهاتف</li>
                <li>الصف الدراسي</li>
                <li>تاريخ الميلاد</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">معلومات الاستخدام</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>سجل الدروس المشاهدة</li>
                <li>نتائج الاختبارات والتمارين</li>
                <li>الوقت المستغرق في المنصة</li>
                <li>التفاعل مع المحتوى التعليمي</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Eye className="w-5 h-5" aria-hidden="true" />
              كيفية استخدام المعلومات
            </h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• تقديم وتحسين الخدمات التعليمية</li>
              <li>• تخصيص تجربة التعلم حسب احتياجاتك</li>
              <li>• إرسال الإشعارات والتحديثات المهمة</li>
              <li>• تحليل الأداء وتحسين المنصة</li>
              <li>• التواصل معك بخصوص حسابك</li>
              <li>• ضمان أمان المنصة ومنع الاحتيال</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5" aria-hidden="true" />
              حماية البيانات
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              نستخدم أحدث تقنيات الأمان لحماية بياناتك:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• تشفير البيانات باستخدام SSL/TLS</li>
              <li>• خوادم آمنة ومحمية</li>
              <li>• مراقبة مستمرة للأمان</li>
              <li>• نسخ احتياطي منتظم للبيانات</li>
              <li>• صلاحيات محدودة للوصول إلى البيانات</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5" aria-hidden="true" />
              حقوقك
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">لديك الحق في:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• الوصول إلى بياناتك الشخصية</li>
              <li>• تصحيح أو تحديث بياناتك</li>
              <li>• حذف حسابك وبياناتك</li>
              <li>• الاعتراض على معالجة بياناتك</li>
              <li>• تقييد استخدام بياناتك</li>
              <li>• نقل بياناتك إلى خدمة أخرى</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              ملفات تعريف الارتباط (Cookies)
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. يمكنك التحكم
              في إعدادات ملفات تعريف الارتباط من خلال متصفحك. لمزيد من
              المعلومات، يرجى الاطلاع على سياسة ملفات تعريف الارتباط الخاصة بنا.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              مشاركة البيانات مع أطراف ثالثة
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة إلا في الحالات
              التالية:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة</li>
              <li>• عند الحاجة للامتثال للقوانين واللوائح</li>
              <li>• لحماية حقوقنا وسلامة المستخدمين</li>
              <li>• بموافقتك الصريحة</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              التغييرات على سياسة الخصوصية
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنقوم بإخطارك بأي
              تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
              يُنصح بمراجعة هذه الصفحة بشكل دوري للاطلاع على أي تحديثات.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              اتصل بنا
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى
              التواصل معنا:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• البريد الإلكتروني: privacy@mrredaelfarouk.com</li>
              <li>• الهاتف: +20 123 456 7890</li>
            </ul>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
