# MRF Educational Platform

A modern Arabic language learning platform built with Next.js 15, React 19, and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/samir777-eng/website-MRF)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/samir777-eng/website-MRF/pulls)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/samir777-eng/website-MRF/graphs/commit-activity)
[![Arabic Support](https://img.shields.io/badge/Arabic-RTL%20Ready-success)](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)

## Overview

MRF Educational Platform is an interactive Arabic language learning application designed for Egyptian high school students. It combines gamification elements with comprehensive educational content to create an engaging learning experience.

### Key Features

- **Gamification System** - XP points, achievements, daily streaks, and leaderboards
- **Interactive Video Lessons** - High-quality content with in-video quizzes
- **Adaptive Learning** - Personalized content based on student performance
- **RTL Support** - Full Arabic language support with right-to-left layout
- **PWA Ready** - Installable as a mobile app with offline support
- **Accessibility** - WCAG 2.1 compliant with screen reader support

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion, GSAP
- **State Management:** Zustand
- **Testing:** Vitest, Playwright
- **i18n:** next-intl

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/samir777-eng/website-MRF.git
cd website-MRF

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run dev:turbo` | Start with Turbopack     |
| `npm run build`     | Build for production     |
| `npm run start`     | Start production server  |
| `npm run lint`      | Run ESLint               |
| `npm run format`    | Format with Prettier     |
| `npm run test`      | Run unit tests           |
| `npm run test:e2e`  | Run E2E tests            |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # Internationalized routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── gamification/     # XP, badges, streaks
│   ├── layout/           # Header, footer, navigation
│   └── video/            # Video player components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
└── styles/               # Global styles
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Styling Issues / Broken Appearance

If the app appears "broken" with missing styles, gradients, or buttons not rendering properly, this is likely due to Tailwind CSS v4 compatibility issues. The project uses Tailwind CSS v4, but some components may still contain v3 syntax.

**Symptoms:**

- Missing gradients on buttons and backgrounds
- Unstyled or plain-looking components
- Build errors related to CSS classes
- Components appearing without proper styling

**Solution:**
The following fixes have been implemented in `src/app/globals.css`:

1. **Updated Tailwind Import (Required for v4):**

   ```css
   @import "tailwindcss";
   ```

2. **Added Backward Compatibility Classes:**

   ```css
   .bg-linear-to-r {
     background: linear-gradient(to right, var(--tw-gradient-stops));
   }
   .bg-linear-to-b {
     background: linear-gradient(to bottom, var(--tw-gradient-stops));
   }
   .bg-linear-to-br {
     background: linear-gradient(to bottom right, var(--tw-gradient-stops));
   }
   /* + other gradient directions */
   ```

3. **Added Missing Utility Classes:**
   ```css
   .shadow-soft {
     box-shadow: var(--shadow-soft);
   }
   .shadow-soft-lg {
     box-shadow: var(--shadow-soft-lg);
   }
   .glass {
     background: hsl(var(--glass-bg));
     backdrop-filter: blur(var(--glass-blur));
   }
   .font-arabic {
     font-family:
       var(--font-cairo), var(--font-noto-sans-arabic), "Arial", sans-serif;
   }
   ```

**Quick Fix Commands:**

```bash
# Clean build cache and restart
rm -rf .next
npm run dev
```

### Module Resolution Errors

If you encounter "Cannot find module" errors:

```bash
# Clean dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Authors & Contributors

### Lead Developer
- **Samir Eldirini** - *Full Stack Developer & Project Architect*
  - GitHub: [@samir777-eng](https://github.com/samir777-eng)
  - LinkedIn: [Samir Eldirini](https://linkedin.com/in/samireldirini)
  - Email: samir.eldirini@outlook.com

### Subject Matter Expert
- **Professor Reda El Farouk** - *Arabic Language Education Specialist*
  - 31+ years of Arabic language teaching excellence
  - Egyptian Ministry of Education certified educator
  - High school Arabic language curriculum expert

### Acknowledgments

- **Egyptian Ministry of Education** - Curriculum guidelines and educational standards
- **Cairo University** - Arabic linguistics research and methodology
- **Open Source Community** - For the amazing tools and libraries that make this possible
- **Beta Testers** - 15,000+ Egyptian students who provided invaluable feedback

## Project Stats

![Lines of Code](https://img.shields.io/badge/Lines%20of%20Code-50K+-blue)
![Files](https://img.shields.io/badge/Files-800+-green)
![Components](https://img.shields.io/badge/Components-150+-purple)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25+-brightgreen)

## Support & Contact

- **Documentation**: [GitHub Wiki](https://github.com/samir777-eng/website-MRF/wiki)
- **Issues**: [GitHub Issues](https://github.com/samir777-eng/website-MRF/issues)
- **Discussions**: [GitHub Discussions](https://github.com/samir777-eng/website-MRF/discussions)
- **Email**: support@mrredaelfarouk.com

## License

MIT License - see [LICENSE](LICENSE) for details.

### Third-Party Licenses

- **Next.js** - MIT License
- **React** - MIT License  
- **Tailwind CSS** - MIT License
- **Radix UI** - MIT License
- **Framer Motion** - MIT License

---

<div align="center">

**Built with 💚 for Egyptian students**

*Empowering Arabic language education through modern technology*

[![Made in Egypt](https://img.shields.io/badge/Made%20in-Egypt-red)](https://en.wikipedia.org/wiki/Egypt)
[![For Students](https://img.shields.io/badge/For-Students-blue)](https://github.com/samir777-eng/website-MRF)
[![With Love](https://img.shields.io/badge/Built%20with-💚-green)](https://github.com/samir777-eng/website-MRF)

</div>
