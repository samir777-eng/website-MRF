# Dependencies Documentation

This file provides detailed information about all dependencies used in the MRF Educational Platform project.

## Production Dependencies

### Core Framework & Runtime
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `next` | ^15.5.9 | React framework with SSR/SSG support | Main application framework |
| `react` | 19.1.0 | JavaScript library for building UIs | Core UI library |
| `react-dom` | 19.1.0 | React DOM renderer | React DOM rendering |

### UI Components & Styling
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `@radix-ui/react-*` | ^1.x-2.x | Unstyled, accessible UI components | Base components (accordion, dialog, dropdown, etc.) |
| `tailwind-merge` | ^3.4.0 | Utility for merging Tailwind classes | Conditional CSS class merging |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities for Tailwind | CSS animations |
| `class-variance-authority` | ^0.7.1 | CVA for component variants | Component styling variants |
| `clsx` | ^2.1.1 | Utility for constructing className strings | Conditional CSS classes |
| `lucide-react` | ^0.544.0 | Beautiful & consistent icons | Icon library |

### Animations & Motion
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `framer-motion` | ^12.23.22 | Production-ready motion library | Page transitions, animations |
| `gsap` | ^3.13.0 | High-performance animation library | Advanced animations |
| `lottie-web` | ^5.13.0 | Render After Effects animations | Lottie animations |
| `canvas-confetti` | ^1.9.3 | Confetti animations | Celebration effects |

### Media & Interactions
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `hls.js` | ^1.6.13 | HLS video streaming | Video lesson playback |
| `howler` | ^2.2.4 | Audio library | Sound effects & audio |
| `@use-gesture/react` | ^10.3.1 | Touch/mouse gesture library | Swipe gestures, interactions |
| `embla-carousel-react` | ^8.6.0 | Carousel component | Image/content carousels |

### State Management & Data
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `zustand` | ^5.0.8 | Lightweight state management | Global state management |
| `swr` | ^2.3.6 | Data fetching library | Server state management |
| `zod` | ^4.3.6 | TypeScript schema validation | Form & API validation |

### Internationalization & Theming
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `next-intl` | ^4.3.9 | Internationalization for Next.js | Arabic/English localization |
| `next-themes` | ^0.4.6 | Theme switching | Dark/light mode |

### Layout & Visualization
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `react-grid-layout` | ^2.2.2 | Draggable & resizable grid | Dashboard layouts |
| `@tanstack/react-virtual` | ^3.13.12 | Virtualization library | Large list performance |
| `recharts` | ^3.2.1 | Chart library | Progress visualizations |

### Security & Performance
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `dompurify` | ^3.3.0 | DOM XSS sanitizer | Security against XSS |
| `web-vitals` | ^5.1.0 | Web performance metrics | Performance monitoring |

### Type Definitions
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `@types/react-grid-layout` | ^1.3.6 | TypeScript types | Grid layout types |

## Development Dependencies

### Build Tools & Framework
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `@next/bundle-analyzer` | ^15.5.4 | Bundle analysis tool | Bundle size optimization |
| `@tailwindcss/postcss` | ^4 | PostCSS for Tailwind v4 | CSS processing |
| `@tailwindcss/typography` | ^0.5.19 | Typography plugin | Rich text styling |
| `tailwindcss` | ^4 | CSS framework | Utility-first styling |

### Testing Framework
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `@playwright/test` | ^1.55.1 | End-to-end testing | E2E automated testing |
| `@axe-core/playwright` | ^4.10.2 | Accessibility testing | A11y compliance testing |
| `axe-core` | ^4.10.3 | Accessibility engine | Core accessibility checks |
| `vitest` | ^3.2.4 | Unit test framework | Fast unit testing |
| `@vitest/ui` | ^3.2.4 | Vitest UI | Test runner interface |
| `@vitest/coverage-v8` | ^3.2.4 | Code coverage | Coverage reporting |
| `@vitejs/plugin-react` | ^5.0.4 | React plugin for Vite | React support in Vitest |
| `jsdom` | ^27.0.0 | DOM implementation | Browser environment simulation |

### Testing Utilities
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `@testing-library/react` | ^16.3.0 | React testing utilities | Component testing |
| `@testing-library/dom` | ^10.4.1 | DOM testing utilities | DOM testing helpers |
| `@testing-library/jest-dom` | ^6.8.0 | Jest DOM matchers | Extended DOM assertions |
| `@testing-library/user-event` | ^14.6.1 | User interaction simulation | User event testing |
| `msw` | ^2.11.3 | API mocking library | Mock service worker |

### Code Quality & Linting
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `eslint` | ^9 | JavaScript linter | Code quality enforcement |
| `eslint-config-next` | 15.5.4 | Next.js ESLint config | Next.js specific linting |
| `@eslint/eslintrc` | ^3 | ESLint configuration | ESLint config utilities |
| `@biomejs/biome` | ^2.2.4 | Fast linter/formatter | Alternative linting tool |
| `prettier` | ^3.6.2 | Code formatter | Code formatting |

### Git Hooks & Commit Standards
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `husky` | ^9.1.7 | Git hooks manager | Git hook automation |
| `lint-staged` | ^16.2.3 | Staged files linter | Pre-commit code quality |
| `@commitlint/cli` | ^20.0.0 | Commit message linter | Commit message standards |
| `@commitlint/config-conventional` | ^20.0.0 | Conventional commit config | Commit message format |

### TypeScript & Types
| Package | Version | Description | Purpose |
|---------|---------|-------------|---------|
| `typescript` | ^5 | TypeScript compiler | Type checking |
| `@types/node` | 20.19.30 | Node.js type definitions | Node.js types |
| `@types/react` | 19.2.9 | React type definitions | React types |
| `@types/react-dom` | ^19 | React DOM type definitions | React DOM types |
| `@types/canvas-confetti` | ^1.9.0 | Canvas confetti types | Confetti library types |
| `@types/dompurify` | ^3.0.5 | DOMPurify type definitions | DOMPurify types |
| `@types/howler` | ^2.2.12 | Howler.js type definitions | Audio library types |

## Engine Requirements

- **Node.js**: >= 18.17.0
- **npm**: >= 9.0.0

## Dependency Categories

### 🎯 **Core** (5 packages)
Essential framework and runtime dependencies that form the foundation of the application.

### 🎨 **UI & Styling** (15+ packages)
Components, styling utilities, and design system packages for creating the user interface.

### 🎬 **Animation** (4 packages)
Motion libraries for creating engaging animations and transitions.

### 📱 **Media & Interaction** (4 packages)
Packages for handling video, audio, and user interactions.

### 🔄 **State & Data** (3 packages)
State management and data fetching solutions.

### 🌐 **i18n & Themes** (2 packages)
Internationalization and theming capabilities.

### 📊 **Visualization** (3 packages)
Layout and data visualization components.

### 🔒 **Security & Performance** (2 packages)
Security and performance monitoring tools.

### 🧪 **Testing** (12+ packages)
Comprehensive testing framework including unit, integration, and E2E testing.

### ✨ **Code Quality** (8 packages)
Linting, formatting, and code quality tools.

### 🔧 **Build & Development** (6+ packages)
Build tools, TypeScript support, and development utilities.

## Update Guidelines

- **Major updates**: Review changelog and test thoroughly
- **Minor updates**: Safe to update with caution
- **Patch updates**: Generally safe for security fixes
- **Breaking changes**: Always documented in migration guides

## Security Considerations

- `dompurify`: Critical for XSS prevention
- Regular dependency audits: `npm audit`
- Keep security-sensitive packages updated
- Review dependency licenses for compliance