'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, SignUpFormData, SignInFormData } from '@/lib/types';
import { apiClient } from '@/lib/api';
import {
  getSession,
  setSession,
  clearAuth,
  isSessionValid,
  redirectToSignIn,
  redirectToDashboard,
} from '@/lib/auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (data: SignUpFormData) => Promise<void>;
  signIn: (data: SignInFormData) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    setIsLoading(true);
    try {
      if (isSessionValid()) {
        const session = getSession();
        setUser(session?.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.auth.signUp(data);
      const { user: newUser, token, expiresAt } = response.data;

      setSession(newUser, token, expiresAt);
      setUser(newUser);

      // Redirect to dashboard
      redirectToDashboard();
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'Sign up failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.auth.signIn(data);
      const { user: authenticatedUser, token, expiresAt } = response.data;

      setSession(authenticatedUser, token, expiresAt);
      setUser(authenticatedUser);

      // Redirect to dashboard
      redirectToDashboard();
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      // Continue with local cleanup even if API call fails
    } finally {
      clearAuth();
      setUser(null);
      setIsLoading(false);

      // Redirect to sign-in page
      redirectToSignIn();
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    checkAuth,
  };
}
