// Short-form Arabic Tips System
// Quick educational content (30-90 seconds) for continuous learning

export type TipCategory = 
  | 'grammar'      // النحو
  | 'vocabulary'   // المفردات
  | 'pronunciation' // النطق
  | 'writing'      // الكتابة
  | 'rhetoric'     // البلاغة
  | 'literature'   // الأدب
  | 'poetry'       // الشعر
  | 'common-mistakes'; // الأخطاء الشائعة

export type TipFormat = 'video' | 'text' | 'audio' | 'infographic';

export type TipDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Tip {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  format: TipFormat;
  difficulty: TipDifficulty;
  gradeLevel: '1' | '2' | '3' | 'all'; // Grade-specific or all grades
  
  // Content
  videoUrl?: string;
  thumbnailUrl?: string;
  textContent?: string;
  audioUrl?: string;
  imageUrl?: string;
  
  // Metadata
  duration: number; // seconds
  views: number;
  likes: number;
  saves: number;
  shares: number;
  
  // Educational
  keyPoints: string[];
  examples: string[];
  relatedTopics: string[];
  
  // Timestamps
  createdAt: Date;
  publishedAt: Date;
  
  // Teacher info
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
}

export interface TipInteraction {
  id: string;
  tipId: string;
  userId: string;
  liked: boolean;
  saved: boolean;
  completed: boolean;
  watchTime: number; // seconds watched
  timestamp: Date;
}

export interface TipProgress {
  userId: string;
  totalTipsWatched: number;
  totalWatchTime: number; // minutes
  categoriesProgress: {
    [key in TipCategory]: {
      tipsWatched: number;
      totalTime: number;
    };
  };
  streak: number; // consecutive days watching tips
  lastWatchedAt: Date;
}

export interface TipPlaylist {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  gradeLevel: '1' | '2' | '3' | 'all';
  tipIds: string[];
  thumbnailUrl?: string;
  totalDuration: number;
  createdAt: Date;
  createdBy: string;
}

// Category metadata
export const TIP_CATEGORIES: Record<TipCategory, {
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
}> = {
  grammar: {
    nameAr: 'النحو',
    nameEn: 'Grammar',
    icon: '📚',
    color: 'blue',
    description: 'قواعد النحو والإعراب',
  },
  vocabulary: {
    nameAr: 'المفردات',
    nameEn: 'Vocabulary',
    icon: '📖',
    color: 'green',
    description: 'كلمات ومصطلحات جديدة',
  },
  pronunciation: {
    nameAr: 'النطق',
    nameEn: 'Pronunciation',
    icon: '🗣️',
    color: 'purple',
    description: 'النطق الصحيح للكلمات',
  },
  writing: {
    nameAr: 'الكتابة',
    nameEn: 'Writing',
    icon: '✍️',
    color: 'orange',
    description: 'مهارات الكتابة والإملاء',
  },
  rhetoric: {
    nameAr: 'البلاغة',
    nameEn: 'Rhetoric',
    icon: '🎭',
    color: 'pink',
    description: 'علم البلاغة والبيان',
  },
  literature: {
    nameAr: 'الأدب',
    nameEn: 'Literature',
    icon: '📜',
    color: 'indigo',
    description: 'الأدب العربي والنصوص',
  },
  poetry: {
    nameAr: 'الشعر',
    nameEn: 'Poetry',
    icon: '🎵',
    color: 'teal',
    description: 'الشعر العربي والعروض',
  },
  'common-mistakes': {
    nameAr: 'الأخطاء الشائعة',
    nameEn: 'Common Mistakes',
    icon: '⚠️',
    color: 'red',
    description: 'الأخطاء الشائعة وتصحيحها',
  },
};

// Difficulty levels
export const TIP_DIFFICULTY: Record<TipDifficulty, {
  nameAr: string;
  nameEn: string;
  color: string;
}> = {
  beginner: {
    nameAr: 'مبتدئ',
    nameEn: 'Beginner',
    color: 'green',
  },
  intermediate: {
    nameAr: 'متوسط',
    nameEn: 'Intermediate',
    color: 'yellow',
  },
  advanced: {
    nameAr: 'متقدم',
    nameEn: 'Advanced',
    color: 'red',
  },
};

