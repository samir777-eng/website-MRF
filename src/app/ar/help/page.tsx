"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Settings,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "account" | "lessons" | "payment" | "technical";
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "كيف أبدأ في استخدام المنصة؟",
    answer:
      "بعد التسجيل، ابدأ بزيارة لوحة التحكم حيث ستجد توصيات مخصصة لك. يمكنك تصفح الدورات والدروس المتاحة، أو البدء بالاختبار التقييمي لتحديد مستواك.",
    category: "general",
  },
  {
    id: "2",
    question: "هل يمكنني تحميل الدروس للمشاهدة بدون إنترنت؟",
    answer:
      "نعم! يمكنك تحميل الدروس والمواد التعليمية للوصول إليها بدون اتصال بالإنترنت. انتقل إلى الدرس واضغط على زر التحميل.",
    category: "lessons",
  },
  {
    id: "3",
    question: "كيف أتتبع تقدمي في التعلم؟",
    answer:
      "يمكنك متابعة تقدمك من خلال لوحة التحكم والملف الشخصي. ستجد إحصائيات مفصلة عن الدروس المكتملة، نقاط الخبرة، الإنجازات، ومعدل الدقة في الاختبارات.",
    category: "general",
  },
  {
    id: "4",
    question: "ماذا أفعل إذا نسيت كلمة المرور؟",
    answer:
      'اضغط على "نسيت كلمة المرور" في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.',
    category: "account",
  },
  {
    id: "5",
    question: "كيف يعمل نظام النقاط والمستويات؟",
    answer:
      "تكسب نقاط الخبرة (XP) من خلال إكمال الدروس، اجتياز الاختبارات، والمشاركة اليومية. كلما جمعت نقاطاً أكثر، ترتفع في المستويات وتفتح إنجازات جديدة.",
    category: "general",
  },
  {
    id: "6",
    question: "هل المحتوى مناسب لمنهج الثانوية العامة المصرية؟",
    answer:
      "نعم، جميع المحتوى مصمم خصيصاً لمنهج اللغة العربية للثانوية العامة المصرية، بإشراف الأستاذ رضا الفاروق صاحب 31 عاماً من الخبرة.",
    category: "lessons",
  },
  {
    id: "7",
    question: "كيف أتواصل مع المعلم؟",
    answer:
      "يمكنك التواصل من خلال قسم الأسئلة في كل درس، أو عبر البريد الإلكتروني، أو من خلال مجموعات الدراسة. نحرص على الرد خلال 24 ساعة.",
    category: "general",
  },
  {
    id: "8",
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "نقبل الدفع عبر البطاقات الائتمانية، فودافون كاش، وتحويل بنكي. جميع المعاملات آمنة ومشفرة.",
    category: "payment",
  },
  {
    id: "9",
    question: "الفيديو لا يعمل، ماذا أفعل؟",
    answer:
      "تأكد من اتصالك بالإنترنت، جرب تحديث الصفحة، أو امسح ذاكرة التخزين المؤقت للمتصفح. إذا استمرت المشكلة، تواصل مع الدعم الفني.",
    category: "technical",
  },
  {
    id: "10",
    question: "هل يمكنني استخدام حسابي على أكثر من جهاز؟",
    answer:
      "نعم، يمكنك تسجيل الدخول من أي جهاز. تقدمك محفوظ في السحابة ويتم مزامنته تلقائياً عبر جميع أجهزتك.",
    category: "account",
  },
];

