"use client";

/**
 * WelcomeStep - First onboarding step
 * Welcome video and introduction
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingStepWrapper } from "./OnboardingFlow";
import { Play, Star, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function WelcomeStep() {
  return (
    <OnboardingStepWrapper
      title="مرحباً بك في منصة MRF التعليمية"
      description="انطلق في رحلتك التعليمية مع الأستاذ رضا الفاروق"
      icon={
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-2xl shadow-primary/50">
          <Trophy className="w-10 h-10 text-white" />
        </div>
      }
    >
      {/* Video Player Placeholder */}
      <Card className="glass border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all">
            {/* Play Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors"
            >
              <Play className="w-10 h-10 text-primary fill-primary mr-[-4px]" />
            </motion.div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <Badge className="bg-white/20 text-white border-0 mb-2">
                30 ثانية
              </Badge>
              <h3 className="text-white font-bold text-lg">
                رسالة ترحيب من الأستاذ رضا الفاروق
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <FeatureCard
          icon={<Star className="w-6 h-6 text-amber-500" />}
          title="31 عاماً من الخبرة"
          description="أفضل أستاذ في مصر"
        />
        <FeatureCard
          icon={<Users className="w-6 h-6 text-blue-500" />}
          title="+10,000 طالب"
          description="نجحوا بتفوق"
        />
        <FeatureCard
          icon={<Trophy className="w-6 h-6 text-success-500" />}
          title="98% معدل نجاح"
          description="في الثانوية العامة"
        />
      </div>
    </OnboardingStepWrapper>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass border-border/50 h-full">
        <CardContent className="p-5 text-center space-y-2">
          <div className="flex justify-center">{icon}</div>
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WelcomeStep;
