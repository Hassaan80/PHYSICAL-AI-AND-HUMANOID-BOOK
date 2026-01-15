import { SignUpFormData, SignInFormData, TaskFormData } from './types';
import { clsx, type ClassValue } from 'clsx';

// ===== ClassName Utility =====

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ===== Email Validation =====

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Invalid email format';
  }
  return null;
}

// ===== Password Validation =====

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

// ===== Task Validation =====

export function validateTaskTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must be 200 characters or less';
  }
  return null;
}

export function validateTaskDescription(description: string): string | null {
  if (description && description.length > 1000) {
    return 'Description must be 1000 characters or less';
  }
  return null;
}

// ===== Form Validation =====

export function validateSignUpForm(data: SignUpFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
}

export function validateSignInForm(data: SignInFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function validateTaskForm(data: TaskFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleError = validateTaskTitle(data.title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateTaskDescription(data.description);
  if (descriptionError) errors.description = descriptionError;

  return errors;
}

// ===== Date Formatting =====

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ===== Error Handling =====

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  return 'An unexpected error occurred';
}

// ===== String Utilities =====

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
