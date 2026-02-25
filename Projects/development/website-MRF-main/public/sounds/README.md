# Sound Effects Directory

This directory contains audio files for the gamification sound effects system.

## Required Sound Files

The following sound files are needed for the full experience. The system includes Web Audio API fallbacks for missing files.

### Core Sounds

- `correct.mp3` / `correct.wav` - Correct answer feedback (bright ding)
- `wrong.mp3` / `wrong.wav` - Wrong answer feedback (soft boop)
- `click.mp3` / `click.wav` - UI click sound

### Combo Sounds

- `combo.mp3` / `combo.wav` - Base combo sound
- `combo-medium.mp3` - Medium combo (5+ streak)
- `combo-high.mp3` - High combo (10+ streak)
- `combo-break.mp3` - Combo break sound

### Celebration Sounds

- `level-up.mp3` / `level-up.wav` - Level up fanfare
- `achievement.mp3` / `achievement.wav` - Achievement unlock
- `perfect-score.mp3` - Perfect score celebration
- `xp-gain.mp3` / `xp-gain.wav` - XP gained chime
- `coin.mp3` / `coin.wav` - Coin/gem collected

### Streak Sounds

- `streak.mp3` / `streak.wav` - Daily streak maintained
- `streak-milestone.mp3` - Streak milestone (7, 14, 30, 100 days)

### Notification

- `notification.mp3` / `notification.wav` - General notification

## Recommended Sources for Free Sounds

1. **Freesound.org** - CC0 licensed UI sounds
2. **Mixkit.co** - Free sound effects
3. **Pixabay** - Royalty-free sounds
4. **OpenGameArt.org** - Game UI sounds

## Fallback System

The sound effects hook includes a Web Audio API fallback that generates procedural tones when sound files are missing. This ensures the app works even without audio files, just with basic synthesized sounds.
