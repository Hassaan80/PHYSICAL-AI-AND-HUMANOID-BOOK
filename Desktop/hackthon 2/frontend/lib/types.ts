// ===== Core Entities =====

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

// ===== Form Models =====

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description: string;
}

// ===== API Models =====

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  status: number;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
    expiresAt: string;
  };
  message: string;
}

export interface TaskListResponse {
  data: Task[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface TaskResponse {
  data: Task;
  message?: string;
}

export interface DeleteResponse {
  data: { id: string };
  message: string;
}

// ===== UI State Models =====

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  data?: Task | null;
}

export interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ===== Request Types =====

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export type PartialTaskUpdate = Partial<Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

// ===== Type Guards =====

export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as any).error === 'object'
  );
}

export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && !!session.token;
}

// ===== Constants =====

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

export const FormField = {
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  TITLE: 'title',
  DESCRIPTION: 'description',
} as const;
