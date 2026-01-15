import { User, Session } from './types';

// ===== Token Management =====

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

export function clearAuth(): void {
  removeStoredToken();
  removeStoredUser();
}

// ===== Session Management =====

export function getSession(): Session | null {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return null;
  }

  // TODO: Parse JWT to get expiration time
  // For now, return a session with far future expiration
  return {
    user,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };
}

export function setSession(user: User, token: string, expiresAt?: string): void {
  setStoredUser(user);
  setStoredToken(token);
}

export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function isSessionValid(): boolean {
  const session = getSession();

  if (!session) {
    return false;
  }

  if (isTokenExpired(session.expiresAt)) {
    clearAuth();
    return false;
  }

  return true;
}

// ===== Route Protection =====

export function requireAuth(callback?: () => void): boolean {
  if (typeof window === 'undefined') return false;

  const isValid = isSessionValid();

  if (!isValid && callback) {
    callback();
  }

  return isValid;
}

export function redirectToSignIn(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
}

export function redirectToDashboard(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
}
