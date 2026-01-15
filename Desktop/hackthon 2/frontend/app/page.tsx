'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirectToDashboard, redirectToSignIn } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user) {
      redirectToDashboard();
    } else {
      redirectToSignIn();
    }
  }, [isAuthenticated, isLoading, user]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // This should not be reached due to redirects
  return null;
}
