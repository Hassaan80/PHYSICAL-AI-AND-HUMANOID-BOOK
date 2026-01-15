'use client';

import { useState } from 'react';
import { SignInFormData } from '@/lib/types';
import { validateSignInForm } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Link from 'next/link';

export interface SignInFormProps {
  onSubmit: (data: SignInFormData) => Promise<void>;
  isLoading?: boolean;
  apiError?: string | null;
}

export function SignInForm({ onSubmit, isLoading = false, apiError }: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(apiError || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear submit error on input change
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate individual field
    const newErrors = validateSignInForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateSignInForm(formData);
    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // If validation fails, stop
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit(formData);
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Sign in failed. Please try again.';
      setSubmitError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {submitError && (
        <ErrorMessage message={submitError} type="error" dismissible onDismiss={() => setSubmitError(null)} />
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : undefined}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : undefined}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </form>
  );
}
