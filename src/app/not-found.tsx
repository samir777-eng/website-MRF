import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold mt-4">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground mt-2">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/ar">
            <Button className="flex items-center">
              <Home className="w-4 h-4 ms-2" />
              العودة للرئيسية
            </Button>
          </Link>
          <Link href="/ar/lectures">
            <Button variant="outline" className="flex items-center">
              <Search className="w-4 h-4 ms-2" />
              تصفح الدروس
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            هل تحتاج مساعدة؟
          </p>
          <Link href="/ar/help">
            <Button variant="link" className="flex items-center">
              اتصل بالدعم
              <ArrowRight className="w-4 h-4 me-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

