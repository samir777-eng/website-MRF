"use client";

/**
 * AvatarCustomizer Component
 * Full customization panel with SVG previews
 */

import { useAvatar } from "@/contexts/AvatarContext";
import {
  AvatarConfig,
  AvatarPart,
  AvatarPartType,
  canUnlockPart,
  getPartById,
  getPartsByType,
  getRarityColor,
  getRarityLabel,
  PART_TYPE_LABELS,
} from "@/types/avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Gem,
  Lock,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AvatarDisplay } from "./AvatarDisplay";

interface AvatarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  userGems?: number;
  userLevel?: number;
  userStreak?: number;
  userAchievements?: string[];
}

const CATEGORY_ORDER: AvatarPartType[] = [
  "skin",
  "face",
  "hair",
  "hairColor",
  "eyes",
  "eyebrows",
  "mouth",
  "glasses",
  "accessory",
  "clothing",
  "background",
];

const CATEGORY_ICONS: Record<AvatarPartType, React.ReactNode> = {
  face: <FaceIcon />,
  skin: <SkinIcon />,
  hair: <HairIcon />,
  hairColor: <HairColorIcon />,
  eyes: <EyesIcon />,
  eyebrows: <EyebrowsIcon />,
  mouth: <MouthIcon />,
  glasses: <GlassesIcon />,
  accessory: <AccessoryIcon />,
  clothing: <ClothingIcon />,
  background: <BackgroundIcon />,
};

