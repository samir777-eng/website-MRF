"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Check,
  Coins,
  CreditCard,
  Heart,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

interface LivesPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (livesAdded: number) => void;
  lectureId: string;
  currentLives: number;
  maxLives: number;
  userCoins?: number;
}

interface LivesPackage {
  id: string;
  lives: number;
  coinsPrice: number;
  moneyPrice: number;
  popular?: boolean;
  discount?: number;
}

const livesPackages: LivesPackage[] = [
  { id: "life-1", lives: 1, coinsPrice: 50, moneyPrice: 10 },
  {
    id: "life-3",
    lives: 3,
    coinsPrice: 120,
    moneyPrice: 25,
    popular: true,
    discount: 20,
  },
  { id: "life-5", lives: 5, coinsPrice: 175, moneyPrice: 35, discount: 30 },
];

export function LivesPurchaseModal({
  isOpen,
  onClose,
  onPurchaseComplete,
  currentLives,
  maxLives,
  userCoins = 150,
}: LivesPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    "life-3"
  );
  const [paymentMethod, setPaymentMethod] = useState<"coins" | "money">(
    "coins"
  );
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsPurchasing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const pkg = livesPackages.find((p) => p.id === selectedPackage);
    if (pkg) {
      setPurchaseSuccess(true);
      setTimeout(() => {
        onPurchaseComplete(pkg.lives);
      }, 1500);
    }
  };

  const selectedPkg = livesPackages.find((p) => p.id === selectedPackage);
  const canAffordCoins = selectedPkg
    ? userCoins >= selectedPkg.coinsPrice
    : false;

  if (purchaseSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <Card className="max-w-md w-full animate-in zoom-in-95">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">
                تم الشراء بنجاح!
              </h2>
              <p className="text-muted-foreground">
                تمت إضافة {selectedPkg?.lives} أرواح إلى حسابك
              </p>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(currentLives + (selectedPkg?.lives || 0))].map(
                (_, i) => (
                  <Heart
                    key={i}
                    className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse"
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
     
    >
      <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                شراء أرواح
              </h2>
              <p className="text-muted-foreground text-sm">
                اشترِ أرواح إضافية لمشاهدة الفيديوهات مرة أخرى
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="إغلاق">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Current Lives */}
          <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl">
            <span className="text-sm text-muted-foreground">
              أرواحك الحالية:
            </span>
            {[...Array(maxLives)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < currentLives
                    ? "text-rose-500 fill-rose-500"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Lives Packages */}
          <div className="space-y-3">
            <h3 className="font-semibold">اختر باقة الأرواح:</h3>
            <div className="grid gap-3">
              {livesPackages.map((pkg) => (
                <button
                  type="button"
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-end ${
                    selectedPackage === pkg.id
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/10"
                      : "border-border hover:border-rose-300"
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 start-4 bg-gradient-to-r from-purple-600 to-pink-600">
                      <Sparkles className="w-3 h-3 ms-1" />
                      الأكثر شعبية
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(pkg.lives)].map((_, i) => (
                          <Heart
                            key={i}
                            className="w-5 h-5 text-rose-500 fill-rose-500"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">{pkg.lives} روح</span>
                    </div>
                    <div className="text-start">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">{pkg.coinsPrice}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        أو {pkg.moneyPrice} ج.م
                      </div>
                    </div>
                  </div>
                  {pkg.discount && (
                    <Badge
                      variant="secondary"
                      className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/20"
                    >
                      وفر {pkg.discount}%
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="font-semibold">طريقة الدفع:</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("coins")}
                disabled={!canAffordCoins}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "coins"
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                    : "border-border hover:border-yellow-300"
                } ${!canAffordCoins ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Coins className="w-8 h-8 text-yellow-500" />
                  <span className="font-semibold">عملات</span>
                  <span className="text-sm text-muted-foreground">
                    لديك {userCoins}
                  </span>
                </div>
                {!canAffordCoins && (
                  <span className="text-xs text-red-500 mt-1">
                    رصيد غير كافي
                  </span>
                )}
              </button>
              <button
                onClick={() => setPaymentMethod("money")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "money"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                    : "border-border hover:border-green-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="w-8 h-8 text-green-600" />
                  <span className="font-semibold">بطاقة / محفظة</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedPkg?.moneyPrice || 0} ج.م
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              الأرواح المشتراة صالحة لهذه المحاضرة فقط ولا يمكن استردادها
            </p>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full h-14 text-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            onClick={handlePurchase}
            disabled={!selectedPackage || isPurchasing}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-5 h-5 ms-2 animate-spin" />
                جاري الشراء...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 ms-2" />
                شراء {selectedPkg?.lives || 0} أرواح
                {paymentMethod === "coins"
                  ? ` بـ ${selectedPkg?.coinsPrice || 0} عملة`
                  : ` بـ ${selectedPkg?.moneyPrice || 0} ج.م`}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
