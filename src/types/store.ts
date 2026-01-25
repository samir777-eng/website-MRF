/**
 * Store Types - Books Store System
 * E-commerce types for books, cart, orders, and payments
 */

export interface Book {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  author: string;
  authorAr: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: "EGP" | "USD";
  grade: "1" | "2" | "3";
  subject: string;
  subjectAr: string;
  category: "textbook" | "workbook" | "reference" | "package";
  categoryAr: string;
  coverImage: string;
  images: string[];
  isbn?: string;
  pages?: number;
  publisher?: string;
  publisherAr?: string;
  publishDate?: string;
  edition?: string;
  language: "ar" | "en" | "both";
  format: "physical" | "digital" | "both";
  stock: number;
  inStock: boolean;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  downloads?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  tagsAr: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  format: "physical" | "digital";
  price: number;
  subtotal: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: "EGP" | "USD";
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type:
    | "cash_on_delivery"
    | "fawry"
    | "vodafone_cash"
    | "credit_card"
    | "bank_transfer";
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  enabled: boolean;
  fees?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: "EGP" | "USD";
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  statusAr: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentStatusAr: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookPackage {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  books: Book[];
  price: number;
  originalPrice: number;
  discount: number;
  currency: "EGP" | "USD";
  grade: "1" | "2" | "3";
  coverImage: string;
  featured: boolean;
  bestseller: boolean;
  stock: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}

export interface Wishlist {
  id: string;
  userId: string;
  books: Book[];
  createdAt: string;
  updatedAt: string;
}

// Store State
export interface StoreState {
  books: Book[];
  packages: BookPackage[];
  cart: Cart | null;
  wishlist: Wishlist | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderResponse {
  order: Order;
  message: string;
}

// Filter Types
export interface BookFilters {
  grade?: "1" | "2" | "3";
  subject?: string;
  category?: string;
  format?: "physical" | "digital" | "both";
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "title" | "rating" | "newest";
  page?: number;
  pageSize?: number;
}

// Egyptian Governorates
export const EGYPTIAN_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "الشرقية",
  "أسيوط",
  "سوهاج",
  "قنا",
  "أسوان",
  "الأقصر",
  "البحر الأحمر",
  "كفر الشيخ",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "بورسعيد",
  "دمياط",
  "السويس",
] as const;

export type Governorate = (typeof EGYPTIAN_GOVERNORATES)[number];
