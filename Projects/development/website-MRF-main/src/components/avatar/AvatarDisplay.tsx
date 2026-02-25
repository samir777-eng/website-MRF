"use client";

/**
 * AvatarDisplay Component
 * Renders customizable SVG avatar with proper shading and polish
 */

import { useAvatar } from "@/contexts/AvatarContext";
import { AvatarConfig, getPartById } from "@/types/avatar";
import { motion } from "framer-motion";

interface AvatarDisplayProps {
  size?: number;
  className?: string;
  onClick?: () => void;
  previewConfig?: Partial<AvatarConfig>;
  animated?: boolean;
}

export function AvatarDisplay({
  size = 120,
  className = "",
  onClick,
  previewConfig,
  animated = false,
}: AvatarDisplayProps) {
  const { config: contextConfig, isLoading } = useAvatar();

  const config = previewConfig
    ? { ...contextConfig, ...previewConfig }
    : contextConfig;

  const skinPart = getPartById(config.skin);
  const hairColorPart = getPartById(config.hairColor);
  const bgPart = getPartById(config.background);

  const skinColor = skinPart?.value || "#D4A574";
  const skinShadow = darkenColor(skinColor, 0.15);
  const skinHighlight = lightenColor(skinColor, 0.1);
  const hairColor = hairColorPart?.value || "#1A1A1A";
  const hairHighlight = lightenColor(hairColor, 0.2);
  const bgValue = bgPart?.value || "#8B5CF6";

  if (isLoading) {
    return (
      <div
        className={`rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const isGradientBg =
    bgValue.includes("gradient") || bgValue.includes("linear");
  const uniqueId = `avatar-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`relative ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="rounded-full overflow-hidden"
      >
        <defs>
          {/* Skin gradient for depth */}
          <radialGradient id={`${uniqueId}-skin`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={skinHighlight} />
            <stop offset="70%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShadow} />
          </radialGradient>

          {/* Hair gradient for shine */}
          <linearGradient
            id={`${uniqueId}-hair`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={hairHighlight} />
            <stop offset="50%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairColor} />
          </linearGradient>

          {/* Background gradients */}
          {isGradientBg && (
            <linearGradient
              id={`${uniqueId}-bg`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {bgValue.includes("sunset") && (
                <>
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EC4899" />
                </>
              )}
              {bgValue.includes("ocean") && (
                <>
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </>
              )}
              {bgValue.includes("forest") && (
                <>
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </>
              )}
              {bgValue.includes("galaxy") && (
                <>
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F97316" />
                </>
              )}
              {bgValue.includes("gold") && (
                <>
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </>
              )}
            </linearGradient>
          )}

          {/* Rainbow hair */}
          {hairColor === "rainbow" && (
            <linearGradient
              id={`${uniqueId}-rainbow`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="20%" stopColor="#F97316" />
              <stop offset="40%" stopColor="#EAB308" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="80%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          )}

          {/* Shadow filter */}
          <filter
            id={`${uniqueId}-shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.15"
            />
          </filter>

          {/* Inner shadow for depth */}
          <filter id={`${uniqueId}-inner-shadow`}>
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite
              operator="out"
              in="SourceGraphic"
              in2="offset-blur"
              result="inverse"
            />
            <feFlood floodColor="black" floodOpacity="0.1" result="color" />
            <feComposite
              operator="in"
              in="color"
              in2="inverse"
              result="shadow"
            />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Background */}
        <circle
          cx="100"
          cy="100"
          r="100"
          fill={isGradientBg ? `url(#${uniqueId}-bg)` : bgValue}
        />

        {/* Neck with shadow */}
        <rect x="75" y="145" width="50" height="40" fill={skinShadow} />
        <rect x="78" y="145" width="44" height="40" fill={skinColor} />

        {/* Clothing */}
        <ClothingPart clothingId={config.clothing} uniqueId={uniqueId} />

        {/* Face Shape with gradient */}
        <FacePart
          faceId={config.face}
          skinGradient={`url(#${uniqueId}-skin)`}
          skinShadow={skinShadow}
        />

        {/* Hair back layer */}
        <HairBackPart
          hairId={config.hair}
          hairFill={
            hairColor === "rainbow"
              ? `url(#${uniqueId}-rainbow)`
              : `url(#${uniqueId}-hair)`
          }
          hairColor={hairColor}
        />

        {/* Ears with shadow */}
        <ellipse cx="38" cy="100" rx="10" ry="13" fill={skinShadow} />
        <ellipse cx="35" cy="100" rx="10" ry="13" fill={skinColor} />
        <ellipse cx="162" cy="100" rx="10" ry="13" fill={skinShadow} />
        <ellipse cx="165" cy="100" rx="10" ry="13" fill={skinColor} />

        {/* Inner ear detail */}
        <ellipse
          cx="36"
          cy="100"
          rx="5"
          ry="7"
          fill={skinShadow}
          opacity="0.5"
        />
        <ellipse
          cx="164"
          cy="100"
          rx="5"
          ry="7"
          fill={skinShadow}
          opacity="0.5"
        />

        {/* Eyes */}
        <EyesPart eyesId={config.eyes} />

        {/* Eyebrows */}
        <EyebrowsPart browsId={config.eyebrows} hairColor={hairColor} />

        {/* Nose - subtle */}
        <path
          d="M95 105 Q100 115 105 105"
          fill="none"
          stroke={skinShadow}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Mouth */}
        <MouthPart mouthId={config.mouth} />

        {/* Cheek blush */}
        <ellipse
          cx="60"
          cy="115"
          rx="12"
          ry="8"
          fill="#FFAAAA"
          opacity="0.15"
        />
        <ellipse
          cx="140"
          cy="115"
          rx="12"
          ry="8"
          fill="#FFAAAA"
          opacity="0.15"
        />

        {/* Hair front layer */}
        <HairFrontPart
          hairId={config.hair}
          hairFill={
            hairColor === "rainbow"
              ? `url(#${uniqueId}-rainbow)`
              : `url(#${uniqueId}-hair)`
          }
          hairColor={hairColor}
          hairHighlight={hairHighlight}
        />

        {/* Glasses */}
        {config.glasses && config.glasses !== "glasses-none" && (
          <GlassesPart glassesId={config.glasses} />
        )}

        {/* Accessory */}
        {config.accessory && config.accessory !== "acc-none" && (
          <AccessoryPart accessoryId={config.accessory} animated={animated} />
        )}

        {/* Highlight overlay for polish */}
        <ellipse cx="75" cy="70" rx="20" ry="15" fill="white" opacity="0.08" />
      </svg>
    </motion.div>
  );
}

