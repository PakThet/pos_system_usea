'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/types/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hydrated, checkAuth, isLoading } = useAuthStore();

  // Run checkAuth only once after hydration
  useEffect(() => {
    if (!hydrated) checkAuth();
  }, [checkAuth, hydrated]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (hydrated && !isLoading && !isAuthenticated) {
      router.replace('/login'); // use replace to prevent going back to protected route
    }
  }, [hydrated, isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Hide children if not authenticated
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
