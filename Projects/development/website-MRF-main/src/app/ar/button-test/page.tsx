import { Button } from "@/components/ui/button";

/**
 * Simple button test page to verify styling fixes
 */
export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Button Styling Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Default Variants</h3>
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>

          {/* Status Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status Variants</h3>
            <Button variant="success">Success Button</Button>
            <Button variant="warning">Warning Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>

          {/* Special Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Special Variants</h3>
            <Button variant="glass">Glass Button</Button>
            <Button variant="gradient">Gradient Button</Button>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sizes</h3>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>

          {/* Arabic Text */}
          <div className="space-y-4" dir="rtl">
            <h3 className="text-lg font-semibold">Arabic Buttons</h3>
            <Button>ابدأ التعلم</Button>
            <Button variant="secondary">تسجيل الدخول</Button>
            <Button variant="outline">المزيد من المعلومات</Button>
          </div>

          {/* States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">States</h3>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Expected Fixes:</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✅ Soft shadows should now appear on buttons</li>
            <li>✅ Gradient buttons should have proper background</li>
            <li>✅ Glass buttons should have backdrop blur effect</li>
            <li>✅ Arabic fonts should render correctly</li>
            <li>✅ All hover effects should work smoothly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