// Color utilities
function darkenColor(hex: string, amount: number): string {
  if (!hex.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lightenColor(hex: string, amount: number): string {
  if (!hex.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ============================================================================
// SVG PARTS
// ============================================================================

function FacePart({
  faceId,
  skinGradient,
  skinShadow,
}: {
  faceId: string;
  skinGradient: string;
  skinShadow: string;
}) {
  switch (faceId) {
    case "face-oval":
      return (
        <>
          <ellipse
            cx="102"
            cy="107"
            rx="55"
            ry="65"
            fill={skinShadow}
            opacity="0.3"
          />
          <ellipse cx="100" cy="105" rx="55" ry="65" fill={skinGradient} />
        </>
      );
    case "face-square":
      return (
        <>
          <rect
            x="47"
            y="47"
            width="110"
            height="115"
            rx="20"
            fill={skinShadow}
            opacity="0.3"
          />
          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="20"
            fill={skinGradient}
          />
        </>
      );
    case "face-heart":
      return (
        <>
          <path
            d="M102 42 C62 42 47 72 47 102 C47 142 72 162 102 172 C132 162 157 142 157 102 C157 72 142 42 102 42"
            fill={skinShadow}
            opacity="0.3"
          />
          <path
            d="M100 40 C60 40 45 70 45 100 C45 140 70 160 100 170 C130 160 155 140 155 100 C155 70 140 40 100 40"
            fill={skinGradient}
          />
        </>
      );
    default: // face-round
      return (
        <>
          <circle cx="102" cy="102" r="60" fill={skinShadow} opacity="0.3" />
          <circle cx="100" cy="100" r="60" fill={skinGradient} />
        </>
      );
  }
}

function HairBackPart({
  hairId,
  hairFill,
  hairColor,
}: {
  hairId: string;
  hairFill: string;
  hairColor: string;
}) {
  if (hairId === "hair-none") return null;

  const shadow = darkenColor(hairColor, 0.2);

  switch (hairId) {
    case "hair-long":
      return (
        <>
          <path
            d="M42 92 Q42 42 102 37 Q162 42 162 92 L167 172 Q102 182 37 172 Z"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M40 90 Q40 40 100 35 Q160 40 160 90 L165 170 Q100 180 35 170 Z"
            fill={hairFill}
          />
        </>
      );
    case "hair-ponytail":
      return (
        <>
          <ellipse
            cx="162"
            cy="132"
            rx="18"
            ry="48"
            fill={shadow}
            opacity="0.5"
          />
          <ellipse cx="160" cy="130" rx="18" ry="48" fill={hairFill} />
        </>
      );
    default:
      return null;
  }
}

function HairFrontPart({
  hairId,
  hairFill,
  hairColor,
  hairHighlight,
}: {
  hairId: string;
  hairFill: string;
  hairColor: string;
  hairHighlight: string;
}) {
  if (hairId === "hair-none") return null;

  const shadow = darkenColor(hairColor, 0.2);

  switch (hairId) {
    case "hair-short":
      return (
        <>
          <path
            d="M47 82 Q47 42 102 37 Q157 42 157 82 Q152 52 102 47 Q52 52 47 82"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M45 80 Q45 40 100 35 Q155 40 155 80 Q150 50 100 45 Q50 50 45 80"
            fill={hairFill}
          />
          <path
            d="M55 60 Q75 45 95 50"
            stroke={hairHighlight}
            strokeWidth="3"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-medium":
      return (
        <>
          <path
            d="M42 92 Q42 37 102 32 Q162 37 162 92 Q157 52 102 47 Q47 52 42 92"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M40 90 Q40 35 100 30 Q160 35 160 90 Q155 50 100 45 Q45 50 40 90"
            fill={hairFill}
          />
          <path
            d="M50 55 Q80 40 110 50"
            stroke={hairHighlight}
            strokeWidth="4"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-long":
      return (
        <>
          <path
            d="M42 92 Q42 37 102 32 Q162 37 162 92 Q157 52 102 47 Q47 52 42 92"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M40 90 Q40 35 100 30 Q160 35 160 90 Q155 50 100 45 Q45 50 40 90"
            fill={hairFill}
          />
          <path
            d="M50 50 Q85 35 120 45"
            stroke={hairHighlight}
            strokeWidth="4"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-curly":
      return (
        <>
          <circle cx="52" cy="62" r="20" fill={shadow} opacity="0.4" />
          <circle cx="50" cy="60" r="20" fill={hairFill} />
          <circle cx="77" cy="47" r="18" fill={shadow} opacity="0.4" />
          <circle cx="75" cy="45" r="18" fill={hairFill} />
          <circle cx="102" cy="42" r="20" fill={shadow} opacity="0.4" />
          <circle cx="100" cy="40" r="20" fill={hairFill} />
          <circle cx="127" cy="47" r="18" fill={shadow} opacity="0.4" />
          <circle cx="125" cy="45" r="18" fill={hairFill} />
          <circle cx="152" cy="62" r="20" fill={shadow} opacity="0.4" />
          <circle cx="150" cy="60" r="20" fill={hairFill} />
          <circle cx="47" cy="87" r="15" fill={shadow} opacity="0.4" />
          <circle cx="45" cy="85" r="15" fill={hairFill} />
          <circle cx="157" cy="87" r="15" fill={shadow} opacity="0.4" />
          <circle cx="155" cy="85" r="15" fill={hairFill} />
        </>
      );
    case "hair-wavy":
      return (
        <>
          <path
            d="M42 82 Q37 52 62 42 Q82 32 102 37 Q122 32 142 42 Q167 52 162 82 Q157 57 102 52 Q47 57 42 82"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M40 80 Q35 50 60 40 Q80 30 100 35 Q120 30 140 40 Q165 50 160 80 Q155 55 100 50 Q45 55 40 80"
            fill={hairFill}
          />
          <path
            d="M55 55 Q85 40 115 50"
            stroke={hairHighlight}
            strokeWidth="4"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-spiky":
      return (
        <>
          <polygon points="100,17 92,52 108,52" fill={shadow} opacity="0.5" />
          <polygon points="100,15 90,50 110,50" fill={hairFill} />
          <polygon points="72,27 72,57 92,52" fill={shadow} opacity="0.5" />
          <polygon points="70,25 70,55 90,50" fill={hairFill} />
          <polygon points="132,27 132,57 112,52" fill={shadow} opacity="0.5" />
          <polygon points="130,25 130,55 110,50" fill={hairFill} />
          <polygon points="52,42 57,72 77,57" fill={shadow} opacity="0.5" />
          <polygon points="50,40 55,70 75,55" fill={hairFill} />
          <polygon points="152,42 147,72 127,57" fill={shadow} opacity="0.5" />
          <polygon points="150,40 145,70 125,55" fill={hairFill} />
          <path
            d="M47 77 Q47 52 102 47 Q157 52 157 77 Q152 57 102 52 Q52 57 47 77"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M45 75 Q45 50 100 45 Q155 50 155 75 Q150 55 100 50 Q50 55 45 75"
            fill={hairFill}
          />
        </>
      );
    case "hair-ponytail":
      return (
        <>
          <path
            d="M47 82 Q47 42 102 37 Q157 42 157 82 Q152 52 102 47 Q52 52 47 82"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M45 80 Q45 40 100 35 Q155 40 155 80 Q150 50 100 45 Q50 50 45 80"
            fill={hairFill}
          />
          <path
            d="M55 55 Q85 40 115 50"
            stroke={hairHighlight}
            strokeWidth="3"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-hijab":
      return (
        <>
          <ellipse
            cx="102"
            cy="92"
            rx="70"
            ry="60"
            fill={shadow}
            opacity="0.5"
          />
          <ellipse cx="100" cy="90" rx="70" ry="60" fill={hairFill} />
          <ellipse
            cx="100"
            cy="105"
            rx="58"
            ry="55"
            fill="none"
            stroke={hairFill}
            strokeWidth="10"
          />
          <path
            d="M57 122 Q42 152 52 182 L72 172 Q62 147 72 122"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M55 120 Q40 150 50 180 L70 170 Q60 145 70 120"
            fill={hairFill}
          />
          <path
            d="M147 122 Q162 152 152 182 L132 172 Q142 147 132 122"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M145 120 Q160 150 150 180 L130 170 Q140 145 130 120"
            fill={hairFill}
          />
          {/* Decorative fold line */}
          <path
            d="M60 80 Q100 70 140 80"
            stroke={hairHighlight}
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "hair-mohawk":
      return (
        <>
          <path
            d="M87 22 Q102 2 117 22 L117 57 Q102 52 87 57 Z"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M85 20 Q100 0 115 20 L115 55 Q100 50 85 55 Z"
            fill={hairFill}
          />
          <path
            d="M82 52 Q102 42 122 52 L122 82 Q102 77 82 82 Z"
            fill={shadow}
            opacity="0.5"
          />
          <path
            d="M80 50 Q100 40 120 50 L120 80 Q100 75 80 80 Z"
            fill={hairFill}
          />
          <line
            x1="95"
            y1="25"
            x2="95"
            y2="45"
            stroke={hairHighlight}
            strokeWidth="3"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return null;
  }
}

function EyesPart({ eyesId }: { eyesId: string }) {
  const eyeWhite = "#FFFFFF";
  const eyeColor = "#4A3728";
  const eyeShadow = "#3A2718";

  switch (eyesId) {
    case "eyes-happy":
      return (
        <>
          <path
            d="M65 92 Q75 85 85 92"
            stroke={eyeColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M115 92 Q125 85 135 92"
            stroke={eyeColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "eyes-sleepy":
      return (
        <>
          <ellipse cx="75" cy="90" rx="12" ry="5" fill={eyeWhite} />
          <ellipse
            cx="75"
            cy="90"
            rx="12"
            ry="5"
            fill="none"
            stroke={eyeShadow}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle cx="75" cy="90" r="4" fill={eyeColor} />
          <ellipse cx="125" cy="90" rx="12" ry="5" fill={eyeWhite} />
          <ellipse
            cx="125"
            cy="90"
            rx="12"
            ry="5"
            fill="none"
            stroke={eyeShadow}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle cx="125" cy="90" r="4" fill={eyeColor} />
          <line
            x1="63"
            y1="84"
            x2="87"
            y2="86"
            stroke={eyeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="113"
            y1="86"
            x2="137"
            y2="84"
            stroke={eyeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "eyes-wink":
      return (
        <>
          {/* Open eye */}
          <ellipse cx="75" cy="90" rx="13" ry="11" fill={eyeWhite} />
          <ellipse
            cx="75"
            cy="90"
            rx="13"
            ry="11"
            fill="none"
            stroke={eyeShadow}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle cx="75" cy="90" r="7" fill={eyeColor} />
          <circle cx="73" cy="88" r="2.5" fill={eyeWhite} />
          {/* Closed eye (wink) */}
          <path
            d="M115 92 Q125 85 135 92"
            stroke={eyeColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "eyes-stars":
      return (
        <>
          <polygon
            points="75,80 78,88 86,88 80,93 82,101 75,96 68,101 70,93 64,88 72,88"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
          />
          <polygon
            points="125,80 128,88 136,88 130,93 132,101 125,96 118,101 120,93 114,88 122,88"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
          />
        </>
      );
    case "eyes-heart":
      return (
        <>
          <path
            d="M75 97 C63 85 63 78 69 76 C75 74 78 79 75 85 C72 79 75 74 81 76 C87 78 87 85 75 97"
            fill="#EC4899"
          />
          <path
            d="M125 97 C113 85 113 78 119 76 C125 74 128 79 125 85 C122 79 125 74 131 76 C137 78 137 85 125 97"
            fill="#EC4899"
          />
          {/* Highlight */}
          <ellipse cx="70" cy="82" rx="3" ry="2" fill="white" opacity="0.4" />
          <ellipse cx="120" cy="82" rx="3" ry="2" fill="white" opacity="0.4" />
        </>
      );
    default: // eyes-normal
      return (
        <>
          {/* Left eye */}
          <ellipse cx="75" cy="90" rx="13" ry="11" fill={eyeWhite} />
          <ellipse
            cx="75"
            cy="90"
            rx="13"
            ry="11"
            fill="none"
            stroke={eyeShadow}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle cx="75" cy="90" r="7" fill={eyeColor} />
          <circle cx="73" cy="88" r="2.5" fill={eyeWhite} />
          {/* Right eye */}
          <ellipse cx="125" cy="90" rx="13" ry="11" fill={eyeWhite} />
          <ellipse
            cx="125"
            cy="90"
            rx="13"
            ry="11"
            fill="none"
            stroke={eyeShadow}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle cx="125" cy="90" r="7" fill={eyeColor} />
          <circle cx="123" cy="88" r="2.5" fill={eyeWhite} />
        </>
      );
  }
}

function EyebrowsPart({
  browsId,
  hairColor,
}: {
  browsId: string;
  hairColor: string;
}) {
  const browColor = hairColor.startsWith("#")
    ? darkenColor(hairColor, 0.1)
    : "#4A3728";

  switch (browsId) {
    case "brows-raised":
      return (
        <>
          <path
            d="M60 70 Q75 62 90 70"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M110 70 Q125 62 140 70"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-angry":
      return (
        <>
          <path
            d="M62 80 Q75 72 88 78"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M112 78 Q125 72 138 80"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-worried":
      return (
        <>
          <path
            d="M62 73 Q75 80 88 73"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M112 73 Q125 80 138 73"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "brows-unibrow":
      return (
        <path
          d="M55 75 Q100 63 145 75"
          stroke={browColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      );
    default: // brows-normal
      return (
        <>
          <path
            d="M60 75 Q75 70 90 75"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M110 75 Q125 70 140 75"
            stroke={browColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
  }
}

function MouthPart({ mouthId }: { mouthId: string }) {
  const mouthColor = "#C06060";
  const lipColor = "#E88888";
  const teethColor = "#FFFFFF";

  switch (mouthId) {
    case "mouth-grin":
      return (
        <>
          <path
            d="M75 125 Q100 148 125 125"
            stroke={mouthColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "mouth-neutral":
      return (
        <line
          x1="85"
          y1="130"
          x2="115"
          y2="130"
          stroke={mouthColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    case "mouth-open":
      return (
        <>
          <ellipse cx="100" cy="132" rx="16" ry="12" fill={mouthColor} />
          <ellipse cx="100" cy="128" rx="10" ry="6" fill={lipColor} />
        </>
      );
    case "mouth-teeth":
      return (
        <>
          <path d="M78 125 Q100 142 122 125" fill={mouthColor} />
          <rect x="88" y="125" width="24" height="9" fill={teethColor} rx="2" />
          <line
            x1="100"
            y1="125"
            x2="100"
            y2="134"
            stroke={mouthColor}
            strokeWidth="1"
            opacity="0.3"
          />
        </>
      );
    case "mouth-tongue":
      return (
        <>
          <path d="M78 125 Q100 142 122 125" fill={mouthColor} />
          <ellipse cx="100" cy="136" rx="9" ry="11" fill={lipColor} />
          <line
            x1="100"
            y1="130"
            x2="100"
            y2="142"
            stroke={mouthColor}
            strokeWidth="1"
            opacity="0.3"
          />
        </>
      );
    default: // mouth-smile
      return (
        <path
          d="M80 125 Q100 142 120 125"
          stroke={mouthColor}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}

function GlassesPart({ glassesId }: { glassesId: string }) {
  const frameColor = "#2D2D2D";

  switch (glassesId) {
    case "glasses-round":
      return (
        <>
          <circle
            cx="75"
            cy="90"
            r="19"
            fill="none"
            stroke={frameColor}
            strokeWidth="4"
          />
          <circle cx="75" cy="90" r="17" fill="rgba(200,220,255,0.1)" />
          <circle
            cx="125"
            cy="90"
            r="19"
            fill="none"
            stroke={frameColor}
            strokeWidth="4"
          />
          <circle cx="125" cy="90" r="17" fill="rgba(200,220,255,0.1)" />
          <line
            x1="94"
            y1="90"
            x2="106"
            y2="90"
            stroke={frameColor}
            strokeWidth="4"
          />
          <line
            x1="56"
            y1="88"
            x2="42"
            y2="82"
            stroke={frameColor}
            strokeWidth="3"
          />
          <line
            x1="144"
            y1="88"
            x2="158"
            y2="82"
            stroke={frameColor}
            strokeWidth="3"
          />
        </>
      );
    case "glasses-square":
      return (
        <>
          <rect
            x="55"
            y="74"
            width="40"
            height="32"
            fill="rgba(200,220,255,0.1)"
            stroke={frameColor}
            strokeWidth="4"
            rx="5"
          />
          <rect
            x="105"
            y="74"
            width="40"
            height="32"
            fill="rgba(200,220,255,0.1)"
            stroke={frameColor}
            strokeWidth="4"
            rx="5"
          />
          <line
            x1="95"
            y1="90"
            x2="105"
            y2="90"
            stroke={frameColor}
            strokeWidth="4"
          />
          <line
            x1="55"
            y1="83"
            x2="42"
            y2="78"
            stroke={frameColor}
            strokeWidth="3"
          />
          <line
            x1="145"
            y1="83"
            x2="158"
            y2="78"
            stroke={frameColor}
            strokeWidth="3"
          />
        </>
      );
    case "glasses-sunglasses":
      return (
        <>
          <ellipse
            cx="75"
            cy="90"
            rx="24"
            ry="17"
            fill="#1A1A1A"
            stroke={frameColor}
            strokeWidth="3"
          />
          <ellipse
            cx="75"
            cy="87"
            rx="8"
            ry="5"
            fill="rgba(255,255,255,0.15)"
          />
          <ellipse
            cx="125"
            cy="90"
            rx="24"
            ry="17"
            fill="#1A1A1A"
            stroke={frameColor}
            strokeWidth="3"
          />
          <ellipse
            cx="125"
            cy="87"
            rx="8"
            ry="5"
            fill="rgba(255,255,255,0.15)"
          />
          <line
            x1="99"
            y1="90"
            x2="101"
            y2="90"
            stroke={frameColor}
            strokeWidth="4"
          />
          <line
            x1="51"
            y1="83"
            x2="38"
            y2="77"
            stroke={frameColor}
            strokeWidth="3"
          />
          <line
            x1="149"
            y1="83"
            x2="162"
            y2="77"
            stroke={frameColor}
            strokeWidth="3"
          />
        </>
      );
    case "glasses-aviator":
      return (
        <>
          <path
            d="M51 78 Q75 73 99 85 L99 102 Q75 114 51 102 Z"
            fill="rgba(50,50,50,0.75)"
            stroke="#D4AF37"
            strokeWidth="2.5"
          />
          <path
            d="M60 80 Q70 78 80 82"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M101 85 Q125 73 149 78 L149 102 Q125 114 101 102 Z"
            fill="rgba(50,50,50,0.75)"
            stroke="#D4AF37"
            strokeWidth="2.5"
          />
          <path
            d="M110 80 Q120 78 130 82"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <line
            x1="99"
            y1="88"
            x2="101"
            y2="88"
            stroke="#D4AF37"
            strokeWidth="3"
          />
          <line
            x1="51"
            y1="78"
            x2="38"
            y2="72"
            stroke="#D4AF37"
            strokeWidth="2.5"
          />
          <line
            x1="149"
            y1="78"
            x2="162"
            y2="72"
            stroke="#D4AF37"
            strokeWidth="2.5"
          />
        </>
      );
    case "glasses-nerd":
      return (
        <>
          <circle
            cx="75"
            cy="90"
            r="24"
            fill="rgba(200,220,255,0.08)"
            stroke={frameColor}
            strokeWidth="5"
          />
          <circle
            cx="125"
            cy="90"
            r="24"
            fill="rgba(200,220,255,0.08)"
            stroke={frameColor}
            strokeWidth="5"
          />
          <line
            x1="99"
            y1="90"
            x2="101"
            y2="90"
            stroke={frameColor}
            strokeWidth="5"
          />
          <line
            x1="51"
            y1="88"
            x2="38"
            y2="83"
            stroke={frameColor}
            strokeWidth="4"
          />
          <line
            x1="149"
            y1="88"
            x2="162"
            y2="83"
            stroke={frameColor}
            strokeWidth="4"
          />
          {/* Tape on bridge */}
          <rect x="97" y="86" width="6" height="8" fill="#F5E6D3" rx="1" />
          <line
            x1="98"
            y1="88"
            x2="102"
            y2="88"
            stroke="#DDD"
            strokeWidth="0.5"
          />
          <line
            x1="98"
            y1="90"
            x2="102"
            y2="90"
            stroke="#DDD"
            strokeWidth="0.5"
          />
          <line
            x1="98"
            y1="92"
            x2="102"
            y2="92"
            stroke="#DDD"
            strokeWidth="0.5"
          />
        </>
      );
    default:
      return null;
  }
}

function AccessoryPart({
  accessoryId,
  animated,
}: {
  accessoryId: string;
  animated?: boolean;
}) {
  switch (accessoryId) {
    case "acc-cap":
      return (
        <>
          <ellipse cx="100" cy="52" rx="58" ry="22" fill="#2563EB" />
          <rect x="42" y="38" width="116" height="28" fill="#3B82F6" rx="6" />
          <rect x="88" y="28" width="65" height="16" fill="#3B82F6" rx="4" />
          {/* Stitching */}
          <line
            x1="50"
            y1="52"
            x2="150"
            y2="52"
            stroke="#1D4ED8"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          {/* Logo area */}
          <circle cx="100" cy="48" r="8" fill="#1D4ED8" />
          <circle cx="100" cy="48" r="5" fill="#DBEAFE" />
        </>
      );
    case "acc-beanie":
      return (
        <>
          <path d="M43 72 Q43 23 100 18 Q157 23 157 72" fill="#DC2626" />
          <rect x="43" y="58" width="114" height="18" fill="#B91C1C" rx="4" />
          {/* Ribbed texture */}
          <line
            x1="50"
            y1="62"
            x2="50"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="65"
            y1="62"
            x2="65"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="62"
            x2="80"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="95"
            y1="62"
            x2="95"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="110"
            y1="62"
            x2="110"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="125"
            y1="62"
            x2="125"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          <line
            x1="140"
            y1="62"
            x2="140"
            y2="72"
            stroke="#991B1B"
            strokeWidth="2"
          />
          {/* Pom pom */}
          <circle cx="100" cy="13" r="10" fill="#EF4444" />
          <circle cx="97" cy="10" r="3" fill="#FCA5A5" opacity="0.5" />
        </>
      );
    case "acc-headphones":
      return (
        <>
          <path
            d="M38 92 Q38 38 100 33 Q162 38 162 92"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="10"
          />
          <path
            d="M42 92 Q42 42 100 37 Q158 42 158 92"
            fill="none"
            stroke="#333"
            strokeWidth="6"
          />
          {/* Left ear cup */}
          <ellipse cx="38" cy="97" rx="14" ry="20" fill="#1F1F1F" />
          <ellipse cx="38" cy="97" rx="10" ry="16" fill="#333" />
          <ellipse cx="38" cy="97" rx="6" ry="10" fill="#444" />
          {/* Right ear cup */}
          <ellipse cx="162" cy="97" rx="14" ry="20" fill="#1F1F1F" />
          <ellipse cx="162" cy="97" rx="10" ry="16" fill="#333" />
          <ellipse cx="162" cy="97" rx="6" ry="10" fill="#444" />
          {/* Highlights */}
          <ellipse cx="35" cy="90" rx="3" ry="5" fill="rgba(255,255,255,0.1)" />
          <ellipse
            cx="159"
            cy="90"
            rx="3"
            ry="5"
            fill="rgba(255,255,255,0.1)"
          />
        </>
      );
    case "acc-crown":
      return (
        <motion.g
          animate={animated ? { y: [0, -3, 0] } : undefined}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* Crown base */}
          <polygon
            points="100,3 65,38 78,38 60,25 72,48 85,30 100,48 115,30 128,48 140,25 122,38 135,38"
            fill="#FFD700"
            stroke="#B8860B"
            strokeWidth="2"
          />
          {/* Gems */}
          <circle
            cx="72"
            cy="32"
            r="5"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="20"
            r="6"
            fill="#3B82F6"
            stroke="#1D4ED8"
            strokeWidth="1"
          />
          <circle
            cx="128"
            cy="32"
            r="5"
            fill="#10B981"
            stroke="#059669"
            strokeWidth="1"
          />
          {/* Gem highlights */}
          <ellipse
            cx="70"
            cy="30"
            rx="2"
            ry="1.5"
            fill="rgba(255,255,255,0.5)"
          />
          <ellipse
            cx="98"
            cy="18"
            rx="2"
            ry="1.5"
            fill="rgba(255,255,255,0.5)"
          />
          <ellipse
            cx="126"
            cy="30"
            rx="2"
            ry="1.5"
            fill="rgba(255,255,255,0.5)"
          />
          {/* Gold shine */}
          <line
            x1="80"
            y1="25"
            x2="90"
            y2="35"
            stroke="#FEF3C7"
            strokeWidth="2"
            opacity="0.4"
            strokeLinecap="round"
          />
        </motion.g>
      );
    case "acc-halo":
      return (
        <motion.g
          animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ellipse
            cx="100"
            cy="23"
            rx="42"
            ry="12"
            fill="none"
            stroke="#FFD700"
            strokeWidth="8"
            opacity="0.9"
          />
          <ellipse
            cx="100"
            cy="23"
            rx="42"
            ry="12"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="3"
            opacity="0.5"
          />
          {/* Glow effect */}
          <ellipse
            cx="100"
            cy="23"
            rx="45"
            ry="15"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity="0.3"
          />
        </motion.g>
      );
    case "acc-earbuds":
      return (
        <>
          {/* Left earbud */}
          <ellipse cx="38" cy="102" rx="7" ry="8" fill="#F5F5F5" />
          <ellipse cx="38" cy="102" rx="5" ry="6" fill="#E5E5E5" />
          <ellipse cx="38" cy="101" rx="2" ry="2.5" fill="#D4D4D4" />
          {/* Right earbud */}
          <ellipse cx="162" cy="102" rx="7" ry="8" fill="#F5F5F5" />
          <ellipse cx="162" cy="102" rx="5" ry="6" fill="#E5E5E5" />
          <ellipse cx="162" cy="101" rx="2" ry="2.5" fill="#D4D4D4" />
          {/* Wires */}
          <path
            d="M38 110 Q38 145 60 165"
            stroke="#F5F5F5"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M162 110 Q162 145 140 165"
            stroke="#F5F5F5"
            strokeWidth="2.5"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
}

function ClothingPart({
  clothingId,
  uniqueId,
}: {
  clothingId: string;
  uniqueId: string;
}) {
  switch (clothingId) {
    case "clothing-hoodie":
      return (
        <>
          <defs>
            <linearGradient
              id={`${uniqueId}-hoodie`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
          </defs>
          <path
            d="M48 160 Q48 182 100 188 Q152 182 152 160 L165 200 L35 200 Z"
            fill={`url(#${uniqueId}-hoodie)`}
          />
          <path
            d="M68 160 Q100 172 132 160"
            fill="none"
            stroke="#374151"
            strokeWidth="4"
          />
          {/* Hood drawstrings */}
          <line
            x1="82"
            y1="168"
            x2="82"
            y2="195"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="118"
            y1="168"
            x2="118"
            y2="195"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* String ends */}
          <circle cx="82" cy="196" r="3" fill="#9CA3AF" />
          <circle cx="118" cy="196" r="3" fill="#9CA3AF" />
          {/* Pocket */}
          <path d="M70 180 L130 180" stroke="#374151" strokeWidth="2" />
        </>
      );
    case "clothing-jacket":
      return (
        <>
          <defs>
            <linearGradient
              id={`${uniqueId}-jacket`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
          <path
            d="M48 160 L35 200 L165 200 L152 160"
            fill={`url(#${uniqueId}-jacket)`}
          />
          {/* Zipper */}
          <line
            x1="100"
            y1="160"
            x2="100"
            y2="200"
            stroke="#3B82F6"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="160"
            x2="100"
            y2="200"
            stroke="#60A5FA"
            strokeWidth="1"
          />
          {/* Pockets */}
          <rect x="52" y="175" width="18" height="12" fill="#1D4ED8" rx="3" />
          <rect x="130" y="175" width="18" height="12" fill="#1D4ED8" rx="3" />
          {/* Collar */}
          <path d="M70 160 L85 175 L100 160" fill="#1D4ED8" />
          <path d="M130 160 L115 175 L100 160" fill="#1D4ED8" />
        </>
      );
    case "clothing-sweater":
      return (
        <>
          <path
            d="M48 160 Q48 182 100 188 Q152 182 152 160 L165 200 L35 200 Z"
            fill="#DC2626"
          />
          {/* Knit pattern */}
          <path d="M38 175 L162 175" stroke="#B91C1C" strokeWidth="2" />
          <path d="M38 182 L162 182" stroke="#B91C1C" strokeWidth="2" />
          <path d="M38 189 L162 189" stroke="#B91C1C" strokeWidth="2" />
          <path d="M38 196 L162 196" stroke="#B91C1C" strokeWidth="2" />
          {/* Collar ribbing */}
          <path
            d="M70 160 Q100 170 130 160"
            fill="none"
            stroke="#991B1B"
            strokeWidth="3"
          />
        </>
      );
    case "clothing-shirt":
      return (
        <>
          <defs>
            <linearGradient
              id={`${uniqueId}-shirt`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F3F4F6" />
            </linearGradient>
          </defs>
          <path
            d="M52 160 L40 200 L160 200 L148 160"
            fill={`url(#${uniqueId}-shirt)`}
          />
          {/* Collar */}
          <path
            d="M82 160 L100 182 L118 160"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          {/* Button line */}
          <line
            x1="100"
            y1="182"
            x2="100"
            y2="200"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          {/* Buttons */}
          <circle cx="100" cy="186" r="2" fill="#D1D5DB" />
          <circle cx="100" cy="193" r="2" fill="#D1D5DB" />
        </>
      );
    case "clothing-tank":
      return (
        <>
          <defs>
            <linearGradient
              id={`${uniqueId}-tank`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path
            d="M62 160 L55 200 L145 200 L138 160"
            fill={`url(#${uniqueId}-tank)`}
          />
          {/* Shoulder straps implied by cut */}
          <path
            d="M62 160 Q75 165 80 160"
            fill="none"
            stroke="#047857"
            strokeWidth="1"
          />
          <path
            d="M138 160 Q125 165 120 160"
            fill="none"
            stroke="#047857"
            strokeWidth="1"
          />
        </>
      );
    default: // clothing-tshirt
      return (
        <>
          <defs>
            <linearGradient
              id={`${uniqueId}-tshirt`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path
            d="M48 160 Q48 182 100 188 Q152 182 152 160 L165 200 L35 200 Z"
            fill={`url(#${uniqueId}-tshirt)`}
          />
          {/* Collar */}
          <path
            d="M68 160 Q100 172 132 160"
            fill="none"
            stroke="#6D28D9"
            strokeWidth="3"
          />
          {/* Slight sleeve indication */}
          <path d="M48 165 L38 175" stroke="#6D28D9" strokeWidth="2" />
          <path d="M152 165 L162 175" stroke="#6D28D9" strokeWidth="2" />
        </>
      );
  }
}

export default AvatarDisplay;
