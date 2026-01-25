"use client";

import { BundleCheckoutModal } from "@/components/bundles";
import RewardsSystem from "@/components/gamification/RewardsSystem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlyToCart } from "@/components/ui/fly-to-cart-animation";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/useToast";
import { MOCK_BOOKS, MOCK_PACKAGES } from "@/lib/store/mock-books";
import { Book } from "@/types/store";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Coins,
  Crown,
  Flame,
  Gem,
  Gift,
  GraduationCap,
  Heart,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type TabType = "bundles" | "books" | "rewards";
type GradeLevel = "1" | "2" | "3";
type BundleType = "monthly" | "semester";

interface Bundle {
  id: string;
  name: string;
  type: BundleType;
  lectureCount: number;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: number;
}

interface UserBundle {
  id: string;
  bundleName: string;
  purchasedAt: Date;
  expiresAt: Date;
  lecturesRemaining: number;
  totalLectures: number;
}

// Tab button component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
        active
          ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/25`
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      }`}
      style={
        active
          ? {
              background:
                color === "purple"
                  ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                  : color === "blue"
                    ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                    : "linear-gradient(135deg, #F59E0B, #D97706)",
            }
          : undefined
      }
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <Badge
          variant="secondary"
          className={`text-xs ${active ? "bg-white/20 text-white" : ""}`}
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}

function StoreContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "bundles";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 mb-4">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">المتجر</h1>
          <p className="text-muted-foreground">
            باقات الاشتراك والكتب والمكافآت في مكان واحد
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-muted/30 rounded-2xl">
          <TabButton
            active={activeTab === "bundles"}
            onClick={() => setActiveTab("bundles")}
            icon={Package}
            label="باقات الاشتراك"
            badge="💳"
            color="purple"
          />
          <TabButton
            active={activeTab === "books"}
            onClick={() => setActiveTab("books")}
            icon={BookOpen}
            label="الكتب"
            badge="📚"
            color="blue"
          />
          <TabButton
            active={activeTab === "rewards"}
            onClick={() => setActiveTab("rewards")}
            icon={Gift}
            label="المكافآت"
            badge="🎁"
            color="amber"
          />
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "bundles" && <BundlesTab />}
          {activeTab === "books" && <BooksTab />}
          {activeTab === "rewards" && <RewardsTab />}
        </div>
      </div>
    </div>
  );
}

