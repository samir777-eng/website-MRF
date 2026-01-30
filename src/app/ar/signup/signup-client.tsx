"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  ImagePlus,
  Loader2,
  Lock,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

// Egyptian Governorates Data
const GOVERNORATES_DATA: Record<string, string[]> = {
  القاهرة: [
    "مدينة نصر",
    "المعادي",
    "حلوان",
    "شبرا",
    "مصر الجديدة",
    "الزمالك",
    "المقطم",
    "التجمع الخامس",
    "الشروق",
    "بدر",
    "العبور",
    "15 مايو",
    "النزهة",
    "عين شمس",
    "المطرية",
    "السلام",
    "الوايلي",
    "باب الشعرية",
    "الدرب الأحمر",
    "منشأة ناصر",
  ],
  الجيزة: [
    "الجيزة",
    "الدقي",
    "العجوزة",
    "المهندسين",
    "بولاق الدكرور",
    "العمرانية",
    "الهرم",
    "فيصل",
    "حدائق الأهرام",
    "6 أكتوبر",
    "الشيخ زايد",
    "حدائق أكتوبر",
    "أوسيم",
    "كرداسة",
    "أبو النمرس",
    "الحوامدية",
    "البدرشين",
    "الصف",
    "أطفيح",
    "العياط",
    "الواحات البحرية",
    "منشأة القناطر",
  ],
  الإسكندرية: [
    "المنتزه",
    "شرق",
    "وسط",
    "غرب",
    "الجمرك",
    "العجمي",
    "العامرية",
    "برج العرب",
    "سيدي جابر",
    "محرم بك",
    "كرموز",
    "اللبان",
    "المندرة",
    "أبو قير",
    "سموحة",
    "ستانلي",
    "جليم",
    "سان ستيفانو",
    "الإبراهيمية",
    "كامب شيزار",
  ],
  الدقهلية: [
    "المنصورة",
    "طلخا",
    "ميت غمر",
    "دكرنس",
    "أجا",
    "منية النصر",
    "السنبلاوين",
    "الكردي",
    "بني عبيد",
    "المنزلة",
    "تمي الأمديد",
    "الجمالية",
    "شربين",
    "المطرية",
    "بلقاس",
    "محلة دمنة",
    "نبروه",
    "جمصة",
  ],
  "البحر الأحمر": [
    "الغردقة",
    "رأس غارب",
    "سفاجا",
    "القصير",
    "مرسى علم",
    "الشلاتين",
    "حلايب",
  ],
  البحيرة: [
    "دمنهور",
    "كفر الدوار",
    "رشيد",
    "إدكو",
    "أبو المطامير",
    "حوش عيسى",
    "شبراخيت",
    "الدلنجات",
    "المحمودية",
    "الرحمانية",
    "إيتاي البارود",
    "أبو حمص",
    "بدر",
    "النوبارية",
    "وادي النطرون",
  ],
  الفيوم: ["الفيوم", "سنورس", "إطسا", "إبشواي", "طامية", "يوسف الصديق"],
  الغربية: [
    "طنطا",
    "المحلة الكبرى",
    "كفر الزيات",
    "زفتى",
    "السنطة",
    "قطور",
    "بسيون",
    "سمنود",
  ],
  الإسماعيلية: [
    "الإسماعيلية",
    "فايد",
    "القنطرة شرق",
    "القنطرة غرب",
    "التل الكبير",
    "أبو صوير",
    "القصاصين",
  ],
  المنوفية: [
    "شبين الكوم",
    "منوف",
    "أشمون",
    "الباجور",
    "قويسنا",
    "بركة السبع",
    "تلا",
    "الشهداء",
    "سرس الليان",
    "مدينة السادات",
  ],
  المنيا: [
    "المنيا",
    "ملوي",
    "أبو قرقاص",
    "مطاي",
    "سمالوط",
    "المنيا الجديدة",
    "العدوة",
    "مغاغة",
    "بني مزار",
    "دير مواس",
  ],
  القليوبية: [
    "بنها",
    "شبرا الخيمة",
    "القناطر الخيرية",
    "الخانكة",
    "قليوب",
    "شبين القناطر",
    "طوخ",
    "كفر شكر",
    "العبور",
    "الخصوص",
    "قها",
  ],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط"],
  السويس: ["السويس", "الأربعين", "عتاقة", "الجناين", "فيصل"],
  أسوان: [
    "أسوان",
    "دراو",
    "كوم أمبو",
    "نصر النوبة",
    "إدفو",
    "البصيلية",
    "أبو سمبل",
  ],
  أسيوط: [
    "أسيوط",
    "ديروط",
    "منفلوط",
    "القوصية",
    "أبنوب",
    "أبو تيج",
    "ساحل سليم",
    "البداري",
    "صدفا",
    "الغنايم",
    "الفتح",
  ],
  "بني سويف": [
    "بني سويف",
    "الواسطى",
    "ناصر",
    "إهناسيا",
    "ببا",
    "الفشن",
    "سمسطا",
    "بني سويف الجديدة",
  ],
  بورسعيد: [
    "بورسعيد",
    "الشرق",
    "الضواحي",
    "المناخ",
    "الزهور",
    "العرب",
    "بورفؤاد",
  ],
  دمياط: [
    "دمياط",
    "فارسكور",
    "الزرقا",
    "كفر سعد",
    "كفر البطيخ",
    "دمياط الجديدة",
  ],
  الشرقية: [
    "الزقازيق",
    "بلبيس",
    "منيا القمح",
    "العاشر من رمضان",
    "ههيا",
    "أبو كبير",
    "فاقوس",
    "الصالحية الجديدة",
    "أبو حماد",
    "القرين",
    "الحسينية",
    "ديرب نجم",
    "أولاد صقر",
    "الإبراهيمية",
    "كفر صقر",
  ],
  "جنوب سيناء": [
    "الطور",
    "شرم الشيخ",
    "دهب",
    "نويبع",
    "طابا",
    "سانت كاترين",
    "أبو رديس",
    "أبو زنيمة",
    "رأس سدر",
  ],
  "كفر الشيخ": [
    "كفر الشيخ",
    "دسوق",
    "فوه",
    "مطوبس",
    "بلطيم",
    "سيدي سالم",
    "الرياض",
    "بيلا",
    "الحامول",
    "قلين",
  ],
  مطروح: [
    "مرسى مطروح",
    "الحمام",
    "العلمين",
    "الضبعة",
    "سيدي براني",
    "السلوم",
    "سيوة",
  ],
  الأقصر: ["الأقصر", "إسنا", "أرمنت", "الطود", "القرنة", "البياضية", "الزينية"],
  قنا: [
    "قنا",
    "نجع حمادي",
    "دشنا",
    "الوقف",
    "قوص",
    "فرشوط",
    "نقادة",
    "أبو تشت",
    "فاو قبلي",
  ],
  "شمال سيناء": ["العريش", "بئر العبد", "الشيخ زويد", "رفح", "الحسنة", "نخل"],
  سوهاج: [
    "سوهاج",
    "أخميم",
    "البلينا",
    "جرجا",
    "دار السلام",
    "المراغة",
    "المنشاة",
    "ساقلتة",
    "طما",
    "طهطا",
    "جهينة",
  ],
};