function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);

  // Prevent state updates after unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const filteredFAQs = FAQ_ITEMS.filter((faq) => {
    const matchesSearch =
      faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    if (isMounted) {
      setExpandedFAQ(expandedFAQ === id ? null : id);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "general":
        return "عام";
      case "account":
        return "الحساب";
      case "lessons":
        return "الدروس";
      case "payment":
        return "الدفع";
      case "technical":
        return "تقني";
      default:
        return "الكل";
    }
  };

  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              المساعدة والدعم
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نحن هنا لمساعدتك! ابحث عن إجابات لأسئلتك أو تواصل معنا مباشرة
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-bold text-lg mb-2">الدردشة المباشرة</h2>
              <p className="text-sm text-muted-foreground mb-4">
                تحدث مع فريق الدعم الآن
              </p>
              <Button className="w-full">ابدأ المحادثة</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-bold text-lg mb-2">البريد الإلكتروني</h2>
              <p className="text-sm text-muted-foreground mb-4">
                support@mrredaelfarouk.com
              </p>
              <Button variant="outline" className="w-full">
                إرسال رسالة
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-bold text-lg mb-2">الهاتف</h2>
              <p className="text-sm text-muted-foreground mb-4" dir="ltr">
                +20 123 456 7890
              </p>
              <Button variant="outline" className="w-full">
                اتصل بنا
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              الأسئلة الشائعة
            </TabsTrigger>
            <TabsTrigger value="guides">
              <BookOpen className="w-4 h-4 mr-2" />
              أدلة الاستخدام
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              فيديوهات تعليمية
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="w-4 h-4 mr-2" />
              تواصل معنا
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Search and Filter */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="ابحث في الأسئلة الشائعة..."
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">جميع الفئات</option>
                    <option value="general">عام</option>
                    <option value="account">الحساب</option>
                    <option value="lessons">الدروس</option>
                    <option value="payment">الدفع</option>
                    <option value="technical">تقني</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-right flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-right flex-1">
                          <h3 className="font-bold text-foreground mb-1">
                            {faq.question}
                          </h3>
                          <Badge variant="outline" size="sm">
                            {getCategoryLabel(faq.category)}
                          </Badge>
                        </div>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6 pt-0">
                        <div className="pr-14 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <Card className="border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    لم نجد نتائج
                  </h3>
                  <p className="text-muted-foreground">
                    جرب كلمات بحث مختلفة أو تصفح الفئات
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "دليل البدء السريع",
                  icon: Zap,
                  description: "تعلم كيفية استخدام المنصة في 5 دقائق",
                },
                {
                  title: "إدارة الحساب",
                  icon: Settings,
                  description: "كيفية تحديث معلوماتك وإعداداتك",
                },
                {
                  title: "نظام النقاط والإنجازات",
                  icon: CheckCircle,
                  description: "فهم نظام المكافآت والتحفيز",
                },
                {
                  title: "الدفع والاشتراكات",
                  icon: CreditCard,
                  description: "معلومات عن الباقات وطرق الدفع",
                },
              ].map((guide, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <guide.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {guide.description}
                        </p>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          قراءة الدليل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "جولة في المنصة", duration: "5:30", views: "1.2K" },
                { title: "كيفية إكمال الدروس", duration: "3:45", views: "890" },
                {
                  title: "استخدام نظام المراجعة",
                  duration: "4:20",
                  views: "756",
                },
                {
                  title: "تتبع التقدم والإحصائيات",
                  duration: "6:15",
                  views: "1.5K",
                },
                {
                  title: "الإنجازات والمكافآت",
                  duration: "4:50",
                  views: "980",
                },
                { title: "حل المشاكل التقنية", duration: "7:30", views: "654" },
              ].map((video, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-xl flex items-center justify-center">
                      <Video className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {video.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {video.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  aria-label="نموذج التواصل - المساعدة"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="help-name"
                        className="block text-sm font-medium mb-2"
                      >
                        الاسم
                      </label>
                      <input
                        id="help-name"
                        name="name"
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل اسمك"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="help-email"
                        className="block text-sm font-medium mb-2"
                      >
                        البريد الإلكتروني
                      </label>
                      <input
                        id="help-email"
                        name="email"
                        type="email"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="help-subject"
                      className="block text-sm font-medium mb-2"
                    >
                      الموضوع
                    </label>
                    <input
                      id="help-subject"
                      name="subject"
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="موضوع الرسالة"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="help-message"
                      className="block text-sm font-medium mb-2"
                    >
                      الرسالة
                    </label>
                    <textarea
                      id="help-message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اكتب رسالتك هنا..."
                      aria-required="true"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    aria-label="إرسال رسالة المساعدة"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <ErrorBoundary>
      <HelpContent />
    </ErrorBoundary>
  );
}
