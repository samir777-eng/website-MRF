"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_SETTINGS } from "@/lib/lives-system";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Banknote,
  CheckCircle,
  Coins,
  Heart,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

type PaymentMethod = "coins" | "money";

interface PurchaseLifeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lectureTitle: string;
  userCoins: number;
  lifeExtensionDays?: number;
  lifePriceCoins?: number;
  lifePriceMoney?: number;
  onPurchase: (
    method: PaymentMethod
  ) => Promise<{ success: boolean; message: string }>;
}

export function PurchaseLifeModal({
  open,
  onOpenChange,
  lectureTitle,
  userCoins,
  lifeExtensionDays = DEFAULT_SETTINGS.default_life_extension_days,
  lifePriceCoins = DEFAULT_SETTINGS.life_price_coins,
  lifePriceMoney = DEFAULT_SETTINGS.life_price_money,
  onPurchase,
}: PurchaseLifeModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const canAffordCoins = userCoins >= lifePriceCoins;

  const handlePurchase = async () => {
    if (!selectedMethod) return;

    setIsPurchasing(true);
    setResult(null);

    try {
      const purchaseResult = await onPurchase(selectedMethod);
      setResult(purchaseResult);

      if (purchaseResult.success) {
        // Close after short delay on success
        setTimeout(() => {
          onOpenChange(false);
          setResult(null);
          setSelectedMethod(null);
        }, 1500);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClose = () => {
    if (!isPurchasing) {
      onOpenChange(false);
      setResult(null);
      setSelectedMethod(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            شراء حياة
          </DialogTitle>
          <DialogDescription>{lectureTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefit info */}
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <p className="text-sm">
                <span className="font-medium">+{lifeExtensionDays} أيام</span>
                <span className="text-muted-foreground"> إضافية للوصول</span>
              </p>
            </div>
          </div>

          {/* Payment options */}
          <div className="space-y-2">
            <p className="text-sm font-medium">اختر طريقة الدفع</p>

            {/* Coins option */}
            <button
              onClick={() => setSelectedMethod("coins")}
              disabled={!canAffordCoins}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-start",
                selectedMethod === "coins"
                  ? "border-amber-500 bg-amber-500/10"
                  : canAffordCoins
                    ? "border-border hover:border-amber-500/50"
                    : "border-border opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lifePriceCoins} عملة</p>
                  <p className="text-xs text-muted-foreground">
                    رصيدك: {userCoins} عملة
                    {!canAffordCoins && " (غير كافي)"}
                  </p>
                </div>
                {selectedMethod === "coins" && (
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </button>

            {/* Money option */}
            <button
              onClick={() => setSelectedMethod("money")}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-start",
                selectedMethod === "money"
                  ? "border-green-500 bg-green-500/10"
                  : "border-border hover:border-green-500/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lifePriceMoney} جنيه</p>
                  <p className="text-xs text-muted-foreground">
                    الدفع الإلكتروني
                  </p>
                </div>
                {selectedMethod === "money" && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Result message */}
        {result && (
          <div
            className={cn(
              "p-3 rounded-lg flex items-center gap-2",
              result.success
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {result.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <DialogFooter className="flex-row-reverse gap-2">
          <Button
            onClick={handlePurchase}
            disabled={!selectedMethod || isPurchasing}
            className="flex-1 sm:flex-none"
          >
            {isPurchasing ? "جاري الشراء..." : "تأكيد الشراء"}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPurchasing}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
