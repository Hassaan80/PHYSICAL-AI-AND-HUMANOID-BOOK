'use client';

import { useState } from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/hooks/useAuth';
import { SignUpFormData } from '@/lib/types';

export default function SignUpPage() {
  const { signUp, isLoading, error } = useAuth();
  const [apiError, setApiError] = useState<string | null>(error);

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setApiError(null);
      await signUp(data);
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'Sign up failed. Please try again.';
      setApiError(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Create your account
      </h2>
      <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} apiError={apiError} />
    </div>
  );
}
