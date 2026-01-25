"use client";

/**
 * Sound Effects System
 * Phase 1.3: Audio feedback for gamification events
 * 
 * Uses Howler.js for reliable cross-browser audio playback
 */

import { useCallback, useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";
import { Howl } from "howler";

// ============================================================================
// TYPES
// ============================================================================

type SoundName = 
  | "correct"
  | "wrong"
  | "combo"
  | "comboMedium"
  | "comboHigh"
  | "comboBreak"
  | "levelUp"
  | "achievement"
  | "streak"
  | "streakMilestone"
  | "perfectScore"
  | "xpGain"
  | "click"
  | "success"
  | "notification"
  | "coin";

interface SoundConfig {
  src: string[];
  volume?: number;
  rate?: number;
  sprite?: Record<string, [number, number]>;
}

interface UseSoundEffectsOptions {
  enabled?: boolean;
  volume?: number;
}

// ============================================================================
// SOUND CONFIGURATIONS
// ============================================================================

// Using base64 encoded minimal sounds for instant loading
// These are tiny UI sounds that work across all browsers
const SOUND_CONFIGS: Record<SoundName, SoundConfig> = {
  // Correct answer - bright ding
  correct: {
    src: ["/sounds/correct.mp3", "/sounds/correct.wav"],
    volume: 0.5,
  },
  
  // Wrong answer - soft boop
  wrong: {
    src: ["/sounds/wrong.mp3", "/sounds/wrong.wav"],
    volume: 0.4,
  },
  
  // Combo sounds - escalating intensity
  combo: {
    src: ["/sounds/combo.mp3", "/sounds/combo.wav"],
    volume: 0.5,
  },
  comboMedium: {
    src: ["/sounds/combo-medium.mp3", "/sounds/combo.wav"],
    volume: 0.6,
    rate: 1.1,
  },
  comboHigh: {
    src: ["/sounds/combo-high.mp3", "/sounds/combo.wav"],
    volume: 0.7,
    rate: 1.2,
  },
  comboBreak: {
    src: ["/sounds/combo-break.mp3", "/sounds/wrong.wav"],
    volume: 0.4,
  },
  
  // Level up - triumphant fanfare
  levelUp: {
    src: ["/sounds/level-up.mp3", "/sounds/level-up.wav"],
    volume: 0.7,
  },
  
  // Achievement - satisfying unlock
  achievement: {
    src: ["/sounds/achievement.mp3", "/sounds/achievement.wav"],
    volume: 0.6,
  },
  
  // Streak sounds
  streak: {
    src: ["/sounds/streak.mp3", "/sounds/streak.wav"],
    volume: 0.5,
  },
  streakMilestone: {
    src: ["/sounds/streak-milestone.mp3", "/sounds/streak.wav"],
    volume: 0.7,
  },
  
  // Perfect score - epic celebration
  perfectScore: {
    src: ["/sounds/perfect-score.mp3", "/sounds/level-up.wav"],
    volume: 0.8,
  },
  
  // XP gain - quick chime
  xpGain: {
    src: ["/sounds/xp-gain.mp3", "/sounds/coin.wav"],
    volume: 0.4,
  },
  
  // UI sounds
  click: {
    src: ["/sounds/click.mp3", "/sounds/click.wav"],
    volume: 0.3,
  },
  success: {
    src: ["/sounds/success.mp3", "/sounds/correct.wav"],
    volume: 0.5,
  },
  notification: {
    src: ["/sounds/notification.mp3", "/sounds/notification.wav"],
    volume: 0.5,
  },
  coin: {
    src: ["/sounds/coin.mp3", "/sounds/coin.wav"],
    volume: 0.5,
  },
};

// ============================================================================
// FALLBACK AUDIO GENERATOR
// ============================================================================

/**
 * Generate Web Audio API based sounds as fallback
 * This ensures sounds work even without audio files
 */
class FallbackSoundGenerator {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) {
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Fallback audio not available:", e);
    }
  }

  correct() {
    this.playTone(880, 0.1, "sine", 0.3);
    setTimeout(() => this.playTone(1100, 0.15, "sine", 0.3), 80);
  }

  wrong() {
    this.playTone(200, 0.2, "square", 0.2);
  }

  combo() {
    this.playTone(523, 0.08, "sine", 0.3);
    setTimeout(() => this.playTone(659, 0.08, "sine", 0.3), 60);
    setTimeout(() => this.playTone(784, 0.1, "sine", 0.3), 120);
  }

  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "sine", 0.4), i * 100);
    });
  }

  achievement() {
    this.playTone(784, 0.1, "sine", 0.4);
    setTimeout(() => this.playTone(988, 0.1, "sine", 0.4), 100);
    setTimeout(() => this.playTone(1175, 0.2, "sine", 0.4), 200);
  }

  xpGain() {
    this.playTone(1200, 0.08, "sine", 0.2);
  }

  click() {
    this.playTone(800, 0.03, "sine", 0.15);
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useSoundEffects(options: UseSoundEffectsOptions = {}) {
  const { enabled = true, volume = 1 } = options;
  
  const soundsRef = useRef<Map<SoundName, Howl>>(new Map());
  const fallbackRef = useRef<FallbackSoundGenerator | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(volume);

  // Initialize sounds
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Initialize fallback generator
    fallbackRef.current = new FallbackSoundGenerator();

    // Try to load Howler sounds
    const loadPromises: Promise<void>[] = [];

    Object.entries(SOUND_CONFIGS).forEach(([name, config]) => {
      const promise = new Promise<void>((resolve) => {
        const howl = new Howl({
          src: config.src,
          volume: (config.volume ?? 0.5) * masterVolume,
          rate: config.rate ?? 1,
          preload: true,
          html5: false, // Use Web Audio API for lower latency
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Sound "${name}" failed to load, using fallback`);
            resolve();
          },
        });
        soundsRef.current.set(name as SoundName, howl);
      });
      loadPromises.push(promise);
    });

    Promise.all(loadPromises).then(() => {
      setIsLoaded(true);
    });

    // Cleanup
    return () => {
      soundsRef.current.forEach((howl) => howl.unload());
      soundsRef.current.clear();
    };
  }, [enabled, masterVolume]);

  // Play sound function
  const play = useCallback((name: SoundName) => {
    if (!enabled || isMuted) return;

    const howl = soundsRef.current.get(name);
    
    if (howl && howl.state() === "loaded") {
      howl.play();
    } else {
      // Use fallback
      const fallback = fallbackRef.current;
      if (!fallback) return;

      switch (name) {
        case "correct":
        case "success":
          fallback.correct();
          break;
        case "wrong":
        case "comboBreak":
          fallback.wrong();
          break;
        case "combo":
        case "comboMedium":
        case "comboHigh":
          fallback.combo();
          break;
        case "levelUp":
        case "perfectScore":
        case "streakMilestone":
          fallback.levelUp();
          break;
        case "achievement":
        case "streak":
          fallback.achievement();
          break;
        case "xpGain":
        case "coin":
          fallback.xpGain();
          break;
        case "click":
        case "notification":
          fallback.click();
          break;
      }
    }
  }, [enabled, isMuted]);

  // Volume control
  const setVolume = useCallback((vol: number) => {
    setMasterVolume(vol);
    soundsRef.current.forEach((howl, name) => {
      const config = SOUND_CONFIGS[name];
      howl.volume((config.volume ?? 0.5) * vol);
    });
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Convenience methods for common sounds
  const playCorrect = useCallback(() => play("correct"), [play]);
  const playWrong = useCallback(() => play("wrong"), [play]);
  const playCombo = useCallback((level: number = 1) => {
    if (level >= 10) play("comboHigh");
    else if (level >= 5) play("comboMedium");
    else play("combo");
  }, [play]);
  const playLevelUp = useCallback(() => play("levelUp"), [play]);
  const playAchievement = useCallback(() => play("achievement"), [play]);
  const playXPGain = useCallback(() => play("xpGain"), [play]);
  const playClick = useCallback(() => play("click"), [play]);
  const playPerfectScore = useCallback(() => play("perfectScore"), [play]);

  return {
    play,
    playCorrect,
    playWrong,
    playCombo,
    playLevelUp,
    playAchievement,
    playXPGain,
    playClick,
    playPerfectScore,
    isLoaded,
    isMuted,
    toggleMute,
    setVolume,
    masterVolume,
  };
}

// ============================================================================
// SOUND CONTEXT (Optional - for global access)
// ============================================================================

interface SoundContextType extends ReturnType<typeof useSoundEffects> {}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ 
  children, 
  ...options 
}: { 
  children: ReactNode 
} & UseSoundEffectsOptions) {
  const sounds = useSoundEffects(options);
  
  return (
    <SoundContext.Provider value={sounds}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    // Return a no-op version if not in provider
    return {
      play: () => {},
      playCorrect: () => {},
      playWrong: () => {},
      playCombo: () => {},
      playLevelUp: () => {},
      playAchievement: () => {},
      playXPGain: () => {},
      playClick: () => {},
      playPerfectScore: () => {},
      isLoaded: false,
      isMuted: true,
      toggleMute: () => {},
      setVolume: () => {},
      masterVolume: 0,
    };
  }
  return context;
}

export default useSoundEffects;