export function AvatarCustomizer({
  isOpen,
  onClose,
  userGems = 500,
  userLevel = 5,
  userStreak = 10,
  userAchievements = [],
}: AvatarCustomizerProps) {
  const {
    config,
    ownedParts,
    isOwned,
    isEquipped,
    updatePart,
    purchasePart,
    resetToDefault,
  } = useAvatar();

  const [selectedCategory, setSelectedCategory] =
    useState<AvatarPartType>("skin");
  const [previewConfig, setPreviewConfig] =
    useState<Partial<AvatarConfig> | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const parts = getPartsByType(selectedCategory);

  const _displayConfig = previewConfig
    ? { ...config, ...previewConfig }
    : config;

  const handlePartClick = (part: AvatarPart) => {
    if (isOwned(part.id)) {
      updatePart(selectedCategory, part.id);
      setPreviewConfig(null);
    } else {
      setPreviewConfig({ [selectedCategory]: part.id });
    }
  };

  const handlePurchase = async (part: AvatarPart) => {
    setIsPurchasing(true);
    const success = await purchasePart(part.id);
    setIsPurchasing(false);

    if (success) {
      updatePart(selectedCategory, part.id);
      setPreviewConfig(null);
    }
  };

  const handleReset = () => {
    resetToDefault();
    setPreviewConfig(null);
  };

  const previewingPart = previewConfig
    ? getPartById(previewConfig[selectedCategory] as string)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-display text-xl font-bold">
                  تخصيص الصورة الشخصية
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة تعيين
                </button>
                <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
                  <Gem className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {userGems.toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
              {/* Preview Panel */}
              <div className="lg:w-1/3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <AvatarDisplay
                    size={180}
                    previewConfig={previewConfig || undefined}
                    animated={true}
                    className="shadow-2xl rounded-full ring-4 ring-white dark:ring-gray-800"
                  />

                  {previewConfig && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium"
                    >
                      معاينة
                    </motion.div>
                  )}
                </div>

                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                  اضغط على أي عنصر لتجربته
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span>{ownedParts.length} عنصر</span>
                  </div>
                </div>
              </div>

              {/* Customization Panel */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Category Tabs with Icons */}
                <div className="flex gap-1 p-3 overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 scrollbar-hide">
                  {CATEGORY_ORDER.map((type) => {
                    const isActive = selectedCategory === type;
                    const categoryParts = getPartsByType(type);
                    const ownedCount = categoryParts.filter((p) =>
                      ownedParts.includes(p.id),
                    ).length;

                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedCategory(type);
                          setPreviewConfig(null);
                        }}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-w-[70px] ${
                          isActive
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {CATEGORY_ICONS[type]}
                        </div>
                        <span className="text-[10px]">
                          {PART_TYPE_LABELS[type]}
                        </span>
                        <span
                          className={`text-[9px] ${isActive ? "text-purple-200" : "text-gray-400"}`}
                        >
                          {ownedCount}/{categoryParts.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Parts Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {parts.map((part) => {
                      const owned = isOwned(part.id);
                      const equipped = isEquipped(part.id);
                      const previewing =
                        previewConfig?.[selectedCategory] === part.id;
                      const { canUnlock: _canUnlock } = canUnlockPart(
                        part,
                        userLevel,
                        userStreak,
                        userAchievements,
                        userGems,
                      );

                      return (
                        <motion.button
                          key={part.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePartClick(part)}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            equipped
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/10"
                              : previewing
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : owned
                                  ? "border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white dark:bg-gray-800"
                                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <PartPreview
                              part={part}
                              selectedCategory={selectedCategory}
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full text-center">
                              {part.nameAr}
                            </span>
                          </div>

                          {part.rarity !== "free" && (
                            <div
                              className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${getRarityColor(part.rarity)}`}
                            >
                              {getRarityLabel(part.rarity)}
                            </div>
                          )}

                          {equipped && (
                            <div className="absolute top-1 left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}

                          {!owned && (
                            <div className="absolute bottom-1 left-1 flex items-center gap-1">
                              {part.unlockMethod === "gems" ? (
                                <div className="flex items-center gap-0.5 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded text-[10px]">
                                  <Gem className="w-3 h-3 text-purple-500" />
                                  <span className="font-bold text-purple-600 dark:text-purple-400">
                                    {part.gemCost}
                                  </span>
                                </div>
                              ) : part.unlockMethod === "level" ? (
                                <div className="flex items-center gap-0.5 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded text-[10px]">
                                  <Zap className="w-3 h-3 text-blue-500" />
                                  <span className="font-bold text-blue-600 dark:text-blue-400">
                                    Lv.{part.levelRequired}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-gray-500" />
                                </div>
                              )}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Purchase Bar */}
                {previewingPart && !isOwned(previewingPart.id) && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    {(() => {
                      const { canUnlock, reason } = canUnlockPart(
                        previewingPart,
                        userLevel,
                        userStreak,
                        userAchievements,
                        userGems,
                      );

                      return (
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {previewingPart.nameAr}
                            </p>
                            <p className="text-sm text-gray-500">
                              {PART_TYPE_LABELS[previewingPart.type]} •{" "}
                              {getRarityLabel(previewingPart.rarity)}
                            </p>
                          </div>

                          {previewingPart.unlockMethod === "gems" ? (
                            <button
                              onClick={() => handlePurchase(previewingPart)}
                              disabled={!canUnlock || isPurchasing}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                                canUnlock
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {isPurchasing ? (
                                <span>جاري الشراء...</span>
                              ) : (
                                <>
                                  <Gem className="w-4 h-4" />
                                  <span>{previewingPart.gemCost}</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-left bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              {reason}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PART PREVIEW COMPONENT - SVG based previews
// ============================================================================

function PartPreview({
  part,
  selectedCategory,
}: {
  part: AvatarPart;
  selectedCategory: AvatarPartType;
}) {
  // Color swatches for skin, hair color, and background
  if (
    (selectedCategory === "skin" ||
      selectedCategory === "hairColor" ||
      selectedCategory === "background") &&
    part.value
  ) {
    const isGradient =
      part.value.includes("gradient") || part.value.includes("linear");

    return (
      <div
        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-inner"
        style={{
          background: isGradient ? parseGradient(part.value) : part.value,
        }}
      />
    );
  }

  // SVG previews for other parts
  return (
    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
      <svg viewBox="0 0 48 48" width={40} height={40}>
        {selectedCategory === "face" && <FacePreview faceId={part.id} />}
        {selectedCategory === "hair" && <HairPreview hairId={part.id} />}
        {selectedCategory === "eyes" && <EyesPreview eyesId={part.id} />}
        {selectedCategory === "eyebrows" && (
          <EyebrowsPreview browsId={part.id} />
        )}
        {selectedCategory === "mouth" && <MouthPreview mouthId={part.id} />}
        {selectedCategory === "glasses" && (
          <GlassesPreview glassesId={part.id} />
        )}
        {selectedCategory === "accessory" && (
          <AccessoryPreview accessoryId={part.id} />
        )}
        {selectedCategory === "clothing" && (
          <ClothingPreview clothingId={part.id} />
        )}
      </svg>
    </div>
  );
}

function parseGradient(value: string): string {
  if (value.includes("sunset"))
    return "linear-gradient(135deg, #F97316 0%, #EC4899 100%)";
  if (value.includes("ocean"))
    return "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)";
  if (value.includes("forest"))
    return "linear-gradient(135deg, #10B981 0%, #059669 100%)";
  if (value.includes("galaxy"))
    return "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)";
  if (value.includes("gold"))
    return "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)";
  return value;
}

// Mini SVG Previews
function FacePreview({ faceId }: { faceId: string }) {
  const color = "#D4A574";
  switch (faceId) {
    case "face-oval":
      return <ellipse cx="24" cy="26" rx="14" ry="17" fill={color} />;
    case "face-square":
      return <rect x="10" y="10" width="28" height="30" rx="5" fill={color} />;
    case "face-heart":
      return (
        <path
          d="M24 8 C14 8 8 18 8 26 C8 36 16 42 24 46 C32 42 40 36 40 26 C40 18 34 8 24 8"
          fill={color}
        />
      );
    default:
      return <circle cx="24" cy="24" r="15" fill={color} />;
  }
}

function HairPreview({ hairId }: { hairId: string }) {
  const color = "#3A2A1A";
  switch (hairId) {
    case "hair-none":
      return (
        <circle
          cx="24"
          cy="24"
          r="12"
          fill="#E5E7EB"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      );
    case "hair-short":
      return (
        <path
          d="M10 22 Q10 8 24 6 Q38 8 38 22 Q36 12 24 10 Q12 12 10 22"
          fill={color}
        />
      );
    case "hair-medium":
      return (
        <path
          d="M8 26 Q8 6 24 4 Q40 6 40 26 Q38 12 24 10 Q10 12 8 26"
          fill={color}
        />
      );
    case "hair-long":
      return (
        <>
          <path
            d="M8 26 Q8 6 24 4 Q40 6 40 26 L42 44 Q24 46 6 44 Z"
            fill={color}
          />
          <path
            d="M8 26 Q8 6 24 4 Q40 6 40 26 Q38 12 24 10 Q10 12 8 26"
            fill={color}
          />
        </>
      );
    case "hair-curly":
      return (
        <>
          <circle cx="12" cy="14" r="5" fill={color} />
          <circle cx="24" cy="10" r="5" fill={color} />
          <circle cx="36" cy="14" r="5" fill={color} />
          <circle cx="10" cy="22" r="4" fill={color} />
          <circle cx="38" cy="22" r="4" fill={color} />
        </>
      );
    case "hair-wavy":
      return (
        <path
          d="M8 22 Q6 12 14 8 Q20 4 24 6 Q28 4 34 8 Q42 12 40 22 Q38 14 24 12 Q10 14 8 22"
          fill={color}
        />
      );
    case "hair-spiky":
      return (
        <>
          <polygon points="24,2 20,14 28,14" fill={color} />
          <polygon points="14,6 14,16 22,14" fill={color} />
          <polygon points="34,6 34,16 26,14" fill={color} />
          <path d="M10 20 Q10 12 24 10 Q38 12 38 20" fill={color} />
        </>
      );
    case "hair-ponytail":
      return (
        <>
          <path
            d="M10 22 Q10 8 24 6 Q38 8 38 22 Q36 12 24 10 Q12 12 10 22"
            fill={color}
          />
          <ellipse cx="40" cy="32" rx="5" ry="12" fill={color} />
        </>
      );
    case "hair-hijab":
      return (
        <>
          <ellipse cx="24" cy="22" rx="18" ry="14" fill={color} />
          <path d="M12 30 Q8 38 10 46 L16 44 Q14 36 16 30" fill={color} />
          <path d="M36 30 Q40 38 38 46 L32 44 Q34 36 32 30" fill={color} />
        </>
      );
    case "hair-mohawk":
      return (
        <>
          <path d="M20 4 Q24 0 28 4 L28 16 Q24 14 20 16 Z" fill={color} />
          <path d="M18 14 Q24 10 30 14 L30 24 Q24 22 18 24 Z" fill={color} />
        </>
      );
    default:
      return <circle cx="24" cy="12" r="10" fill={color} />;
  }
}

function EyesPreview({ eyesId }: { eyesId: string }) {
  switch (eyesId) {
    case "eyes-happy":
      return (
        <>
          <path
            d="M14 24 Q18 20 22 24"
            stroke="#4A3728"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M26 24 Q30 20 34 24"
            stroke="#4A3728"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "eyes-sleepy":
      return (
        <>
          <ellipse
            cx="18"
            cy="24"
            rx="4"
            ry="2"
            fill="white"
            stroke="#4A3728"
            strokeWidth="1"
          />
          <ellipse
            cx="30"
            cy="24"
            rx="4"
            ry="2"
            fill="white"
            stroke="#4A3728"
            strokeWidth="1"
          />
          <line
            x1="14"
            y1="22"
            x2="22"
            y2="23"
            stroke="#4A3728"
            strokeWidth="1.5"
          />
          <line
            x1="26"
            y1="23"
            x2="34"
            y2="22"
            stroke="#4A3728"
            strokeWidth="1.5"
          />
        </>
      );
    case "eyes-wink":
      return (
        <>
          <ellipse
            cx="18"
            cy="24"
            rx="4"
            ry="3"
            fill="white"
            stroke="#4A3728"
            strokeWidth="1"
          />
          <circle cx="18" cy="24" r="2" fill="#4A3728" />
          <path
            d="M26 24 Q30 20 34 24"
            stroke="#4A3728"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "eyes-stars":
      return (
        <>
          <polygon
            points="18,20 19,23 22,23 20,25 21,28 18,26 15,28 16,25 14,23 17,23"
            fill="#FFD700"
          />
          <polygon
            points="30,20 31,23 34,23 32,25 33,28 30,26 27,28 28,25 26,23 29,23"
            fill="#FFD700"
          />
        </>
      );
    case "eyes-heart":
      return (
        <>
          <path
            d="M18 27 C14 23 14 20 16 19 C18 18 19 20 18 22 C17 20 18 18 20 19 C22 20 22 23 18 27"
            fill="#EC4899"
            transform="scale(0.8) translate(4, 4)"
          />
          <path
            d="M30 27 C26 23 26 20 28 19 C30 18 31 20 30 22 C29 20 30 18 32 19 C34 20 34 23 30 27"
            fill="#EC4899"
            transform="scale(0.8) translate(4, 4)"
          />
        </>
      );
    default:
      return (
        <>
          <ellipse
            cx="18"
            cy="24"
            rx="4"
            ry="3"
            fill="white"
            stroke="#4A3728"
            strokeWidth="1"
          />
          <circle cx="18" cy="24" r="2" fill="#4A3728" />
          <ellipse
            cx="30"
            cy="24"
            rx="4"
            ry="3"
            fill="white"
            stroke="#4A3728"
            strokeWidth="1"
          />
          <circle cx="30" cy="24" r="2" fill="#4A3728" />
        </>
      );
  }
}

function EyebrowsPreview({ browsId }: { browsId: string }) {
  const color = "#4A3728";
  switch (browsId) {
    case "brows-raised":
      return (
        <>
          <path
            d="M12 18 Q18 14 24 18"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M24 18 Q30 14 36 18"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-angry":
      return (
        <>
          <path
            d="M12 22 Q18 18 24 20"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M24 20 Q30 18 36 22"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-worried":
      return (
        <>
          <path
            d="M12 19 Q18 22 24 19"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M24 19 Q30 22 36 19"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-unibrow":
      return (
        <path
          d="M10 20 Q24 14 38 20"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <>
          <path
            d="M12 20 Q18 18 24 20"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M24 20 Q30 18 36 20"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
  }
}

function MouthPreview({ mouthId }: { mouthId: string }) {
  const color = "#C06060";
  switch (mouthId) {
    case "mouth-grin":
      return (
        <path
          d="M14 28 Q24 38 34 28"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      );
    case "mouth-neutral":
      return (
        <line
          x1="18"
          y1="30"
          x2="30"
          y2="30"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case "mouth-open":
      return <ellipse cx="24" cy="32" rx="6" ry="5" fill={color} />;
    case "mouth-teeth":
      return (
        <>
          <path d="M16 28 Q24 36 32 28" fill={color} />
          <rect x="20" y="28" width="8" height="4" fill="white" rx="1" />
        </>
      );
    case "mouth-tongue":
      return (
        <>
          <path d="M16 28 Q24 36 32 28" fill={color} />
          <ellipse cx="24" cy="33" rx="4" ry="5" fill="#FF9999" />
        </>
      );
    default:
      return (
        <path
          d="M16 28 Q24 36 32 28"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}

function GlassesPreview({ glassesId }: { glassesId: string }) {
  const frame = "#333";
  switch (glassesId) {
    case "glasses-none":
      return (
        <circle
          cx="24"
          cy="24"
          r="10"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      );
    case "glasses-round":
      return (
        <>
          <circle
            cx="16"
            cy="24"
            r="6"
            fill="none"
            stroke={frame}
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="24"
            r="6"
            fill="none"
            stroke={frame}
            strokeWidth="2"
          />
          <line
            x1="22"
            y1="24"
            x2="26"
            y2="24"
            stroke={frame}
            strokeWidth="2"
          />
        </>
      );
    case "glasses-square":
      return (
        <>
          <rect
            x="10"
            y="18"
            width="12"
            height="10"
            fill="none"
            stroke={frame}
            strokeWidth="2"
            rx="2"
          />
          <rect
            x="26"
            y="18"
            width="12"
            height="10"
            fill="none"
            stroke={frame}
            strokeWidth="2"
            rx="2"
          />
          <line
            x1="22"
            y1="23"
            x2="26"
            y2="23"
            stroke={frame}
            strokeWidth="2"
          />
        </>
      );
    case "glasses-sunglasses":
      return (
        <>
          <ellipse
            cx="16"
            cy="24"
            rx="7"
            ry="5"
            fill="#1A1A1A"
            stroke={frame}
            strokeWidth="1.5"
          />
          <ellipse
            cx="32"
            cy="24"
            rx="7"
            ry="5"
            fill="#1A1A1A"
            stroke={frame}
            strokeWidth="1.5"
          />
          <line
            x1="23"
            y1="24"
            x2="25"
            y2="24"
            stroke={frame}
            strokeWidth="2"
          />
        </>
      );
    case "glasses-aviator":
      return (
        <>
          <path
            d="M9 20 Q16 18 23 22 L23 28 Q16 32 9 28 Z"
            fill="rgba(50,50,50,0.7)"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
          <path
            d="M25 22 Q32 18 39 20 L39 28 Q32 32 25 28 Z"
            fill="rgba(50,50,50,0.7)"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
        </>
      );
    case "glasses-nerd":
      return (
        <>
          <circle
            cx="16"
            cy="24"
            r="8"
            fill="none"
            stroke={frame}
            strokeWidth="2.5"
          />
          <circle
            cx="32"
            cy="24"
            r="8"
            fill="none"
            stroke={frame}
            strokeWidth="2.5"
          />
          <rect x="22" y="22" width="4" height="4" fill="#F5E6D3" />
        </>
      );
    default:
      return null;
  }
}

function AccessoryPreview({ accessoryId }: { accessoryId: string }) {
  switch (accessoryId) {
    case "acc-none":
      return (
        <circle
          cx="24"
          cy="24"
          r="10"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      );
    case "acc-cap":
      return (
        <>
          <ellipse cx="24" cy="16" rx="14" ry="6" fill="#3B82F6" />
          <rect x="10" y="12" width="28" height="8" fill="#3B82F6" rx="2" />
          <rect x="22" y="8" width="16" height="5" fill="#3B82F6" rx="1" />
        </>
      );
    case "acc-beanie":
      return (
        <>
          <path d="M10 22 Q10 6 24 4 Q38 6 38 22" fill="#EF4444" />
          <rect x="10" y="18" width="28" height="6" fill="#DC2626" rx="2" />
          <circle cx="24" cy="4" r="3" fill="#EF4444" />
        </>
      );
    case "acc-headphones":
      return (
        <>
          <path
            d="M10 24 Q10 10 24 8 Q38 10 38 24"
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />
          <ellipse cx="10" cy="26" rx="4" ry="6" fill="#333" />
          <ellipse cx="38" cy="26" rx="4" ry="6" fill="#333" />
        </>
      );
    case "acc-crown":
      return (
        <>
          <polygon
            points="24,4 14,16 18,16 12,12 16,20 20,14 24,20 28,14 32,20 36,12 30,16 34,16"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
          />
          <circle cx="16" cy="14" r="2" fill="#EF4444" />
          <circle cx="24" cy="10" r="2.5" fill="#3B82F6" />
          <circle cx="32" cy="14" r="2" fill="#10B981" />
        </>
      );
    case "acc-halo":
      return (
        <ellipse
          cx="24"
          cy="10"
          rx="14"
          ry="4"
          fill="none"
          stroke="#FFD700"
          strokeWidth="3"
        />
      );
    case "acc-earbuds":
      return (
        <>
          <ellipse
            cx="10"
            cy="28"
            rx="3"
            ry="3.5"
            fill="#F5F5F5"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
          <ellipse
            cx="38"
            cy="28"
            rx="3"
            ry="3.5"
            fill="#F5F5F5"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
          <path
            d="M10 32 Q10 40 16 44"
            stroke="#F5F5F5"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M38 32 Q38 40 32 44"
            stroke="#F5F5F5"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
}

function ClothingPreview({ clothingId }: { clothingId: string }) {
  switch (clothingId) {
    case "clothing-tshirt":
      return (
        <path
          d="M10 44 Q10 38 24 36 Q38 38 38 44 L42 48 L6 48 Z"
          fill="#8B5CF6"
        />
      );
    case "clothing-hoodie":
      return (
        <>
          <path
            d="M10 44 Q10 38 24 36 Q38 38 38 44 L42 48 L6 48 Z"
            fill="#6B7280"
          />
          <line
            x1="18"
            y1="40"
            x2="18"
            y2="48"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          />
          <line
            x1="30"
            y1="40"
            x2="30"
            y2="48"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          />
        </>
      );
    case "clothing-jacket":
      return (
        <>
          <path d="M10 44 L6 48 L42 48 L38 44" fill="#1E3A8A" />
          <line
            x1="24"
            y1="36"
            x2="24"
            y2="48"
            stroke="#3B82F6"
            strokeWidth="2"
          />
        </>
      );
    case "clothing-sweater":
      return (
        <>
          <path
            d="M10 44 Q10 38 24 36 Q38 38 38 44 L42 48 L6 48 Z"
            fill="#DC2626"
          />
          <line
            x1="6"
            y1="44"
            x2="42"
            y2="44"
            stroke="#B91C1C"
            strokeWidth="1"
          />
          <line
            x1="6"
            y1="46"
            x2="42"
            y2="46"
            stroke="#B91C1C"
            strokeWidth="1"
          />
        </>
      );
    case "clothing-shirt":
      return (
        <>
          <path d="M12 44 L8 48 L40 48 L36 44" fill="#F5F5F5" />
          <path
            d="M20 36 L24 42 L28 36"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1.5"
          />
        </>
      );
    case "clothing-tank":
      return <path d="M14 44 L12 48 L36 48 L34 44" fill="#10B981" />;
    default:
      return (
        <path
          d="M10 44 Q10 38 24 36 Q38 38 38 44 L42 48 L6 48 Z"
          fill="#8B5CF6"
        />
      );
  }
}

// ============================================================================
// CATEGORY ICONS
// ============================================================================

function FaceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function SkinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function HairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M6 12 Q6 4 12 3 Q18 4 18 12 Q17 6 12 5 Q7 6 6 12" />
    </svg>
  );
}

function HairColorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function EyesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <ellipse cx="8" cy="12" rx="3" ry="2.5" />
      <ellipse cx="16" cy="12" rx="3" ry="2.5" />
    </svg>
  );
}

function EyebrowsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path d="M4 10 Q8 8 12 10" />
      <path d="M12 10 Q16 8 20 10" />
    </svg>
  );
}

function MouthIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path d="M8 14 Q12 18 16 14" />
    </svg>
  );
}

function GlassesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-full h-full"
    >
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
      <line x1="11" y1="12" x2="13" y2="12" />
    </svg>
  );
}

function AccessoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <polygon points="12,3 8,10 10,10 7,8 9,13 11,9 12,13 13,9 15,13 17,8 14,10 16,10" />
    </svg>
  );
}

function ClothingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M6 20 Q6 16 12 14 Q18 16 18 20 L20 22 L4 22 Z" />
    </svg>
  );
}

function BackgroundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-full h-full"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

export default AvatarCustomizer;
