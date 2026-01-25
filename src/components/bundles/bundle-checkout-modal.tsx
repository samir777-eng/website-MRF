"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  CreditCard,
  Loader2,
  Package,
  Shield,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

export interface BundleData {
  id: string;
  name: string;
  type: "monthly" | "semester" | "yearly";
  lectureCount: number;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  savings?: number;
  popular?: boolean;
}

interface BundleCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (bundleId: string) => void;
  bundle: BundleData;
}

type PaymentMethod = "card" | "wallet" | "fawry";
type CheckoutStep = "payment" | "details" | "confirm" | "success";

export function BundleCheckoutModal({
  isOpen,
  onClose,
  onPurchaseComplete,
  bundle,
}: BundleCheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Card details (mock)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Wallet details (mock)
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isOpen) return null;

  const finalPrice = bundle.price - couponDiscount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "mrf20") {
      setCouponDiscount(bundle.price * 0.2);
      setCouponApplied(true);
    }
  };

  const handleProceedToDetails = () => {
    setStep("details");
  };

  const handleProceedToConfirm = () => {
    setStep("confirm");
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("success");
    setTimeout(() => {
      onPurchaseComplete(bundle.id);
    }, 2000);
  };

  // Success Screen
  if (step === "success") {
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
                تم تفعيل {bundle.name} بنجاح
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {bundle.lectureCount} محاضرة
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                يمكنك الآن استخدام محاضراتك من صفحة المحاضرات
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      dir="rtl"
    >
      <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                إتمام الشراء
              </h2>
              <p className="text-sm text-muted-foreground">{bundle.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {["payment", "details", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s
                      ? "bg-primary text-white"
                      : ["payment", "details", "confirm"].indexOf(step) > i
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["payment", "details", "confirm"].indexOf(step) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded ${["payment", "details", "confirm"].indexOf(step) > i ? "bg-green-500" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Payment Method */}
          {step === "payment" && (
            <div className="space-y-4">
              <h3 className="font-semibold">اختر طريقة الدفع:</h3>
              <div className="grid gap-3">
                {[
                  {
                    id: "card" as const,
                    label: "بطاقة ائتمان",
                    icon: CreditCard,
                    color: "blue",
                  },
                  {
                    id: "wallet" as const,
                    label: "محفظة إلكترونية",
                    icon: Wallet,
                    color: "orange",
                  },
                  {
                    id: "fawry" as const,
                    label: "فوري",
                    icon: Smartphone,
                    color: "yellow",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-${method.color}-100 dark:bg-${method.color}-900/20 flex items-center justify-center`}
                    >
                      <method.icon
                        className={`w-6 h-6 text-${method.color}-600`}
                      />
                    </div>
                    <span className="font-semibold">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="space-y-2">
                <Label>كود الخصم (اختياري)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل كود الخصم"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    {couponApplied ? <Check className="w-4 h-4" /> : "تطبيق"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600">✓ تم تطبيق خصم 20%</p>
                )}
              </div>

              <Button className="w-full" onClick={handleProceedToDetails}>
                متابعة
              </Button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === "details" && (
            <div className="space-y-4">
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-2">
                    <Label>رقم البطاقة</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تاريخ الانتهاء</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              {paymentMethod === "wallet" && (
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}
              {paymentMethod === "fawry" && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl text-center space-y-2">
                  <Smartphone className="w-12 h-12 mx-auto text-yellow-600" />
                  <p className="font-semibold">الدفع عبر فوري</p>
                  <p className="text-sm text-muted-foreground">
                    سيتم إرسال كود الدفع إلى رقمك بعد التأكيد
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("payment")}
                >
                  رجوع
                </Button>
                <Button className="flex-1" onClick={handleProceedToConfirm}>
                  تأكيد ومتابعة
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الباقة:</span>
                  <span className="font-semibold">{bundle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد المحاضرات:</span>
                  <span className="font-semibold">
                    {bundle.lectureCount} محاضرة
                  </span>
                </div>
                {bundle.originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السعر الأصلي:</span>
                    <span className="line-through text-muted-foreground">
                      {bundle.originalPrice} ج.م
                    </span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>خصم الكوبون:</span>
                    <span>-{couponDiscount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>المجموع:</span>
                  <span className="text-primary">{finalPrice} ج.م</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>دفع آمن ومشفر 100%</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("details")}
                >
                  رجوع
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                  onClick={handleConfirmPurchase}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    "تأكيد الشراء"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
