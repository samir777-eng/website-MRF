import dynamic from "next/dynamic";

// Lazy load heavy components with loading fallback
// Note: Loading components removed to avoid JSX in .ts file
// Use these components directly and handle loading states in parent components

export const LazyVideoPlayer = dynamic(
  () =>
    import("@/components/video/VideoPlayer").then((mod) => ({
      default: mod.VideoPlayer,
    })),
  {
    ssr: false,
  },
);

export const LazyChart = dynamic(
  () =>
    import("@/components/charts/chart").then((mod) => ({ default: mod.Chart })),
  {
    ssr: false,
  },
);

export const LazyModal = dynamic(
  () =>
    import("@/components/ui/dialog").then((mod) => ({ default: mod.Dialog })),
  {
    ssr: false,
  },
);

export const LazyGlobalSearch = dynamic(
  () =>
    import("@/components/ui/global-search").then((mod) => ({
      default: mod.GlobalSearch,
    })),
  {
    ssr: false,
  },
);

export const LazyKeyboardShortcutsModal = dynamic(
  () =>
    import("@/components/ui/keyboard-shortcuts-modal").then((mod) => ({
      default: mod.KeyboardShortcutsModal,
    })),
  {
    ssr: false,
  },
);
