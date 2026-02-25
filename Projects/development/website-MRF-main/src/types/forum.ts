// Arabic Discussion Forums - Community Peer Learning
// Enables students to ask questions, share knowledge, and help each other

export type ForumCategory =
  | 'general' // General discussion
  | 'arabic' // Arabic language
  | 'math' // Mathematics
  | 'science' // Science subjects
  | 'english' // English language
  | 'social' // Social studies
  | 'exam-prep' // Exam preparation
  | 'study-tips' // Study tips and techniques
  | 'homework-help'; // Homework assistance

export type ThreadStatus = 'open' | 'answered' | 'closed' | 'pinned';

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  status: ThreadStatus;
  
  // Author info
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorLevel: number;
  authorBadge?: string;
  
  // Grade level targeting
  gradeLevel: '1' | '2' | '3' | 'all';
  
  // Engagement metrics
  viewCount: number;
  replyCount: number;
  likeCount: number;
  
  // Tags for better searchability
  tags: string[];
  
  // Moderation
  isApproved: boolean;
  isPinned: boolean;
  isLocked: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt?: Date;
}

export interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  
  // Author info
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorLevel: number;
  
  // Engagement
  likeCount: number;
  isAcceptedAnswer: boolean;
  
  // Reply to another reply (nested)
  parentReplyId?: string;
  
  // Moderation
  isApproved: boolean;
  isEdited: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumLike {
  id: string;
  userId: string;
  targetType: 'thread' | 'reply';
  targetId: string;
  createdAt: Date;
}

export interface ForumReport {
  id: string;
  reporterId: string;
  targetType: 'thread' | 'reply';
  targetId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'off-topic' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

// Category metadata with Arabic translations
export const FORUM_CATEGORIES: Record<ForumCategory, { name: string; nameAr: string; icon: string; color: string }> = {
  general: { name: 'General', nameAr: 'عام', icon: '💬', color: 'gray' },
  arabic: { name: 'Arabic', nameAr: 'اللغة العربية', icon: '📖', color: 'green' },
  math: { name: 'Mathematics', nameAr: 'الرياضيات', icon: '🔢', color: 'blue' },
  science: { name: 'Science', nameAr: 'العلوم', icon: '🔬', color: 'purple' },
  english: { name: 'English', nameAr: 'اللغة الإنجليزية', icon: '🌍', color: 'red' },
  social: { name: 'Social Studies', nameAr: 'الدراسات الاجتماعية', icon: '🌐', color: 'orange' },
  'exam-prep': { name: 'Exam Prep', nameAr: 'التحضير للامتحانات', icon: '📝', color: 'yellow' },
  'study-tips': { name: 'Study Tips', nameAr: 'نصائح الدراسة', icon: '💡', color: 'cyan' },
  'homework-help': { name: 'Homework Help', nameAr: 'مساعدة الواجبات', icon: '📚', color: 'indigo' },
};

// XP rewards for forum participation
export const FORUM_XP_REWARDS = {
  CREATE_THREAD: 10,
  REPLY_TO_THREAD: 5,
  RECEIVE_LIKE: 2,
  ANSWER_ACCEPTED: 25,
  FIRST_REPLY: 15, // First to reply to a thread
  HELPFUL_ANSWER: 10, // Answer with 5+ likes
};

// Gem rewards for forum participation
export const FORUM_GEM_REWARDS = {
  ANSWER_ACCEPTED: 5,
  HELPFUL_ANSWER: 3, // Answer with 10+ likes
  TOP_CONTRIBUTOR_WEEKLY: 25,
  TOP_CONTRIBUTOR_MONTHLY: 100,
};

// Helper functions
export function getCategoryInfo(category: ForumCategory) {
  return FORUM_CATEGORIES[category];
}

export function getStatusColor(status: ThreadStatus): string {
  const colors = {
    open: 'blue',
    answered: 'green',
    closed: 'gray',
    pinned: 'yellow',
  };
  return colors[status];
}

export function getStatusLabel(status: ThreadStatus): { en: string; ar: string } {
  const labels = {
    open: { en: 'Open', ar: 'مفتوح' },
    answered: { en: 'Answered', ar: 'تمت الإجابة' },
    closed: { en: 'Closed', ar: 'مغلق' },
    pinned: { en: 'Pinned', ar: 'مثبت' },
  };
  return labels[status];
}