const GOVERNORATES = Object.keys(GOVERNORATES_DATA);

const GRADES = [
  { value: "first", label: "الصف الأول الثانوي" },
  { value: "second", label: "الصف الثاني الثانوي" },
  { value: "third", label: "الصف الثالث الثانوي" },
];

const DIVISIONS = [
  { value: "scientific", label: "علمي" },
  { value: "literary", label: "أدبي" },
];

const SCIENTIFIC_TRACKS = [
  { value: "science", label: "علمي علوم" },
  { value: "math", label: "علمي رياضة" },
];

const GENDERS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

const MONTHS = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "أغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

const YEARS = Array.from({ length: 8 }, (_, i) => ({
  value: String(2005 + i),
  label: String(2005 + i),
}));
const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  grade: string;
  division: string;
  scientificTrack: string;
  governorate: string;
  city: string;
  gender: string;
  schoolName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  fatherPhone: string;
  motherPhone: string;
  idImage: File | null;
  agreeToTerms: boolean;
}

const initialFormData: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  grade: "",
  division: "",
  scientificTrack: "",
  governorate: "",
  city: "",
  gender: "",
  schoolName: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  fatherPhone: "",
  motherPhone: "",
  idImage: null,
  agreeToTerms: false,
};

// Step configuration
const steps = [
  {
    id: 1,
    title: "البيانات الشخصية",
    icon: User,
    description: "الاسم والبريد وكلمة المرور",
  },
  {
    id: 2,
    title: "البيانات الدراسية",
    icon: GraduationCap,
    description: "الصف والمحافظة والمدرسة",
  },
  {
    id: 3,
    title: "بيانات ولي الأمر",
    icon: Users,
    description: "أرقام التواصل والهوية",
  },
  {
    id: 4,
    title: "الشروط والأحكام",
    icon: BookOpen,
    description: "الموافقة على القواعد",
  },
];

