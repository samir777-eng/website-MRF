import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Scale,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "الشروط والأحكام - منصة الأستاذ رضا الفاروق التعليمية",
};

export default function TermsPage() {
  return (
    <main role="main" className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold mb-4">الشروط والأحكام</h1>
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
              مرحباً بك في منصة الأستاذ رضا الفاروق التعليمية. باستخدامك لهذه
              المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها
              بعناية قبل استخدام خدماتنا.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              قبول الشروط
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              باستخدامك للمنصة، فإنك توافق على:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• الالتزام بجميع الشروط والأحكام المذكورة</li>
              <li>• احترام حقوق الملكية الفكرية</li>
              <li>• استخدام المنصة للأغراض التعليمية فقط</li>
              <li>• تقديم معلومات صحيحة ودقيقة</li>
              <li>• الحفاظ على سرية بيانات حسابك</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">التسجيل والحساب</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">متطلبات التسجيل</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>يجب أن تكون طالباً في المرحلة الثانوية</li>
                  <li>تقديم معلومات صحيحة وكاملة</li>
                  <li>الحصول على موافقة ولي الأمر إذا كنت دون 18 عاماً</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">مسؤولية الحساب</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور</li>
                  <li>أنت مسؤول عن جميع الأنشطة التي تتم من خلال حسابك</li>
                  <li>يجب إخطارنا فوراً بأي استخدام غير مصرح به</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">الاشتراكات والدفع</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">أنواع الاشتراكات</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>اشتراك شهري</li>
                  <li>اشتراك فصلي (3 أشهر)</li>
                  <li>اشتراك سنوي</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">سياسة الدفع</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>جميع الأسعار بالجنيه المصري</li>
                  <li>الدفع يتم مقدماً</li>
                  <li>التجديد التلقائي ما لم يتم الإلغاء</li>
                  <li>لا يوجد استرداد للمبالغ المدفوعة</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">حقوق الملكية الفكرية</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              جميع المحتويات على المنصة محمية بحقوق الملكية الفكرية:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• الدروس والمحاضرات المسجلة</li>
              <li>• المواد التعليمية والملفات</li>
              <li>• الاختبارات والتمارين</li>
              <li>• التصميم والشعارات</li>
              <li>• البرمجيات والتطبيقات</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              يُمنع نسخ أو توزيع أو بيع أي محتوى من المنصة دون إذن كتابي مسبق.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <XCircle className="w-5 h-5" aria-hidden="true" />
              الاستخدام المحظور
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              يُمنع استخدام المنصة في:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• انتهاك القوانين أو اللوائح</li>
              <li>• نشر محتوى مسيء أو غير لائق</li>
              <li>• محاولة اختراق أو تعطيل المنصة</li>
              <li>• مشاركة حسابك مع الآخرين</li>
              <li>• تسجيل أو تنزيل المحتوى دون إذن</li>
              <li>• استخدام برامج آلية أو روبوتات</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">إنهاء الخدمة</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">نحتفظ بالحق في:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• تعليق أو إنهاء حسابك في حالة انتهاك الشروط</li>
              <li>• تعديل أو إيقاف الخدمة في أي وقت</li>
              <li>• رفض الخدمة لأي شخص لأي سبب</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              إخلاء المسؤولية
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              المنصة مقدمة "كما هي" دون أي ضمانات:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• لا نضمن دقة أو اكتمال المحتوى</li>
              <li>• لا نضمن عدم انقطاع الخدمة</li>
              <li>• لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة</li>
              <li>• لا نضمن نتائج معينة من استخدام المنصة</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">القانون الحاكم</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              تخضع هذه الشروط والأحكام لقوانين جمهورية مصر العربية. أي نزاع ينشأ
              عن استخدام المنصة يخضع للاختصاص القضائي للمحاكم المصرية.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">التعديلات</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إخطارك
              بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على
              المنصة. استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على
              الشروط الجديدة.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">اتصل بنا</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• البريد الإلكتروني: legal@mrredaelfarouk.com</li>
              <li>• الهاتف: +20 123 456 7890</li>
            </ul>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
