export default function SkipNavigation() {
  return (
    <div suppressHydrationWarning>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-3 focus:min-h-[44px] focus:min-w-[44px] focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:flex focus:items-center"
      >
        تخطي إلى المحتوى الرئيسي
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:left-4 focus:z-[9999] focus:px-4 focus:py-3 focus:min-h-[44px] focus:min-w-[44px] focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:flex focus:items-center"
      >
        تخطي إلى التنقل
      </a>
    </div>
  );
}
