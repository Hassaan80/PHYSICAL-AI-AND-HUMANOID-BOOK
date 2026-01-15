# Data Model: Professional Frontend (Next.js)

**Feature**: 001-nextjs-frontend-ui
**Date**: 2026-01-11
**Phase**: 1 - Data Model & Type Definitions

## Overview

This document defines the frontend data models, TypeScript interfaces, and type definitions for the Professional Frontend (Next.js) implementation. These types ensure type safety across components, API client, and state management.

**Note**: This is the FRONTEND perspective of data models. Backend implementation and database schema are outside this scope and handled by Backend Agent and Database Agent respectively.

## Core Entities

### User

Represents an authenticated user in the application.

```typescript
interface User {
  id: string;              // Unique identifier (UUID from backend)
  email: string;           // User's email address
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

**Field Descriptions**:
- `id`: Primary identifier, used for task ownership relationships
- `email`: Used for display purposes (e.g., "Welcome, user@example.com")
- `createdAt`: Account creation timestamp (informational)
- `updatedAt`: Last account update timestamp (informational)

**Validation Rules** (frontend UX validation only):
- `email`: Must match email pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Backend performs authoritative validation

**State Locations**:
- Auth context/hook: Current authenticated user
- Sign-in/Sign-up forms: User input during authentication

### Task

Represents a todo item belonging to a user.

```typescript
interface Task {
  id: string;              // Unique identifier (UUID from backend)
  userId: string;          // Foreign key to User.id
  title: string;           // Task title (required)
  description: string;     // Task description (optional)
  completed: boolean;      // Completion status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

**Field Descriptions**:
- `id`: Primary identifier for task operations (edit, delete, toggle)
- `userId`: Ownership identifier (MUST match authenticated user)
- `title`: Short summary of the task (max 200 characters recommended for UI)
- `description`: Detailed notes about the task (max 1000 characters recommended for UI)
- `completed`: Boolean flag for completion status (drives visual styling)
- `createdAt`: Task creation timestamp (for sorting)
- `updatedAt`: Last modification timestamp (for "last updated" display)

**Validation Rules** (frontend UX validation only):
- `title`: Required, min 1 character, max 200 characters
- `description`: Optional, max 1000 characters
- `completed`: Boolean (toggle operation)
- Backend performs authoritative validation

**State Locations**:
- Task list: Array of tasks fetched from API
- Task form: Draft task being created/edited
- Individual task item: Current task being displayed

### Session

Represents the authentication session state.

```typescript
interface Session {
  user: User;              // Authenticated user data
  token: string;           // JWT access token
  expiresAt: string;       // ISO 8601 timestamp
  refreshToken?: string;   // Optional refresh token
}
```

**Field Descriptions**:
- `user`: Full user object for display purposes
- `token`: JWT access token attached to API requests
- `expiresAt`: Token expiration timestamp (for refresh logic)
- `refreshToken`: Optional token for refreshing access token

**Validation Rules**:
- `token`: Must be valid JWT format
- `expiresAt`: Must be future timestamp
- Better Auth manages token lifecycle

**State Locations**:
- Auth context: Global session state
- API client: Token for request headers

## Form Models

### SignUpForm

Input model for user registration.

```typescript
interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required, min 8 characters (recommended)
- `confirmPassword`: Required, must match `password`

**Frontend Validation**:
```typescript
const validateSignUp = (data: SignUpFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Invalid email format';

  if (!data.password) errors.password = 'Password is required';
  else if (data.password.length < 8)
    errors.password = 'Password must be at least 8 characters';

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';

  return errors;
};
```

### SignInForm

Input model for user authentication.

```typescript
interface SignInFormData {
  email: string;
  password: string;
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required

### TaskForm

Input model for task creation and editing.

```typescript
interface TaskFormData {
  title: string;
  description: string;
}
```

**Validation Rules**:
- `title`: Required, min 1 char, max 200 chars
- `description`: Optional, max 1000 chars

**Frontend Validation**:
```typescript
const validateTaskForm = (data: TaskFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) errors.title = 'Title is required';
  else if (data.title.length > 200)
    errors.title = 'Title must be 200 characters or less';

  if (data.description && data.description.length > 1000)
    errors.description = 'Description must be 1000 characters or less';

  return errors;
};
```

## API Response Models

### Success Responses

```typescript
// Generic success response
interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

// Authentication response
interface AuthResponse {
  data: {
    user: User;
    token: string;
    expiresAt: string;
  };
  message: string;
}

// Task list response
interface TaskListResponse {
  data: Task[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Single task response
interface TaskResponse {
  data: Task;
  message?: string;
}

// Delete response
interface DeleteResponse {
  data: { id: string };
  message: string;
}
```

### Error Responses

```typescript
interface ApiErrorResponse {
  error: {
    code: string;           // Error code (e.g., 'INVALID_INPUT', 'UNAUTHORIZED')
    message: string;        // Human-readable error message
    details?: Record<string, string[]>; // Field-specific validation errors
  };
  status: number;          // HTTP status code
}

// Example error response
const exampleError: ApiErrorResponse = {
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: {
      title: ['Title is required', 'Title must be less than 200 characters'],
      email: ['Invalid email format']
    }
  },
  status: 400
};
```

## UI State Models

### LoadingState

Represents async operation loading state.

```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

// Example usage
interface TasksState extends AsyncState<Task[]> {
  data: Task[] | null;
  loading: LoadingState;
  error: string | null;
}
```

### Modal State

Represents modal dialog state.

```typescript
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  data?: Task | null;      // Task being edited/deleted
}
```

### Form State

Represents form input and validation state.

```typescript
interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
```

## Type Utilities

### API Request Types

```typescript
// Create task request
interface CreateTaskRequest {
  title: string;
  description: string;
}

// Update task request
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Partial update (PATCH)
type PartialTaskUpdate = Partial<Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
```

### Type Guards

```typescript
// Check if response is error
function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as any).error === 'object'
  );
}

// Check if user is authenticated
function isAuthenticated(session: Session | null): session is Session {
  return session !== null && !!session.token;
}
```

## Enums and Constants

### HTTP Status Codes

```typescript
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];
```

### Error Codes

```typescript
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
```

### Form Field Names

```typescript
export const FormField = {
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  TITLE: 'title',
  DESCRIPTION: 'description',
} as const;
```

## Data Flow

### Authentication Flow

```
1. User submits sign-in form
   → SignInFormData validated
   → POST /api/auth/signin
   → AuthResponse returned
   → Session stored in auth context
   → JWT token stored (httpOnly cookie or localStorage)
   → Redirect to /dashboard

2. Authenticated requests
   → API client retrieves token from storage
   → Attaches Authorization: Bearer {token}
   → Backend validates token and returns user-specific data
```

### Task CRUD Flow

```
1. Fetch tasks (on dashboard load)
   → GET /api/tasks
   → TaskListResponse returned
   → Tasks stored in component state
   → Render TaskList component

2. Create task
   → User fills TaskForm
   → TaskFormData validated
   → POST /api/tasks with { title, description }
   → TaskResponse returned
   → New task added to tasks array
   → Modal closed, success message shown

3. Update task
   → User edits task in TaskForm
   → TaskFormData validated
   → PUT /api/tasks/:id with { title, description }
   → TaskResponse returned
   → Task updated in tasks array
   → Modal closed, success message shown

4. Toggle task completion
   → User clicks checkbox/button
   → PATCH /api/tasks/:id with { completed: !task.completed }
   → TaskResponse returned
   → Task updated in tasks array with optimistic UI

5. Delete task
   → User clicks delete button
   → Confirmation dialog shown
   → User confirms
   → DELETE /api/tasks/:id
   → DeleteResponse returned
   → Task removed from tasks array
   → Success message shown
```

## Type Safety Guarantees

### Compile-Time Checks

- All API request/response types defined
- Form data types match validation schemas
- Component props strictly typed
- Event handlers type-safe

### Runtime Checks

- API responses validated before use (type guards)
- Form validation before submission
- Token expiration checked before requests
- User authorization verified (userId match)

## Relationships

### User ↔ Task

- **One-to-Many**: One User has many Tasks
- **Ownership**: Task.userId MUST equal authenticated User.id
- **Cascade**: Task fetch filtered by User.id (backend responsibility)
- **Frontend Validation**: All task operations verify userId match

### Session ↔ User

- **One-to-One**: One Session per authenticated User
- **Lifecycle**: Session created on sign-in, cleared on logout
- **Storage**: Managed by Better Auth and auth context

## State Management Locations

### Global State (Auth Context)

- Current authenticated user
- Session token
- Authentication status

### Component State (Local)

- Task list data (TaskList component)
- Form inputs (TaskForm component)
- Modal visibility (Dashboard component)
- Loading states (per component)
- Error messages (per component)

### Server State (Next.js)

- Initial page data (Server Components)
- Route parameters
- Search params

## Type Definition File Structure

Recommended `lib/types.ts` organization:

```typescript
// lib/types.ts

// ===== Core Entities =====
export interface User { /* ... */ }
export interface Task { /* ... */ }
export interface Session { /* ... */ }

// ===== Form Models =====
export interface SignUpFormData { /* ... */ }
export interface SignInFormData { /* ... */ }
export interface TaskFormData { /* ... */ }

// ===== API Models =====
export interface ApiSuccessResponse<T> { /* ... */ }
export interface ApiErrorResponse { /* ... */ }
export interface AuthResponse { /* ... */ }
export interface TaskListResponse { /* ... */ }
export interface TaskResponse { /* ... */ }
export interface DeleteResponse { /* ... */ }

// ===== UI State Models =====
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export interface AsyncState<T> { /* ... */ }
export interface ModalState { /* ... */ }
export interface FormState<T> { /* ... */ }

// ===== Request Types =====
export interface CreateTaskRequest { /* ... */ }
export interface UpdateTaskRequest { /* ... */ }
export type PartialTaskUpdate = /* ... */;

// ===== Type Guards =====
export function isApiError(response: unknown): response is ApiErrorResponse { /* ... */ }
export function isAuthenticated(session: Session | null): session is Session { /* ... */ }

// ===== Constants =====
export const HttpStatus = { /* ... */ } as const;
export const ErrorCode = { /* ... */ } as const;
export const FormField = { /* ... */ } as const;

// ===== Type Exports =====
export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];
export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];
```

## Summary

This data model provides:
- ✅ Type-safe entities and interfaces
- ✅ Clear validation rules for frontend UX
- ✅ API request/response type definitions
- ✅ UI state management types
- ✅ Utility types and type guards
- ✅ Constants for error codes and HTTP status
- ✅ Clear data flow documentation

**Next Steps**: Generate API contracts in `/contracts/` directory based on these type definitions.
