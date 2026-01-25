"use client";

/**
 * Video Testimonials Section - Phase 1 Task 1.4
 * Student success stories with video testimonials
 */

import { Button } from "@/components/ui/button";
import { EnhancedSkeleton } from "@/components/loading";
import { Play, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  grade: string;
  score: number;
  avatar: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: string;
  quote: string;
  year: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "أحمد محمد",
    grade: "الثالث الثانوي",
    score: 98,
    avatar: "/testimonials/ahmed.jpg",
    thumbnail: "/testimonials/ahmed-video-thumb.jpg",
    duration: "2:34",
    quote: "بفضل الأستاذ رضا حصلت على 98% في الثانوية العامة. شرحه واضح ومبسط جداً.",
    year: "2025",
  },
  {
    id: "2",
    name: "فاطمة أحمد",
    grade: "الثالث الثانوي",
    score: 97,
    avatar: "/testimonials/fatima.jpg",
    thumbnail: "/testimonials/fatima-video-thumb.jpg",
    duration: "3:12",
    quote: "المنصة ساعدتني أتفوق في اللغة العربية وأحقق حلمي. شكراً للأستاذ رضا!",
    year: "2025",
  },
  {
    id: "3",
    name: "محمد علي",
    grade: "الثالث الثانوي",
    score: 96,
    avatar: "/testimonials/mohammed.jpg",
    thumbnail: "/testimonials/mohammed-video-thumb.jpg",
    duration: "2:45",
    quote: "الدروس التفاعلية والاختبارات الذكية خلتني أحب المادة وأتفوق فيها.",
    year: "2024",
  },
];

export function TestimonialsSection() {
  const [selectedVideo, setSelectedVideo] = useState<Testimonial | null>(null);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-success-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-success-500/10 border border-success-500/20 rounded-full">
            <Star className="w-4 h-4 text-success-500 fill-success-500" />
            <span className="text-sm font-semibold text-success-600 dark:text-success-400">
              قصص النجاح
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-foreground">
            <span className="block mb-2">طلابنا المتفوقون</span>
            <span className="text-premium-gradient">يشاركون تجربتهم</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف كيف ساعدت منصة الأستاذ رضا آلاف الطلاب في تحقيق التفوق
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onClick={() => setSelectedVideo(testimonial)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            هل تريد أن تكون التالي في قصص النجاح؟
          </p>
          <Button
            size="lg"
            className="bg-premium-gradient hover:opacity-90 text-white px-8 h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/25"
          >
            ابدأ رحلتك الآن
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          testimonial={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
}

// ============================================================================
// TESTIMONIAL CARD COMPONENT
// ============================================================================

function TestimonialCard({
  testimonial,
  onClick,
}: {
  testimonial: Testimonial;
  onClick: () => void;
}) {
  return (
    <div className="group relative">
      <div className="relative rounded-2xl overflow-hidden glass border border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {/* Placeholder for video thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-brand-coral-500/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xl backdrop-blur-sm">
                <Play className="w-8 h-8 text-primary me-1" />
              </div>
              {testimonial.duration && (
                <span className="text-sm font-medium text-foreground">
                  {testimonial.duration}
                </span>
              )}
            </div>
          </div>

          {/* Play button overlay */}
          <button
            onClick={onClick}
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all duration-300 cursor-pointer group"
            aria-label={`شاهد شهادة ${testimonial.name}`}
          >
            <div className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform backdrop-blur-sm">
              <Play className="w-7 h-7 text-primary me-1" />
            </div>
          </button>

          {/* Score badge */}
          <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm">
            {testimonial.score}%
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-brand-coral-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {testimonial.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground">
                {testimonial.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {testimonial.grade} • {testimonial.year}
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="relative">
            <Quote className="w-6 h-6 text-primary/20 absolute -top-2 -right-2" />
            <p className="text-sm text-muted-foreground leading-relaxed pe-4">
              {testimonial.quote}
            </p>
          </div>

          {/* Rating Stars */}
          <div className="flex gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-amber-400 fill-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIDEO MODAL COMPONENT
// ============================================================================

function VideoModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 left-0 text-white hover:text-gray-300 text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded px-2 py-1"
          aria-label="إغلاق نافذة الفيديو"
        >
          ✕ إغلاق
        </button>
        <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Play className="w-10 h-10 opacity-50" />
              </div>
              <h3 id="video-modal-title" className="text-2xl font-bold mb-2">
                {testimonial.name}
              </h3>
              <p className="text-lg mb-4">النتيجة: {testimonial.score}%</p>
              <p className="text-sm text-gray-400">
                سيتم إضافة فيديو الشهادة قريباً
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection;
