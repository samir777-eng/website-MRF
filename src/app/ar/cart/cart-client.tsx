"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/contexts/StoreContext";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartClient() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } =
    useStore();
  const [couponCode, setCouponCode] = useState("");

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen page-bg-blue" dir="rtl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
            <p className="text-muted-foreground mb-8">
              لم تقم بإضافة أي كتب للسلة بعد
            </p>
            <Link href="/ar/store?tab=books" className="block">
              <Button size="lg">
                <Package className="w-5 h-5 ms-2" />
                تصفح الكتب
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen page-bg-blue" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            لديك {totalItems} {totalItems === 1 ? "كتاب" : "كتب"} في السلة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {item.book.titleAr?.charAt(0) ||
                            item.book.title?.charAt(0) ||
                            "ك"}
                        </span>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {item.book.titleAr || item.book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.book.authorAr || item.book.author}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                          data-testid="remove-item"
                          aria-label="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateCartItemQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            disabled={item.quantity <= 1}
                            data-testid="update-quantity"
                            aria-label="تحديث الكمية"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            data-testid="update-quantity"
                            aria-label="تحديث الكمية"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-left">
                          <p className="text-2xl font-bold text-primary">
                            {item.price * item.quantity} جنيه
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-muted-foreground">
                              {item.price} جنيه للكتاب
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <Button variant="outline" className="w-full" onClick={clearCart}>
              <Trash2 className="w-4 h-4 ms-2" />
              إفراغ السلة
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      المجموع الفرعي
                    </span>
                    <span className="font-semibold">{totalPrice} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-semibold text-green-600">مجاني</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary">
                      {totalPrice} جنيه
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <label htmlFor="coupon" className="text-sm font-medium">
                    كود الخصم
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      name="coupon"
                      type="text"
                      placeholder="أدخل كود الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                      data-testid="coupon"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Apply coupon logic here
                        console.log("Applying coupon:", couponCode);
                      }}
                      data-testid="apply-coupon"
                      aria-label="تطبيق كوبون"
                    >
                      <Tag className="w-4 h-4 ms-2" />
                      تطبيق
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Link href="/ar/checkout" className="block">
                    <Button
                      className="w-full"
                      size="lg"
                      data-testid="proceed-checkout"
                      aria-label="متابعة للدفع"
                    >
                      متابعة للدفع
                      <ArrowRight className="w-5 h-5 me-2" />
                    </Button>
                  </Link>
                  <Link href="/ar/store?tab=books" className="block">
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid="continue-shopping"
                      aria-label="متابعة التسوق"
                    >
                      متابعة التسوق
                    </Button>
                  </Link>
                </div>

                {/* Benefits */}
                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>شحن مجاني لجميع الطلبات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>إمكانية الإرجاع خلال 14 يوم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>دفع آمن ومضمون</span>
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
