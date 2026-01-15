'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { useAuth } from '@/hooks/useAuth';
import { SignInFormData } from '@/lib/types';

export default function SignInPage() {
  const { signIn, isLoading, error } = useAuth();
  const [apiError, setApiError] = useState<string | null>(error);

  const handleSignIn = async (data: SignInFormData) => {
    try {
      setApiError(null);
      await signIn(data);
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'Sign in failed. Please try again.';
      setApiError(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Welcome back
      </h2>
      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} apiError={apiError} />
    </div>
  );
}
