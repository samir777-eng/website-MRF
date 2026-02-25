/**
 * Simple test page to check if basic styling works
 */
export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Test Page - Styling Check
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Colors Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Colors Test
            </h2>
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground p-2 rounded">
                Primary Color
              </div>
              <div className="bg-secondary text-secondary-foreground p-2 rounded">
                Secondary Color
              </div>
              <div className="bg-muted text-muted-foreground p-2 rounded">
                Muted Color
              </div>
            </div>
          </div>

          {/* Typography Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Typography Test
            </h2>
            <div className="space-y-2 text-right" dir="rtl">
              <p className="text-lg font-bold">نص عريض كبير</p>
              <p className="text-base">نص عادي متوسط</p>
              <p className="text-sm text-muted-foreground">
                نص صغير باللون الكامد
              </p>
              <p className="text-xs">نص صغير جداً</p>
            </div>
          </div>

          {/* Buttons Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Buttons Test
            </h2>
            <div className="space-y-2">
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90">
                Primary Button
              </button>
              <button className="w-full border border-input bg-background py-2 px-4 rounded hover:bg-accent">
                Outline Button
              </button>
              <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-secondary/80">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Gradients Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Gradients Test
            </h2>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-primary to-violet-500 p-4 rounded text-white">
                Primary Gradient
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded text-white">
                Success Gradient
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded text-white">
                Info Gradient
              </div>
            </div>
          </div>
        </div>

        {/* Layout Test */}
        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            Layout Test
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-primary/10 p-4 rounded flex-1 min-w-0">
              <p className="text-center">Flex Item 1</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded flex-1 min-w-0">
              <p className="text-center">Flex Item 2</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded flex-1 min-w-0">
              <p className="text-center">Flex Item 3</p>
            </div>
          </div>
        </div>

        {/* RTL Test */}
        <div className="mt-8 bg-card p-6 rounded-lg border" dir="rtl">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            اختبار النص العربي
          </h2>
          <p className="text-base leading-relaxed">
            هذا نص تجريبي للتأكد من أن النصوص العربية تظهر بشكل صحيح في التطبيق.
            يجب أن يكون النص محاذي إلى اليمين وأن تكون الخطوط واضحة ومقروءة.
          </p>
        </div>
      </div>
    </div>
  );
}
