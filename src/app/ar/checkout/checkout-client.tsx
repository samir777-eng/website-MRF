"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/contexts/StoreContext";
import { PAYMENT_METHODS } from "@/lib/store/mock-books";
import { EGYPTIAN_GOVERNORATES, CheckoutShippingData } from "@/types/store";
import { CheckCircle2, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export default function CheckoutClient() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    checkoutState,
    setCheckoutStep,
    setCheckoutShippingData,
    setCheckoutPayment,
    clearCheckoutState,
  } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Use checkout state from context (persisted in sessionStorage)
  const step = checkoutState?.step || "shipping";
  const shippingData = checkoutState?.shippingData || {
    fullName: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    area: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    notes: "",
  };
  const selectedPayment = checkoutState?.selectedPayment || "cod";

  // Handler for updating shipping data fields
  const handleShippingDataChange = useCallback(
    (field: keyof CheckoutShippingData, value: string) => {
      setCheckoutShippingData({ [field]: value });
    },
    [setCheckoutShippingData]
  );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen page-bg-blue">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
            <p className="text-muted-foreground mb-8">
              لا يمكنك إتمام الطلب بسلة فارغة
            </p>
            <Link
              href="/ar/store?tab=books"
              className="block"
              style={{ minHeight: "44px" }}
            >
              <Button size="lg" className="h-full">
                تصفح الكتب
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen page-bg-blue">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">تم تأكيد طلبك بنجاح!</h2>
            <p className="text-muted-foreground mb-2">
              رقم الطلب: #ORD-{Date.now()}
            </p>
            <p className="text-muted-foreground mb-8">
              سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/ar/store?tab=books"
                className="block"
                style={{ minHeight: "44px" }}
              >
                <Button size="lg" className="h-full">
                  متابعة التسوق
                </Button>
              </Link>
              <Link
                href="/ar/dashboard"
                className="block"
                style={{ minHeight: "44px" }}
              >
                <Button variant="outline" size="lg" className="h-full">
                  لوحة التحكم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // Simulate order placement
    setOrderPlaced(true);
    clearCart();
    // Clear checkout state after successful order
    clearCheckoutState();
  };

  return (
    <div className="min-h-screen page-bg-blue">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">إتمام الطلب</h1>
          <p className="text-muted-foreground">أكمل البيانات لإتمام طلبك</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                1
              </div>
              <span className="font-medium">عنوان الشحن</span>
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div
              className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </div>
              <span className="font-medium">طريقة الدفع</span>
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div
              className={`flex items-center gap-2 ${step === "review" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "review" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                3
              </div>
              <span className="font-medium">مراجعة الطلب</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    عنوان الشحن
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">الاسم الكامل *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          data-testid="fullName"
                          value={shippingData.fullName}
                          onChange={(e) =>
                            handleShippingDataChange("fullName", e.target.value)
                          }
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          data-testid="phone"
                          value={shippingData.phone}
                          onChange={(e) =>
                            handleShippingDataChange("phone", e.target.value)
                          }
                          placeholder="01xxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        data-testid="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          handleShippingDataChange("email", e.target.value)
                        }
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="governorate">المحافظة *</Label>
                        <select
                          id="governorate"
                          value={shippingData.governorate}
                          onChange={(e) =>
                            handleShippingDataChange("governorate", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">اختر المحافظة</option>
                          {EGYPTIAN_GOVERNORATES.map((gov) => (
                            <option key={gov} value={gov}>
                              {gov}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="city">المدينة *</Label>
                        <Input
                          id="city"
                          name="city"
                          data-testid="city"
                          value={shippingData.city}
                          onChange={(e) =>
                            handleShippingDataChange("city", e.target.value)
                          }
                          placeholder="أدخل المدينة"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="area">المنطقة *</Label>
                      <Input
                        id="area"
                        value={shippingData.area}
                        onChange={(e) =>
                          handleShippingDataChange("area", e.target.value)
                        }
                        placeholder="أدخل المنطقة"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="street">الشارع *</Label>
                        <Input
                          id="street"
                          value={shippingData.street}
                          onChange={(e) =>
                            handleShippingDataChange("street", e.target.value)
                          }
                          placeholder="اسم الشارع"
                        />
                      </div>
                      <div>
                        <Label htmlFor="building">رقم العقار *</Label>
                        <Input
                          id="building"
                          value={shippingData.building}
                          onChange={(e) =>
                            handleShippingDataChange("building", e.target.value)
                          }
                          placeholder="رقم العقار"
                        />
                      </div>
                      <div>
                        <Label htmlFor="floor">الدور</Label>
                        <Input
                          id="floor"
                          value={shippingData.floor}
                          onChange={(e) =>
                            handleShippingDataChange("floor", e.target.value)
                          }
                          placeholder="رقم الدور"
                        />
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setCheckoutStep("payment")}
                      data-testid="next-payment"
                      aria-label="التالي: طريقة الدفع"
                    >
                      التالي: طريقة الدفع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="space-y-3"
                    role="radiogroup"
                    aria-label="طرق الدفع المتاحة"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          selectedPayment === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setCheckoutPayment(method.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setCheckoutPayment(method.id);
                          }
                        }}
                        role="radio"
                        aria-checked={selectedPayment === method.id}
                        tabIndex={0}
                        aria-label={`${method.nameAr} - ${method.descriptionAr}${method.fees && method.fees > 0 ? ` (+${method.fees} جنيه)` : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 ${
                                selectedPayment === method.id
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}
                              aria-hidden="true"
                            >
                              {selectedPayment === method.id && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{method.nameAr}</div>
                              <div className="text-sm text-muted-foreground">
                                {method.descriptionAr}
                              </div>
                            </div>
                          </div>
                          {method.fees && method.fees > 0 && (
                            <div className="text-sm text-muted-foreground">
                              +{method.fees} جنيه
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCheckoutStep("shipping")}
                      data-testid="back-shipping"
                      aria-label="السابق"
                    >
                      السابق
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setCheckoutStep("review")}
                      data-testid="next-review"
                      aria-label="التالي: مراجعة الطلب"
                    >
                      التالي: مراجعة الطلب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Order */}
            {step === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>مراجعة الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2">عنوان الشحن</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>{shippingData.fullName}</p>
                      <p>{shippingData.phone}</p>
                      <p>
                        {shippingData.street}, {shippingData.building}
                      </p>
                      <p>
                        {shippingData.area}, {shippingData.city}
                      </p>
                      <p>{shippingData.governorate}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-2">طريقة الدفع</h3>
                    <p className="text-sm text-muted-foreground">
                      {
                        PAYMENT_METHODS.find((m) => m.id === selectedPayment)
                          ?.nameAr
                      }
                    </p>
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      المنتجات ({cart.itemCount})
                    </h3>
                    <div className="space-y-2">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.book.titleAr} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {item.subtotal} جنيه
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCheckoutStep("payment")}
                      data-testid="back-payment"
                      aria-label="السابق"
                    >
                      السابق
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handlePlaceOrder}
                      data-testid="place-order"
                      aria-label="تأكيد الطلب"
                    >
                      تأكيد الطلب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      المجموع الفرعي
                    </span>
                    <span className="font-medium">{cart.subtotal} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-medium">
                      {cart.shipping === 0 ? "مجاني" : `${cart.shipping} جنيه`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary">
                      {cart.total} جنيه
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
