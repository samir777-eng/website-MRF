/**
 * Avatar System Types - Real Customizable Avatars
 * SVG-based avatar builder with mix-and-match components
 */

// ============================================================================
// AVATAR PARTS
// ============================================================================

export type AvatarPartType =
  | "face" // Face shape
  | "skin" // Skin tone
  | "hair" // Hair style
  | "hairColor" // Hair color
  | "eyes" // Eye style
  | "eyebrows" // Eyebrow style
  | "mouth" // Mouth/expression
  | "glasses" // Glasses (optional)
  | "accessory" // Hat, headphones, etc.
  | "clothing" // Shirt/top style
  | "background"; // Background color/gradient

export type Rarity = "free" | "common" | "rare" | "epic" | "legendary";

export type UnlockMethod = "free" | "gems" | "level" | "streak" | "achievement";

export interface AvatarPart {
  id: string;
  type: AvatarPartType;
  name: string;
  nameAr: string;

  // For colors (skin, hair, background)
  value?: string;

  // Unlock
  rarity: Rarity;
  unlockMethod: UnlockMethod;
  gemCost?: number;
  levelRequired?: number;
  streakRequired?: number;
  achievementId?: string;

  sortOrder: number;
}

// ============================================================================
// USER AVATAR CONFIG
// ============================================================================

export interface AvatarConfig {
  face: string;
  skin: string;
  hair: string;
  hairColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  glasses: string | null;
  accessory: string | null;
  clothing: string;
  background: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  face: "face-round",
  skin: "skin-3",
  hair: "hair-short",
  hairColor: "haircolor-black",
  eyes: "eyes-normal",
  eyebrows: "brows-normal",
  mouth: "mouth-smile",
  glasses: null,
  accessory: null,
  clothing: "clothing-tshirt",
  background: "bg-purple",
};

// ============================================================================
// AVATAR PARTS CATALOG
// ============================================================================

