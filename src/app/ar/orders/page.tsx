"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Receipt,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-12-05",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "الدفع عند الاستلام",
    items: [
      { id: "1", title: "كتاب النحو الواضح", quantity: 1, price: 150 },
      { id: "2", title: "كتاب البلاغة", quantity: 2, price: 120 },
    ],
    subtotal: 390,
    shipping: 0,
    total: 390,
    address: "القاهرة، مدينة نصر، شارع مصطفى النحاس",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-12-08",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "فودافون كاش",
    items: [{ id: "3", title: "كتاب القصة", quantity: 1, price: 100 }],
    subtotal: 100,
    shipping: 25,
    total: 125,
    address: "الإسكندرية، سموحة، شارع فوزي معاذ",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-12-10",
    status: "processing",
    paymentStatus: "pending",
    paymentMethod: "تحويل بنكي",
    items: [
      { id: "4", title: "باقة الصف الثالث الثانوي", quantity: 1, price: 500 },
    ],
    subtotal: 500,
    shipping: 0,
    total: 500,
    address: "الجيزة، الدقي، شارع التحرير",
  },
];

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  pending: {
    label: "قيد الانتظار",
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-600",
  },
  processing: {
    label: "جاري التجهيز",
    icon: Package,
    color: "bg-blue-500/10 text-blue-600",
  },
  shipped: {
    label: "تم الشحن",
    icon: Truck,
    color: "bg-purple-500/10 text-purple-600",
  },
  delivered: {
    label: "تم التوصيل",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-600",
  },
  cancelled: {
    label: "ملغي",
    icon: XCircle,
    color: "bg-red-500/10 text-red-600",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "في انتظار الدفع",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  paid: { label: "مدفوع", color: "bg-green-500/10 text-green-600" },
  failed: { label: "فشل الدفع", color: "bg-red-500/10 text-red-600" },
  refunded: { label: "مسترد", color: "bg-gray-500/10 text-gray-600" },
};

export default function OrdersPage() {
  const totalSpent = MOCK_ORDERS.filter(
    (o) => o.paymentStatus === "paid"
  ).reduce((sum, o) => sum + o.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const deliveredOrders = MOCK_ORDERS.filter(
    (o) => o.status === "delivered"
  ).length;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">سجل الطلبات</h1>
          <p className="text-muted-foreground">تتبع طلباتك وسجل المدفوعات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">
                إجمالي الطلبات
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{deliveredOrders}</div>
              <div className="text-sm text-muted-foreground">تم التوصيل</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalSpent} ج.م</div>
              <div className="text-sm text-muted-foreground">
                إجمالي المدفوعات
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">طلباتك</h2>
          {MOCK_ORDERS.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground mb-6">
                  لم تقم بأي طلبات بعد
                </p>
                <Link href="/ar/store?tab=books">
                  <Button>تصفح الكتب</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            MOCK_ORDERS.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              const paymentInfo = paymentStatusConfig[order.paymentStatus];

              return (
                <Card
                  key={order.id}
                  className="border-0 shadow-lg overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {order.orderNumber}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                        <Badge className={paymentInfo.color}>
                          {paymentInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.title} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {item.price * item.quantity} ج.م
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">طريقة الدفع:</span>{" "}
                          {order.paymentMethod}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {order.total} ج.م
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium">العنوان:</span>{" "}
                        {order.address}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