// ==================== BUNDLES TAB ====================
function BundlesTab() {
  const userGrade: GradeLevel = "1";
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutBundle, setCheckoutBundle] = useState<Bundle | null>(null);

  const now = new Date();
  const userBundles: UserBundle[] = [
    {
      id: "ub-1",
      bundleName: "الباقة الشهرية",
      purchasedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      lecturesRemaining: 2,
      totalLectures: 4,
    },
  ];

  const bundles: Bundle[] = [
    {
      id: "bundle-monthly-1",
      name: "الباقة الشهرية",
      type: "monthly",
      lectureCount: 4,
      price: 200,
      originalPrice: 220,
      description: "4 محاضرات لمدة شهر كامل",
      features: [
        "4 محاضرات أسبوعية",
        "3 أرواح لكل محاضرة",
        "7 أيام وصول لكل محاضرة",
        "دعم فني على مدار الساعة",
      ],
      savings: 20,
    },
    {
      id: "bundle-semester-1",
      name: "باقة الفصل الدراسي",
      type: "semester",
      lectureCount: 12,
      price: 700,
      originalPrice: 875,
      description: "12 محاضرة لمدة 3 أشهر",
      features: [
        "12 محاضرة كاملة",
        "3 أرواح لكل محاضرة",
        "7 أيام وصول لكل محاضرة",
        "أولوية في الدعم الفني",
        "خصم 20% على السعر الأصلي",
        "محتوى حصري إضافي",
      ],
      popular: true,
      savings: 175,
    },
  ];

  const getGradeLabel = (grade: GradeLevel) => {
    const labels = { "1": "الأول", "2": "الثاني", "3": "الثالث" };
    return labels[grade];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handlePurchase = (bundleId: string) => {
    const bundle = bundles.find((b) => b.id === bundleId);
    if (bundle) {
      setCheckoutBundle(bundle);
      setShowCheckout(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grade Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">
            الصف {getGradeLabel(userGrade)} الثانوي
          </span>
        </div>
      </div>

      {/* Active Bundles */}
      {userBundles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            باقاتك النشطة
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userBundles.map((bundle) => {
              const usedLectures =
                bundle.totalLectures - bundle.lecturesRemaining;
              const progress = (usedLectures / bundle.totalLectures) * 100;
              const daysLeft = Math.ceil(
                (bundle.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card
                  key={bundle.id}
                  className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold">{bundle.bundleName}</h3>
                        <p className="text-sm text-muted-foreground">
                          تم الشراء: {formatDate(bundle.purchasedAt)}
                        </p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 ms-1" />
                        نشطة
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>المحاضرات المستخدمة</span>
                        <span className="font-bold">
                          {usedLectures} / {bundle.totalLectures}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-4 h-4" />
                          <span>{daysLeft} يوم متبقي</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/ar/lectures">
                      <Button className="w-full mt-4" variant="outline" size="sm">
                        <Video className="w-4 h-4 ms-2" />
                        استبدال محاضرة
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Available Bundles */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          الباقات المتاحة
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => (
            <Card
              key={bundle.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                bundle.popular
                  ? "border-2 border-purple-500 shadow-lg shadow-purple-500/10"
                  : "hover:border-primary/50"
              }`}
            >
              {bundle.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-bold">
                  <Crown className="w-4 h-4 inline-block ms-1" />
                  الأكثر شعبية
                </div>
              )}

              <CardHeader className={bundle.popular ? "pt-12" : ""}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{bundle.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {bundle.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-sm px-2 py-1">
                    {bundle.lectureCount} محاضرة
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {bundle.price}
                  </span>
                  <span className="text-muted-foreground">جنيه</span>
                  {bundle.originalPrice > bundle.price && (
                    <span className="text-muted-foreground line-through text-sm">
                      {bundle.originalPrice} جنيه
                    </span>
                  )}
                  {bundle.savings && (
                    <Badge variant="destructive" className="mr-auto text-xs">
                      وفر {bundle.savings} جنيه
                    </Badge>
                  )}
                </div>

                <ul className="space-y-2">
                  {bundle.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-11 ${
                    bundle.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : ""
                  }`}
                  onClick={() => handlePurchase(bundle.id)}
                >
                  <Gift className="w-4 h-4 ms-2" />
                  شراء الباقة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-blue-800 dark:text-blue-200 text-sm">
                كيف تعمل الباقات؟
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• عند شراء باقة، تحصل على عدد من "فتحات المحاضرات"</li>
                <li>• يمكنك استبدال فتحة بأي محاضرة متاحة في المنهج</li>
                <li>• عند استبدال المحاضرة، تحصل على 7 أيام وصول + 3 أرواح</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal */}
      {checkoutBundle && (
        <BundleCheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setCheckoutBundle(null);
          }}
          onPurchaseComplete={() => {
            setShowCheckout(false);
            setCheckoutBundle(null);
            window.location.href = "/ar/lectures";
          }}
          bundle={{
            ...checkoutBundle,
            type: checkoutBundle.type as "monthly" | "semester" | "yearly",
          }}
        />
      )}
    </div>
  );
}

// ==================== BOOKS TAB ====================
function BooksTab() {
  const { addToCart, addToWishlist, isInWishlist, getCartItemCount } = useStore();
  const { triggerAnimation } = useFlyToCart();
  const [selectedGrade, setSelectedGrade] = useState<"all" | "1" | "2" | "3">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "package" | "textbook" | "workbook">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPackages, setShowPackages] = useState(true);
  const [cartBounce, setCartBounce] = useState(false);

  const filteredBooks = MOCK_BOOKS.filter((book) => {
    const matchesGrade = selectedGrade === "all" || book.grade === selectedGrade;
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    const matchesSearch = book.titleAr.includes(searchQuery) || book.descriptionAr.includes(searchQuery);
    return matchesGrade && matchesCategory && matchesSearch;
  });

  const filteredPackages = MOCK_PACKAGES.filter((pkg) => {
    return selectedGrade === "all" || pkg.grade === selectedGrade;
  });

  const handleAddToCart = (book: Book, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerAnimation(event.currentTarget);
    addToCart(book, 1, "physical");
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Cart Link */}
      <div className="flex justify-end">
        <Link href="/ar/cart">
          <Button size="sm" variant="outline" className="relative cart-button-target">
            <ShoppingCart className="w-4 h-4 ms-2" />
            السلة
            {getCartItemCount() > 0 && (
              <Badge
                className={`absolute -top-2 -right-2 bg-red-500 text-xs ${
                  cartBounce ? "animate-bounce scale-125" : ""
                }`}
              >
                {getCartItemCount()}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن كتاب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-10 h-10"
                />
              </div>
            </div>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as typeof selectedGrade)}
              className="w-full p-2 border rounded-md h-10 text-sm"
            >
              <option value="all">جميع الصفوف</option>
              <option value="1">الصف الأول</option>
              <option value="2">الصف الثاني</option>
              <option value="3">الصف الثالث</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as typeof selectedCategory)}
              className="w-full p-2 border rounded-md h-10 text-sm"
            >
              <option value="all">جميع الأنواع</option>
              <option value="package">باكيدج</option>
              <option value="textbook">كتاب مدرسي</option>
              <option value="workbook">كتاب تمارين</option>
            </select>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant={showPackages ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPackages(true)}
            >
              <Package className="w-4 h-4 ms-1" />
              الباقات
            </Button>
            <Button
              variant={!showPackages ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPackages(false)}
            >
              <BookOpen className="w-4 h-4 ms-1" />
              الكتب الفردية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packages */}
      {showPackages && filteredPackages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">الباقات المميزة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-purple-500 text-xs">باكيدج</Badge>
                    {pkg.bestseller && (
                      <Badge className="bg-yellow-500 text-xs">الأكثر مبيعاً</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{pkg.titleAr}</CardTitle>
                  <p className="text-xs text-muted-foreground">{pkg.descriptionAr}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {pkg.price} جنيه
                        </div>
                        {pkg.originalPrice > pkg.price && (
                          <div className="text-xs text-muted-foreground line-through">
                            {pkg.originalPrice} جنيه
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-green-600 text-xs">
                        وفر {pkg.discount} جنيه
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      يحتوي على {pkg.books.length} كتاب
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        triggerAnimation(e.currentTarget);
                        pkg.books.forEach((book) => addToCart(book, 1, "physical"));
                        setCartBounce(true);
                        setTimeout(() => setCartBounce(false), 600);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 ms-2" />
                      أضف للسلة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Individual Books */}
      {!showPackages && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">الكتب ({filteredBooks.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="text-xs">{book.categoryAr}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${isInWishlist(book.id) ? "text-red-500" : ""}`}
                      onClick={() => addToWishlist(book)}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isInWishlist(book.id) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{book.titleAr}</CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {book.descriptionAr}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{book.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({book.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {book.price} جنيه
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${book.inStock ? "text-green-600" : "text-red-600"}`}
                      >
                        {book.inStock ? "متوفر" : "غير متوفر"}
                      </Badge>
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => handleAddToCart(book, e)}
                      disabled={!book.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 ms-2" />
                      أضف للسلة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredBooks.length === 0 && !showPackages && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">لا توجد كتب</h3>
          <p className="text-sm text-muted-foreground">جرب تغيير الفلاتر</p>
        </div>
      )}
    </div>
  );
}

// ==================== REWARDS TAB ====================
function RewardsTab() {
  const { userStats, gems, purchaseItem, refreshGems } = useGamification();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleBuyNow = async (itemId: string, itemName: string, gemCost?: number) => {
    if (isPurchasing) return;

    if (gemCost && gems < gemCost) {
      toast({
        title: "رصيد غير كافٍ",
        description: `تحتاج ${gemCost} جوهرة. لديك ${gems} فقط.`,
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchaseItem(itemId, 1);
      if (result.success) {
        toast({
          title: "تم الشراء بنجاح! 🎉",
          description: `تم شراء "${itemName}". رصيدك الجديد: ${result.newBalance} جوهرة`,
        });
        await refreshGems();
      } else {
        toast({
          title: "فشل الشراء",
          description: result.error || "حدث خطأ",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الشراء",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const dailyDeals = [
    {
      id: "starter-bundle",
      name: "حزمة البداية",
      description: "3 تجميد سلسلة + 5 تلميحات",
      originalPrice: 220,
      salePrice: 150,
      discount: 32,
      icon: "🎁",
    },
    {
      id: "double-xp-24h",
      name: "مضاعف الخبرة 24 ساعة",
      description: "اكسب ضعف نقاط الخبرة",
      originalPrice: 300,
      salePrice: 200,
      discount: 33,
      icon: "⚡",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Currency Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">5,000</div>
            <div className="text-xs text-white/80">عملة ذهبية</div>
          </div>
          <Coins className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">{gems}</div>
            <div className="text-xs text-white/80">جوهرة</div>
          </div>
          <Gem className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">{userStats.totalXP.toLocaleString()}</div>
            <div className="text-xs text-white/80">XP</div>
          </div>
          <TrendingUp className="w-8 h-8 opacity-80" />
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">{userStats.currentStreak}</div>
            <div className="text-xs text-white/80">أيام متتالية</div>
          </div>
          <Flame className="w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* Daily Deals */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
          <Sparkles className="w-5 h-5" />
          عروض اليوم
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-5 text-white"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge className="bg-white/20 border-0">-{deal.discount}%</Badge>
                <span className="text-3xl">{deal.icon}</span>
              </div>

              <h3 className="text-lg font-bold mb-1">{deal.name}</h3>
              <p className="text-pink-100 text-sm mb-3">{deal.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Gem className="w-4 h-4" />
                  <span>{deal.salePrice}</span>
                </div>
                <div className="flex items-center gap-1 text-pink-200 line-through text-sm">
                  <span>{deal.originalPrice}</span>
                </div>
              </div>

              <Button
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold"
                disabled={isPurchasing || gems < deal.salePrice}
                onClick={() => handleBuyNow(deal.id, deal.name, deal.salePrice)}
              >
                <Gift className="w-4 h-4 ms-2" />
                {gems < deal.salePrice ? "رصيد غير كافٍ" : "شراء الآن"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* All Items */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <ShoppingBag className="w-5 h-5" />
          جميع العناصر
        </h2>
        <div className="border rounded-xl p-4 bg-muted/30">
          <RewardsSystem variant="shop" />
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense for useSearchParams
export default function StoreClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}