export const AVATAR_PARTS: AvatarPart[] = [
  // ========== FACE SHAPES ==========
  {
    id: "face-round",
    type: "face",
    name: "Round",
    nameAr: "دائري",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "face-oval",
    type: "face",
    name: "Oval",
    nameAr: "بيضاوي",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "face-square",
    type: "face",
    name: "Square",
    nameAr: "مربع",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "face-heart",
    type: "face",
    name: "Heart",
    nameAr: "قلب",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 3,
  },

  // ========== SKIN TONES ==========
  {
    id: "skin-1",
    type: "skin",
    name: "Light",
    nameAr: "فاتح",
    value: "#FFDBB4",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "skin-2",
    type: "skin",
    name: "Light Medium",
    nameAr: "فاتح متوسط",
    value: "#E8B298",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "skin-3",
    type: "skin",
    name: "Medium",
    nameAr: "متوسط",
    value: "#D4A574",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "skin-4",
    type: "skin",
    name: "Medium Dark",
    nameAr: "متوسط داكن",
    value: "#C28B5A",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 3,
  },
  {
    id: "skin-5",
    type: "skin",
    name: "Dark",
    nameAr: "داكن",
    value: "#8D5524",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 4,
  },
  {
    id: "skin-6",
    type: "skin",
    name: "Deep",
    nameAr: "عميق",
    value: "#5C3317",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 5,
  },

  // ========== HAIR STYLES ==========
  {
    id: "hair-none",
    type: "hair",
    name: "Bald",
    nameAr: "أصلع",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "hair-short",
    type: "hair",
    name: "Short",
    nameAr: "قصير",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "hair-medium",
    type: "hair",
    name: "Medium",
    nameAr: "متوسط",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "hair-long",
    type: "hair",
    name: "Long",
    nameAr: "طويل",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 3,
  },
  {
    id: "hair-curly",
    type: "hair",
    name: "Curly",
    nameAr: "مجعد",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 4,
  },
  {
    id: "hair-wavy",
    type: "hair",
    name: "Wavy",
    nameAr: "مموج",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 25,
    sortOrder: 5,
  },
  {
    id: "hair-spiky",
    type: "hair",
    name: "Spiky",
    nameAr: "شائك",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 30,
    sortOrder: 6,
  },
  {
    id: "hair-ponytail",
    type: "hair",
    name: "Ponytail",
    nameAr: "ذيل حصان",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 35,
    sortOrder: 7,
  },
  {
    id: "hair-hijab",
    type: "hair",
    name: "Hijab",
    nameAr: "حجاب",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 8,
  },
  {
    id: "hair-mohawk",
    type: "hair",
    name: "Mohawk",
    nameAr: "موهوك",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 75,
    sortOrder: 9,
  },

  // ========== HAIR COLORS ==========
  {
    id: "haircolor-black",
    type: "hairColor",
    name: "Black",
    nameAr: "أسود",
    value: "#1A1A1A",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "haircolor-brown",
    type: "hairColor",
    name: "Brown",
    nameAr: "بني",
    value: "#4A3728",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "haircolor-blonde",
    type: "hairColor",
    name: "Blonde",
    nameAr: "أشقر",
    value: "#D4A756",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "haircolor-red",
    type: "hairColor",
    name: "Red",
    nameAr: "أحمر",
    value: "#8B3A3A",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 30,
    sortOrder: 3,
  },
  {
    id: "haircolor-gray",
    type: "hairColor",
    name: "Gray",
    nameAr: "رمادي",
    value: "#808080",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 25,
    sortOrder: 4,
  },
  {
    id: "haircolor-blue",
    type: "hairColor",
    name: "Blue",
    nameAr: "أزرق",
    value: "#4A90D9",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 5,
  },
  {
    id: "haircolor-pink",
    type: "hairColor",
    name: "Pink",
    nameAr: "وردي",
    value: "#E75480",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 6,
  },
  {
    id: "haircolor-purple",
    type: "hairColor",
    name: "Purple",
    nameAr: "بنفسجي",
    value: "#8B5CF6",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 7,
  },
  {
    id: "haircolor-green",
    type: "hairColor",
    name: "Green",
    nameAr: "أخضر",
    value: "#10B981",
    rarity: "epic",
    unlockMethod: "level",
    levelRequired: 15,
    sortOrder: 8,
  },
  {
    id: "haircolor-rainbow",
    type: "hairColor",
    name: "Rainbow",
    nameAr: "قوس قزح",
    value: "rainbow",
    rarity: "legendary",
    unlockMethod: "achievement",
    achievementId: "100-day-streak",
    sortOrder: 9,
  },

  // ========== EYES ==========
  {
    id: "eyes-normal",
    type: "eyes",
    name: "Normal",
    nameAr: "عادي",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "eyes-happy",
    type: "eyes",
    name: "Happy",
    nameAr: "سعيد",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "eyes-sleepy",
    type: "eyes",
    name: "Sleepy",
    nameAr: "نعسان",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "eyes-wink",
    type: "eyes",
    name: "Wink",
    nameAr: "غمزة",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 3,
  },
  {
    id: "eyes-stars",
    type: "eyes",
    name: "Star Eyes",
    nameAr: "عيون نجمة",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 50,
    sortOrder: 4,
  },
  {
    id: "eyes-heart",
    type: "eyes",
    name: "Heart Eyes",
    nameAr: "عيون قلب",
    rarity: "rare",
    unlockMethod: "streak",
    streakRequired: 14,
    sortOrder: 5,
  },

  // ========== EYEBROWS ==========
  {
    id: "brows-normal",
    type: "eyebrows",
    name: "Normal",
    nameAr: "عادي",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "brows-raised",
    type: "eyebrows",
    name: "Raised",
    nameAr: "مرفوع",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "brows-angry",
    type: "eyebrows",
    name: "Angry",
    nameAr: "غاضب",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "brows-worried",
    type: "eyebrows",
    name: "Worried",
    nameAr: "قلق",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 15,
    sortOrder: 3,
  },
  {
    id: "brows-unibrow",
    type: "eyebrows",
    name: "Unibrow",
    nameAr: "حاجب واحد",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 4,
  },

  // ========== MOUTH ==========
  {
    id: "mouth-smile",
    type: "mouth",
    name: "Smile",
    nameAr: "ابتسامة",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "mouth-grin",
    type: "mouth",
    name: "Grin",
    nameAr: "ابتسامة عريضة",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "mouth-neutral",
    type: "mouth",
    name: "Neutral",
    nameAr: "محايد",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "mouth-open",
    type: "mouth",
    name: "Open",
    nameAr: "مفتوح",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 3,
  },
  {
    id: "mouth-teeth",
    type: "mouth",
    name: "Teeth",
    nameAr: "أسنان",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 4,
  },
  {
    id: "mouth-tongue",
    type: "mouth",
    name: "Tongue",
    nameAr: "لسان",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 25,
    sortOrder: 5,
  },

  // ========== GLASSES (Optional) ==========
  {
    id: "glasses-none",
    type: "glasses",
    name: "None",
    nameAr: "بدون",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "glasses-round",
    type: "glasses",
    name: "Round",
    nameAr: "دائري",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "glasses-square",
    type: "glasses",
    name: "Square",
    nameAr: "مربع",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 30,
    sortOrder: 2,
  },
  {
    id: "glasses-sunglasses",
    type: "glasses",
    name: "Sunglasses",
    nameAr: "نظارات شمسية",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 40,
    sortOrder: 3,
  },
  {
    id: "glasses-aviator",
    type: "glasses",
    name: "Aviator",
    nameAr: "طيار",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 75,
    sortOrder: 4,
  },
  {
    id: "glasses-nerd",
    type: "glasses",
    name: "Nerd",
    nameAr: "نيرد",
    rarity: "rare",
    unlockMethod: "level",
    levelRequired: 10,
    sortOrder: 5,
  },

  // ========== ACCESSORIES (Optional) ==========
  {
    id: "acc-none",
    type: "accessory",
    name: "None",
    nameAr: "بدون",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "acc-cap",
    type: "accessory",
    name: "Cap",
    nameAr: "قبعة",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 35,
    sortOrder: 1,
  },
  {
    id: "acc-beanie",
    type: "accessory",
    name: "Beanie",
    nameAr: "بيني",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 40,
    sortOrder: 2,
  },
  {
    id: "acc-headphones",
    type: "accessory",
    name: "Headphones",
    nameAr: "سماعات",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 80,
    sortOrder: 3,
  },
  {
    id: "acc-crown",
    type: "accessory",
    name: "Crown",
    nameAr: "تاج",
    rarity: "legendary",
    unlockMethod: "achievement",
    achievementId: "diamond-league",
    sortOrder: 4,
  },
  {
    id: "acc-halo",
    type: "accessory",
    name: "Halo",
    nameAr: "هالة",
    rarity: "epic",
    unlockMethod: "streak",
    streakRequired: 30,
    sortOrder: 5,
  },
  {
    id: "acc-earbuds",
    type: "accessory",
    name: "Earbuds",
    nameAr: "سماعات أذن",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 45,
    sortOrder: 6,
  },

  // ========== CLOTHING ==========
  {
    id: "clothing-tshirt",
    type: "clothing",
    name: "T-Shirt",
    nameAr: "تيشيرت",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "clothing-hoodie",
    type: "clothing",
    name: "Hoodie",
    nameAr: "هودي",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "clothing-jacket",
    type: "clothing",
    name: "Jacket",
    nameAr: "جاكيت",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 40,
    sortOrder: 2,
  },
  {
    id: "clothing-sweater",
    type: "clothing",
    name: "Sweater",
    nameAr: "سويتر",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 35,
    sortOrder: 3,
  },
  {
    id: "clothing-shirt",
    type: "clothing",
    name: "Shirt",
    nameAr: "قميص",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 30,
    sortOrder: 4,
  },
  {
    id: "clothing-tank",
    type: "clothing",
    name: "Tank Top",
    nameAr: "تانك توب",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 25,
    sortOrder: 5,
  },

  // ========== BACKGROUNDS ==========
  {
    id: "bg-purple",
    type: "background",
    name: "Purple",
    nameAr: "بنفسجي",
    value: "#8B5CF6",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 0,
  },
  {
    id: "bg-blue",
    type: "background",
    name: "Blue",
    nameAr: "أزرق",
    value: "#3B82F6",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 1,
  },
  {
    id: "bg-green",
    type: "background",
    name: "Green",
    nameAr: "أخضر",
    value: "#10B981",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 2,
  },
  {
    id: "bg-orange",
    type: "background",
    name: "Orange",
    nameAr: "برتقالي",
    value: "#F97316",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 3,
  },
  {
    id: "bg-pink",
    type: "background",
    name: "Pink",
    nameAr: "وردي",
    value: "#EC4899",
    rarity: "free",
    unlockMethod: "free",
    sortOrder: 4,
  },
  {
    id: "bg-red",
    type: "background",
    name: "Red",
    nameAr: "أحمر",
    value: "#EF4444",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 5,
  },
  {
    id: "bg-yellow",
    type: "background",
    name: "Yellow",
    nameAr: "أصفر",
    value: "#EAB308",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 20,
    sortOrder: 6,
  },
  {
    id: "bg-cyan",
    type: "background",
    name: "Cyan",
    nameAr: "سماوي",
    value: "#06B6D4",
    rarity: "common",
    unlockMethod: "gems",
    gemCost: 25,
    sortOrder: 7,
  },
  {
    id: "bg-gradient-sunset",
    type: "background",
    name: "Sunset",
    nameAr: "غروب",
    value: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 8,
  },
  {
    id: "bg-gradient-ocean",
    type: "background",
    name: "Ocean",
    nameAr: "محيط",
    value: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 9,
  },
  {
    id: "bg-gradient-forest",
    type: "background",
    name: "Forest",
    nameAr: "غابة",
    value: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    rarity: "rare",
    unlockMethod: "gems",
    gemCost: 60,
    sortOrder: 10,
  },
  {
    id: "bg-gradient-galaxy",
    type: "background",
    name: "Galaxy",
    nameAr: "مجرة",
    value: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)",
    rarity: "epic",
    unlockMethod: "level",
    levelRequired: 20,
    sortOrder: 11,
  },
  {
    id: "bg-gold",
    type: "background",
    name: "Gold",
    nameAr: "ذهبي",
    value: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    rarity: "legendary",
    unlockMethod: "achievement",
    achievementId: "gold-league",
    sortOrder: 12,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPartsByType(type: AvatarPartType): AvatarPart[] {
  return AVATAR_PARTS.filter((part) => part.type === type).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getPartById(id: string): AvatarPart | undefined {
  return AVATAR_PARTS.find((part) => part.id === id);
}

export function getRarityColor(rarity: Rarity): string {
  const colors = {
    free: "text-gray-500 bg-gray-100 dark:bg-gray-800",
    common: "text-green-600 bg-green-100 dark:bg-green-900/30",
    rare: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    epic: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    legendary: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  };
  return colors[rarity];
}

export function getRarityLabel(rarity: Rarity): string {
  const labels = {
    free: "مجاني",
    common: "شائع",
    rare: "نادر",
    epic: "ملحمي",
    legendary: "أسطوري",
  };
  return labels[rarity];
}

export function canUnlockPart(
  part: AvatarPart,
  userLevel: number,
  userStreak: number,
  userAchievements: string[],
  userGems: number,
): { canUnlock: boolean; reason?: string } {
  switch (part.unlockMethod) {
    case "free":
      return { canUnlock: true };

    case "gems":
      if (userGems >= (part.gemCost || 0)) {
        return { canUnlock: true };
      }
      return { canUnlock: false, reason: `تحتاج ${part.gemCost} جوهرة` };

    case "level":
      if (userLevel >= (part.levelRequired || 0)) {
        return { canUnlock: true };
      }
      return {
        canUnlock: false,
        reason: `تحتاج المستوى ${part.levelRequired}`,
      };

    case "streak":
      if (userStreak >= (part.streakRequired || 0)) {
        return { canUnlock: true };
      }
      return {
        canUnlock: false,
        reason: `تحتاج سلسلة ${part.streakRequired} يوم`,
      };

    case "achievement":
      if (userAchievements.includes(part.achievementId || "")) {
        return { canUnlock: true };
      }
      return { canUnlock: false, reason: "أكمل الإنجاز المطلوب" };

    default:
      return { canUnlock: false };
  }
}

// Part type labels in Arabic
export const PART_TYPE_LABELS: Record<AvatarPartType, string> = {
  face: "شكل الوجه",
  skin: "لون البشرة",
  hair: "تسريحة الشعر",
  hairColor: "لون الشعر",
  eyes: "العيون",
  eyebrows: "الحواجب",
  mouth: "الفم",
  glasses: "النظارات",
  accessory: "الإكسسوارات",
  clothing: "الملابس",
  background: "الخلفية",
};
