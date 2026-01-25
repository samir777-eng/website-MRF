# MRF Educational Platform

A modern Arabic language learning platform built with Next.js 15, React 19, and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

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

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:turbo` | Start with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with passion for Egyptian students.