export default function SignupClient() {
  const router = useRouter();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGovernorateChange = (value: string) => {
    handleInputChange("governorate", value);
    handleInputChange("city", "");
  };

  const handleDivisionChange = (value: string) => {
    handleInputChange("division", value);
    if (value !== "scientific") handleInputChange("scientificTrack", "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error("خطأ", "حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      handleInputChange("idImage", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handleInputChange("idImage", null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
      if (!formData.middleName.trim())
        newErrors.middleName = "الاسم الأوسط مطلوب";
      if (!formData.lastName.trim()) newErrors.lastName = "الاسم الأخير مطلوب";
      if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "البريد الإلكتروني غير صالح";
      if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
      else if (formData.password.length < 6)
        newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      if (!formData.phone.trim()) newErrors.phone = "رقم الموبايل مطلوب";
      else if (!/^01[0125][0-9]{8}$/.test(formData.phone))
        newErrors.phone = "رقم الموبايل غير صالح";
    }

    if (step === 2) {
      if (!formData.grade) newErrors.grade = "الصف الدراسي مطلوب";
      if (!formData.division) newErrors.division = "الشعبة مطلوبة";
      if (formData.division === "scientific" && !formData.scientificTrack)
        newErrors.scientificTrack = "التخصص مطلوب";
      if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة";
      if (!formData.city) newErrors.city = "المدينة/المنطقة مطلوبة";
      if (!formData.gender) newErrors.gender = "النوع مطلوب";
      if (!formData.schoolName.trim())
        newErrors.schoolName = "اسم المدرسة مطلوب";
      if (!formData.birthYear) newErrors.birthYear = "سنة الميلاد مطلوبة";
      if (!formData.birthMonth) newErrors.birthMonth = "شهر الميلاد مطلوب";
      if (!formData.birthDay) newErrors.birthDay = "يوم الميلاد مطلوب";
    }

    if (step === 3) {
      if (!formData.fatherPhone.trim())
        newErrors.fatherPhone = "رقم موبايل الأب مطلوب";
      else if (!/^01[0125][0-9]{8}$/.test(formData.fatherPhone))
        newErrors.fatherPhone = "رقم الموبايل غير صالح";
      if (!formData.motherPhone.trim())
        newErrors.motherPhone = "رقم موبايل الأم مطلوب";
      else if (!/^01[0125][0-9]{8}$/.test(formData.motherPhone))
        newErrors.motherPhone = "رقم الموبايل غير صالح";
      if (!formData.idImage) newErrors.idImage = "صورة البطاقة مطلوبة";
    }

    if (step === 4) {
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          grade: formData.grade,
          isAuthenticated: true,
        })
      );

      setIsComplete(true);
      success("تم إنشاء الحساب بنجاح", "مرحباً بك في منصة الأستاذ رضا الفاروق");
      setTimeout(() => router.push("/ar/dashboard"), 2000);
    } catch {
      error("فشل في إنشاء الحساب", "حدث خطأ أثناء إنشاء حسابك");
    } finally {
      setIsLoading(false);
    }
  };

  const cities = formData.governorate
    ? GOVERNORATES_DATA[formData.governorate] || []
    : [];

  // Enhanced Step Indicator
  const StepIndicator = () => (
    <div className="mb-8">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 inset-x-0 h-0.5 bg-muted mx-16">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-card border-muted text-muted-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : isCompleted ? "text-green-600" : "text-muted-foreground"}`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden lg:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </motion.div>
              {index < 3 && (
                <div
                  className={`w-8 h-0.5 ${isCompleted ? "bg-green-500" : "bg-muted"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step title */}
      <div className="md:hidden text-center mt-4">
        <p className="font-medium text-foreground">
          {steps[currentStep - 1].title}
        </p>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );

  // Form field component - simplified to prevent focus loss
  const FormField = ({
    label,
    error,
    children,
    required = true,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="text-foreground font-medium">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );

  const inputClassName = (hasError: boolean) =>
    `h-12 bg-muted/50 border-border/50 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all ${hasError ? "border-red-500 focus:border-red-500" : ""}`;

  // Step 1: Personal Info
  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="الاسم الأول (بالعربية)" error={errors.firstName}>
          <Input
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={inputClassName(!!errors.firstName)}
            placeholder="أحمد"
          />
        </FormField>
        <FormField label="الاسم الأوسط (بالعربية)" error={errors.middleName}>
          <Input
            value={formData.middleName}
            onChange={(e) => handleInputChange("middleName", e.target.value)}
            className={inputClassName(!!errors.middleName)}
            placeholder="محمد"
          />
        </FormField>
      </div>

      <FormField label="الاسم الأخير (بالعربية)" error={errors.lastName}>
        <Input
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          className={inputClassName(!!errors.lastName)}
          placeholder="علي"
        />
      </FormField>

      <FormField label="البريد الإلكتروني" error={errors.email}>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={inputClassName(!!errors.email)}
          placeholder="example@email.com"
          dir="ltr"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="كلمة المرور" error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`${inputClassName(!!errors.password)} pe-10`}
              dir="ltr"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute start-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </FormField>
        <FormField label="تأكيد كلمة المرور" error={errors.confirmPassword}>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`${inputClassName(!!errors.confirmPassword)} pe-10`}
              dir="ltr"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute start-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </FormField>
      </div>

      <FormField label="رقم الموبايل الشخصي" error={errors.phone}>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={inputClassName(!!errors.phone)}
          placeholder="01xxxxxxxxx"
          dir="ltr"
        />
      </FormField>
    </div>
  );

  // Step 2: Academic Info
  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="الصف الدراسي" error={errors.grade}>
          <Select
            value={formData.grade}
            onValueChange={(v) => handleInputChange("grade", v)}
          >
            <SelectTrigger className={inputClassName(!!errors.grade)}>
              <SelectValue placeholder="اختر الصف" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="الشعبة" error={errors.division}>
          <Select
            value={formData.division}
            onValueChange={handleDivisionChange}
          >
            <SelectTrigger className={inputClassName(!!errors.division)}>
              <SelectValue placeholder="اختر الشعبة" />
            </SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <AnimatePresence>
        {formData.division === "scientific" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FormField label="التخصص" error={errors.scientificTrack}>
              <Select
                value={formData.scientificTrack}
                onValueChange={(v) => handleInputChange("scientificTrack", v)}
              >
                <SelectTrigger
                  className={inputClassName(!!errors.scientificTrack)}
                >
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {SCIENTIFIC_TRACKS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="المحافظة" error={errors.governorate}>
          <Select
            value={formData.governorate}
            onValueChange={handleGovernorateChange}
          >
            <SelectTrigger className={inputClassName(!!errors.governorate)}>
              <SelectValue placeholder="اختر المحافظة" />
            </SelectTrigger>
            <SelectContent>
              {GOVERNORATES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="المدينة/المنطقة" error={errors.city}>
          <Select
            value={formData.city}
            onValueChange={(v) => handleInputChange("city", v)}
            disabled={!formData.governorate}
          >
            <SelectTrigger className={inputClassName(!!errors.city)}>
              <SelectValue
                placeholder={
                  formData.governorate ? "اختر المدينة" : "اختر المحافظة أولاً"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="النوع" error={errors.gender}>
          <Select
            value={formData.gender}
            onValueChange={(v) => handleInputChange("gender", v)}
          >
            <SelectTrigger className={inputClassName(!!errors.gender)}>
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="اسم المدرسة" error={errors.schoolName}>
          <Input
            value={formData.schoolName}
            onChange={(e) => handleInputChange("schoolName", e.target.value)}
            className={inputClassName(!!errors.schoolName)}
            placeholder="اكتب اسم المدرسة"
          />
        </FormField>
      </div>

      <FormField
        label="تاريخ الميلاد"
        error={
          errors.birthYear || errors.birthMonth || errors.birthDay
            ? "تاريخ الميلاد مطلوب"
            : undefined
        }
      >
        <div className="grid grid-cols-3 gap-3">
          <Select
            value={formData.birthDay}
            onValueChange={(v) => handleInputChange("birthDay", v)}
          >
            <SelectTrigger className={inputClassName(!!errors.birthDay)}>
              <SelectValue placeholder="اليوم" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={formData.birthMonth}
            onValueChange={(v) => handleInputChange("birthMonth", v)}
          >
            <SelectTrigger className={inputClassName(!!errors.birthMonth)}>
              <SelectValue placeholder="الشهر" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={formData.birthYear}
            onValueChange={(v) => handleInputChange("birthYear", v)}
          >
            <SelectTrigger className={inputClassName(!!errors.birthYear)}>
              <SelectValue placeholder="السنة" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormField>
    </div>
  );

  // Step 3: Parent Info
  const renderStep3 = () => (
    <div className="space-y-5">
      <FormField label="رقم موبايل الأب" error={errors.fatherPhone}>
        <Input
          type="tel"
          value={formData.fatherPhone}
          onChange={(e) => handleInputChange("fatherPhone", e.target.value)}
          className={inputClassName(!!errors.fatherPhone)}
          placeholder="01xxxxxxxxx"
          dir="ltr"
        />
      </FormField>

      <FormField label="رقم موبايل الأم" error={errors.motherPhone}>
        <Input
          type="tel"
          value={formData.motherPhone}
          onChange={(e) => handleInputChange("motherPhone", e.target.value)}
          className={inputClassName(!!errors.motherPhone)}
          placeholder="01xxxxxxxxx"
          dir="ltr"
        />
      </FormField>

      <FormField
        label="صورة البطاقة أو شهادة ميلاد الرقم القومي"
        error={errors.idImage}
      >
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 ${
            errors.idImage ? "border-red-500 bg-red-500/5" : "border-border"
          }`}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="relative">
              <Image
                src={imagePreview}
                alt="ID Preview"
                width={300}
                height={200}
                className="mx-auto rounded-lg object-contain max-h-48"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 end-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">
                اضغط لرفع الصورة
              </p>
              <p className="text-sm text-muted-foreground">PNG, JPG حتى 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </FormField>

      {/* Trust indicator */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <Shield className="w-5 h-5 text-green-600" />
        <p className="text-sm text-green-700 dark:text-green-400">
          بياناتك محمية ومشفرة بالكامل
        </p>
      </div>
    </div>
  );

  // Step 4: Terms
  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "التسجيل / الحضور",
            items: [
              "يجب التسجيل ببياناتك الحقيقية",
              "الحضور في المواعيد المحددة",
              "عدم مشاركة بيانات الحساب",
              "الالتزام بقواعد السلوك",
            ],
          },
          {
            title: "المحاضرات / الباقات",
            items: [
              "المحاضرات متاحة حسب الباقة",
              "لا يمكن استرداد قيمة الباقات",
              "المحتوى محمي بحقوق الملكية",
              "يمنع تسجيل أو نشر المحاضرات",
            ],
          },
          {
            title: "الأكواد والمحفظة",
            items: [
              "الأكواد صالحة لمرة واحدة",
              "الرصيد غير قابل للاسترداد",
              "يمكن استخدام المحفظة للباقات",
              "الأكواد لها تاريخ صلاحية",
            ],
          },
          {
            title: "شروط عامة",
            items: [
              "يحق للإدارة تعديل الشروط",
              "المخالفة تؤدي لإيقاف الحساب",
              "الإدارة غير مسؤولة عن سوء الاستخدام",
              "يجب الإبلاغ عن المشاكل فوراً",
            ],
          },
        ].map((section, idx) => (
          <Card key={idx} className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
          errors.agreeToTerms
            ? "bg-red-500/10 border-red-500"
            : formData.agreeToTerms
              ? "bg-green-500/10 border-green-500"
              : "bg-muted/50 border-border"
        }`}
      >
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) =>
            handleInputChange("agreeToTerms", checked as boolean)
          }
          className="mt-0.5"
        />
        <Label
          htmlFor="terms"
          className="text-foreground cursor-pointer leading-relaxed"
        >
          أوافق على جميع الشروط والأحكام المذكورة أعلاه وأتعهد بالالتزام بها
        </Label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-red-500 text-sm animate-in fade-in duration-200">
          {errors.agreeToTerms}
        </p>
      )}
    </div>
  );

  // Success state
  if (isComplete) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">تم إنشاء حسابك بنجاح!</h1>
          <p className="text-muted-foreground mb-4">
            جاري تحويلك للوحة التحكم...
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            إنشاء حسابك الشخصي
          </h1>
          <p className="text-muted-foreground mt-2">
            انضم لمنصة الأستاذ رضا الفاروق التعليمية
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form Card */}
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-6">
            <div className="animate-in fade-in duration-200">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 h-12"
                >
                  <ArrowRight className="w-4 h-4 me-2" />
                  السابق
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  التالي
                  <ArrowLeft className="w-4 h-4 ms-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 me-2" />
                      إنشاء الحساب
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>اتصال آمن ومشفر</span>
        </div>

        {/* Login Link */}
        <p className="text-center mt-4 text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/ar/auth/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
