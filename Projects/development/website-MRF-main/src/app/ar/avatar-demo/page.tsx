"use client";

/**
 * Avatar Demo Page
 * Showcase the customizable avatar system
 */

import { AvatarCustomizer, AvatarDisplay } from "@/components/avatar";
import { useAvatar } from "@/contexts/AvatarContext";
import { motion } from "framer-motion";
import { ArrowLeft, Gem, Palette, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AvatarDemoPage() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const { config, ownedParts } = useAvatar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/ar/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold">نظام الصورة الشخصية</h1>
              <p className="text-sm text-gray-500">تخصيص صورتك الشخصية</p>
            </div>
          </div>

          {/* Gems Display */}
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
            <Gem className="w-5 h-5 text-purple-500" />
            <span className="font-bold text-purple-600 dark:text-purple-400">٥٠٠</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            {/* Main Avatar Display */}
            <AvatarDisplay
              size={200}
              onClick={() => setIsCustomizerOpen(true)}
              animated={true}
              className="cursor-pointer hover:shadow-2xl transition-shadow duration-300 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800"
            />
            
            {/* Edit Badge */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCustomizerOpen(true)}
              className="absolute -bottom-2 -end-2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Palette className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          <h2 className="font-display text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            اصنع صورتك الشخصية
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            خصّص صورتك الشخصية بالطريقة التي تعبر عنك. اختر الوجه، الشعر، الملابس والإكسسوارات!
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCustomizerOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ التخصيص
          </motion.button>
        </motion.section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Palette className="w-8 h-8" />}
            title="تخصيص كامل"
            description="اختر من أكثر من ١٠ فئات مختلفة: الوجه، البشرة، الشعر، العيون، الفم، النظارات، الإكسسوارات والمزيد!"
            color="purple"
          />
          <FeatureCard
            icon={<Gem className="w-8 h-8" />}
            title="اشترِ بالجواهر"
            description="استخدم الجواهر التي تكسبها من التعلم لفتح عناصر نادرة وأسطورية حصرية!"
            color="pink"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="افتح بالإنجازات"
            description="بعض العناصر تُفتح فقط بالوصول لمستويات معينة أو الحفاظ على سلسلة تعلم طويلة!"
            color="blue"
          />
        </section>

        {/* Stats */}
        <section className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg">
          <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            إحصائياتك
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              value={ownedParts.length}
              label="عنصر مملوك"
              color="purple"
            />
            <StatCard
              value="١٠+"
              label="فئة متاحة"
              color="blue"
            />
            <StatCard
              value="٨٠+"
              label="عنصر إجمالي"
              color="green"
            />
            <StatCard
              value="٥"
              label="ندرات مختلفة"
              color="orange"
            />
          </div>
        </section>

        {/* Preview Grid - Different Avatar Sizes */}
        <section className="mt-12">
          <h3 className="font-display text-xl font-bold mb-6">
            كيف ستظهر صورتك
          </h3>

          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className="text-center">
              <AvatarDisplay size={40} className="shadow-md rounded-full" />
              <p className="text-xs text-gray-500 mt-2">صغير</p>
            </div>
            <div className="text-center">
              <AvatarDisplay size={60} className="shadow-md rounded-full" />
              <p className="text-xs text-gray-500 mt-2">شريط التنقل</p>
            </div>
            <div className="text-center">
              <AvatarDisplay size={80} className="shadow-md rounded-full" />
              <p className="text-xs text-gray-500 mt-2">التعليقات</p>
            </div>
            <div className="text-center">
              <AvatarDisplay size={120} className="shadow-md rounded-full" />
              <p className="text-xs text-gray-500 mt-2">الملف الشخصي</p>
            </div>
            <div className="text-center">
              <AvatarDisplay size={160} animated className="shadow-md rounded-full" />
              <p className="text-xs text-gray-500 mt-2">المتصدرين</p>
            </div>
          </div>
        </section>
      </main>

      {/* Customizer Modal */}
      <AvatarCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        userGems={500}
        userLevel={10}
        userStreak={15}
        userAchievements={["gold-league"]}
      />
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "pink" | "blue";
}) {
  const colorClasses = {
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className={`w-14 h-14 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color: "purple" | "blue" | "green" | "orange";
}) {
  const colorClasses = {
    purple: "text-purple-600 dark:text-purple-400",
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>
        {typeof value === "number" ? value.toLocaleString("ar-EG") : value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}
