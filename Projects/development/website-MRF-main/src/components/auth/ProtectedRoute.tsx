"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireSubscription = false,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Check authentication
    if (requireAuth && !isAuthenticated) {
      // Build login URL with redirect parameter
      const loginUrl = `/ar/auth/login?redirect=${encodeURIComponent(pathname)}&message=${encodeURIComponent('يرجى تسجيل الدخول للوصول إلى هذه الصفحة')}`;
      router.push(loginUrl);
      return;
    }

    // Check subscription
    if (requireSubscription && user?.subscriptionStatus !== 'active') {
      router.push('/ar/subscription');
      return;
    }

    // Check role
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/ar/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requireSubscription, allowedRoles, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">جاري التحميل...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check subscription
  if (requireSubscription && user?.subscriptionStatus !== 'active') {
    return null; // Will redirect in useEffect
  }

  // Check role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

