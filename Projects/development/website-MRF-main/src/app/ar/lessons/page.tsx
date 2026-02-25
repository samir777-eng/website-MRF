import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الدروس",
  description: "استكشف جميع الدروس المتاحة في منصة الأستاذ رضا الفاروق",
};

export default function LessonsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">الدروس</h1>
        <p className="text-muted-foreground mb-8">
          استكشف جميع الدروس والمحاضرات المتاحة
        </p>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground">
            قريباً... يتم العمل على إضافة المزيد من الدروس
          </p>

          <Link href="/ar">
            <Button>العودة للصفحة الرئيسية</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
