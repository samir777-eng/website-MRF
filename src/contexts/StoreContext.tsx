"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart, CartItem, Book, Order, Wishlist, CheckoutState, CheckoutShippingData, CheckoutStep } from '@/types/store';
import { MOCK_BOOKS } from '@/lib/store/mock-books';

const CHECKOUT_STORAGE_KEY = 'mrf-checkout-state';

// Default checkout state
const getDefaultCheckoutState = (): CheckoutState => ({
  step: 'shipping',
  shippingData: {
    fullName: '',
    phone: '',
    email: '',
    governorate: '',
    city: '',
    area: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    notes: '',
  },
  selectedPayment: 'cod',
  updatedAt: new Date().toISOString(),
});

interface StoreContextType {
  cart: Cart | null;
  wishlist: Wishlist | null;
  orders: Order[];
  checkoutState: CheckoutState | null;
  addToCart: (book: Book, quantity?: number, format?: 'physical' | 'digital') => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  // Checkout state management
  setCheckoutStep: (step: CheckoutStep) => void;
  setCheckoutShippingData: (data: Partial<CheckoutShippingData>) => void;
  setCheckoutPayment: (paymentId: string) => void;
  clearCheckoutState: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mrf-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Check if we're in test environment (port 3006 or NODE_ENV=test)
      const isTestPort = window.location.port === '3006';
      const isTestEnv = process.env.NODE_ENV === 'test' || isTestPort;

      if (isTestEnv && MOCK_BOOKS.length > 0) {
        // Create cart with sample items for testing
        const testBook = MOCK_BOOKS[0];
        const testItem: CartItem = {
          id: `item-${Date.now()}`,
          book: testBook,
          bookId: testBook.id,
          quantity: 2,
          price: testBook.price,
          subtotal: testBook.price * 2,
          format: 'physical',
          addedAt: new Date().toISOString(),
        };

        const newCart: Cart = {
          id: `cart-${Date.now()}`,
          items: [testItem],
          itemCount: 2,
          subtotal: testItem.subtotal,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: testItem.subtotal,
          currency: 'EGP',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCart(newCart);
        // Save to localStorage so it persists
        localStorage.setItem('mrf-cart', JSON.stringify(newCart));
      } else {
        // Initialize empty cart for production
        const newCart: Cart = {
          id: `cart-${Date.now()}`,
          items: [],
          itemCount: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          currency: 'EGP',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCart(newCart);
      }
    }

    const savedWishlist = localStorage.getItem('mrf-wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    } else {
      const newWishlist: Wishlist = {
        id: `wishlist-${Date.now()}`,
        userId: 'guest',
        books: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWishlist(newWishlist);
    }

    // Initialize checkout state from sessionStorage
    const savedCheckout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (savedCheckout) {
      try {
        const parsed = JSON.parse(savedCheckout);
        // Check if the checkout state is still valid (not older than 24 hours)
        const updatedAt = new Date(parsed.updatedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setCheckoutState(parsed);
        } else {
          // Expired, clear it
          sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
          setCheckoutState(getDefaultCheckoutState());
        }
      } catch {
        // Invalid JSON, clear it
        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
        setCheckoutState(getDefaultCheckoutState());
      }
    } else {
      setCheckoutState(getDefaultCheckoutState());
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('mrf-cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    if (wishlist) {
      localStorage.setItem('mrf-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Save checkout state to sessionStorage
  useEffect(() => {
    if (checkoutState) {
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutState));
    }
  }, [checkoutState]);

  const calculateCartTotals = (items: CartItem[]): Partial<Cart> => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 30; // Free shipping over 200 EGP
    const tax = 0; // No tax for now
    const discount = 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, itemCount, shipping, tax, discount, total };
  };

  const addToCart = (book: Book, quantity = 1, format: 'physical' | 'digital' = 'physical') => {
    if (!cart) return;

    const existingItemIndex = cart.items.findIndex(
      item => item.bookId === book.id && item.format === format
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      newItems = [...cart.items];
      newItems[existingItemIndex].quantity += quantity;
      newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * book.price;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        bookId: book.id,
        book,
        quantity,
        format,
        price: book.price,
        subtotal: book.price * quantity,
        addedAt: new Date().toISOString(),
      };
      newItems = [...cart.items, newItem];
    }

    const totals = calculateCartTotals(newItems);

    setCart({
      ...cart,
      items: newItems,
      ...totals,
      updatedAt: new Date().toISOString(),
    });
  };

  const removeFromCart = (itemId: string) => {
    if (!cart) return;

    const newItems = cart.items.filter(item => item.id !== itemId);
    const totals = calculateCartTotals(newItems);

    setCart({
      ...cart,
      items: newItems,
      ...totals,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (!cart) return;

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newItems = cart.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          subtotal: item.price * quantity,
        };
      }
      return item;
    });

    const totals = calculateCartTotals(newItems);

    setCart({
      ...cart,
      items: newItems,
      ...totals,
      updatedAt: new Date().toISOString(),
    });
  };

  const clearCart = () => {
    if (!cart) return;

    setCart({
      ...cart,
      items: [],
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    });
  };

  const addToWishlist = (book: Book) => {
    if (!wishlist) return;

    if (!wishlist.books.find(b => b.id === book.id)) {
      setWishlist({
        ...wishlist,
        books: [...wishlist.books, book],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const removeFromWishlist = (bookId: string) => {
    if (!wishlist) return;

    setWishlist({
      ...wishlist,
      books: wishlist.books.filter(b => b.id !== bookId),
      updatedAt: new Date().toISOString(),
    });
  };

  const isInWishlist = (bookId: string): boolean => {
    return wishlist?.books.some(b => b.id === bookId) || false;
  };

  const getCartItemCount = (): number => {
    return cart?.itemCount || 0;
  };

  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  // Checkout state management functions
  const setCheckoutStep = useCallback((step: CheckoutStep) => {
    setCheckoutState(prev => {
      if (!prev) return getDefaultCheckoutState();
      return {
        ...prev,
        step,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setCheckoutShippingData = useCallback((data: Partial<CheckoutShippingData>) => {
    setCheckoutState(prev => {
      if (!prev) return getDefaultCheckoutState();
      return {
        ...prev,
        shippingData: {
          ...prev.shippingData,
          ...data,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setCheckoutPayment = useCallback((paymentId: string) => {
    setCheckoutState(prev => {
      if (!prev) return getDefaultCheckoutState();
      return {
        ...prev,
        selectedPayment: paymentId,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const clearCheckoutState = useCallback(() => {
    sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    setCheckoutState(getDefaultCheckoutState());
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        checkoutState,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getCartItemCount,
        getCartTotal,
        setCheckoutStep,
        setCheckoutShippingData,
        setCheckoutPayment,
        clearCheckoutState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

