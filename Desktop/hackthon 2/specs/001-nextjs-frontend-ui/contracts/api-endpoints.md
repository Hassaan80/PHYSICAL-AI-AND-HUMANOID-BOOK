# API Endpoints Contract

**Feature**: 001-nextjs-frontend-ui
**Date**: 2026-01-11
**Phase**: 1 - API Contract Specification

## Overview

This document defines the API contracts that the frontend expects from the backend. These are the endpoints that the API client (`lib/api.ts`) will consume.

**Important**: This is the FRONTEND perspective of API contracts. Backend implementation is handled by the Backend Agent. This document serves as the contract/interface between frontend and backend.

## Base Configuration

**Base URL**: `process.env.NEXT_PUBLIC_API_URL` or `/api` (same origin)

**Authentication**: All endpoints except authentication endpoints require JWT token in header:
```
Authorization: Bearer {jwt_token}
```

**Content Type**: `application/json` for all requests and responses

**Error Response Format**: All endpoints return errors in consistent format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": ["Validation error message"]
    }
  }
}
```

## Authentication Endpoints

### POST /auth/signup

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (201 Created)**:
```json
{
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "createdAt": "2026-01-11T10:00:00Z",
      "updatedAt": "2026-01-11T10:00:00Z"
    },
    "token": "jwt-token-string",
    "expiresAt": "2026-01-12T10:00:00Z"
  },
  "message": "Account created successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid email format or password too weak
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": {
        "email": ["Invalid email format"],
        "password": ["Password must be at least 8 characters"]
      }
    }
  }
  ```
- **409 Conflict**: Email already registered
  ```json
  {
    "error": {
      "code": "CONFLICT",
      "message": "Email already registered"
    }
  }
  ```

**Frontend Handling**:
- On success: Store token, redirect to /dashboard
- On 400: Display field-specific validation errors
- On 409: Display "Email already exists" message with link to sign-in

---

### POST /auth/signin

Authenticate an existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK)**:
```json
{
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "createdAt": "2026-01-11T10:00:00Z",
      "updatedAt": "2026-01-11T10:00:00Z"
    },
    "token": "jwt-token-string",
    "expiresAt": "2026-01-12T10:00:00Z"
  },
  "message": "Signed in successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Missing email or password
- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    }
  }
  ```

**Frontend Handling**:
- On success: Store token, redirect to /dashboard
- On 401: Display "Invalid credentials" error message
- Do NOT specify whether email or password is incorrect (security best practice)

---

### POST /auth/signout

Sign out the current user (invalidate token).

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**: Empty

**Success Response (200 OK)**:
```json
{
  "message": "Signed out successfully"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or expired token

**Frontend Handling**:
- On success OR error: Clear local token, redirect to /signin
- Gracefully handle errors (user may have already been signed out)

---

## Task Endpoints

### GET /tasks

Fetch all tasks for the authenticated user.

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters** (all optional):
- `completed`: Filter by completion status (`true` | `false`)
- `limit`: Number of tasks to return (default: 100, max: 100)
- `offset`: Pagination offset (default: 0)

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "task-uuid-1",
      "userId": "user-uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for the API",
      "completed": false,
      "createdAt": "2026-01-11T09:00:00Z",
      "updatedAt": "2026-01-11T09:00:00Z"
    },
    {
      "id": "task-uuid-2",
      "userId": "user-uuid",
      "title": "Review pull requests",
      "description": "",
      "completed": true,
      "createdAt": "2026-01-10T14:30:00Z",
      "updatedAt": "2026-01-11T08:15:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 100,
    "offset": 0
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Token valid but user not authorized

**Frontend Handling**:
- On success: Render TaskList with tasks
- On empty array: Display EmptyState component
- On 401/403: Redirect to /signin
- Cache response temporarily to avoid refetch on mount

---

### POST /tasks

Create a new task for the authenticated user.

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**:
```json
{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Success Response (201 Created)**:
```json
{
  "data": {
    "id": "new-task-uuid",
    "userId": "user-uuid",
    "title": "New task title",
    "description": "Optional task description",
    "completed": false,
    "createdAt": "2026-01-11T10:30:00Z",
    "updatedAt": "2026-01-11T10:30:00Z"
  },
  "message": "Task created successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Validation error
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": {
        "title": ["Title is required", "Title must be 200 characters or less"]
      }
    }
  }
  ```
- **401 Unauthorized**: Missing or invalid token

**Frontend Handling**:
- On success: Add task to local state, close modal, show toast
- On 400: Display field-specific validation errors in form
- On 401: Redirect to /signin

---

### GET /tasks/:id

Fetch a single task by ID.

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**URL Parameters**:
- `id`: Task UUID

**Success Response (200 OK)**:
```json
{
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "createdAt": "2026-01-11T09:00:00Z",
    "updatedAt": "2026-01-11T09:00:00Z"
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task does not exist
  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "Task not found"
    }
  }
  ```

**Frontend Handling**:
- On success: Display task details
- On 403/404: Display error message, redirect to /dashboard
- On 401: Redirect to /signin

---

### PUT /tasks/:id

Update an existing task (full update).

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**URL Parameters**:
- `id`: Task UUID

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false
}
```

**Success Response (200 OK)**:
```json
{
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": false,
    "createdAt": "2026-01-11T09:00:00Z",
    "updatedAt": "2026-01-11T10:45:00Z"
  },
  "message": "Task updated successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task does not exist

**Frontend Handling**:
- On success: Update task in local state, close modal, show toast
- On 400: Display validation errors
- On 403/404: Display error message
- On 401: Redirect to /signin

---

### PATCH /tasks/:id

Partially update a task (e.g., toggle completion).

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**URL Parameters**:
- `id`: Task UUID

**Request Body** (send only fields to update):
```json
{
  "completed": true
}
```

**Success Response (200 OK)**:
```json
{
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "createdAt": "2026-01-11T09:00:00Z",
    "updatedAt": "2026-01-11T11:00:00Z"
  },
  "message": "Task updated successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task does not exist

**Frontend Handling**:
- On success: Update task in local state with optimistic UI
- Implement optimistic update: Update UI immediately, revert on error
- On error: Revert optimistic update, show error message
- On 401: Redirect to /signin

---

### DELETE /tasks/:id

Delete a task permanently.

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**URL Parameters**:
- `id`: Task UUID

**Success Response (200 OK)**:
```json
{
  "data": {
    "id": "task-uuid"
  },
  "message": "Task deleted successfully"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task does not exist

**Frontend Handling**:
- On success: Remove task from local state, show toast
- On 403/404: Display error message (task may already be deleted)
- On 401: Redirect to /signin

---

## Error Handling Strategy

### Standard HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH, DELETE
- **201 Created**: Successful POST (resource created)
- **400 Bad Request**: Validation error or malformed request
- **401 Unauthorized**: Missing, invalid, or expired token
- **403 Forbidden**: Valid token but insufficient permissions
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource conflict (e.g., duplicate email)
- **500 Internal Server Error**: Server-side error

### Frontend Error Handling Pattern

```typescript
// API client error handler
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();

    // Handle specific status codes
    switch (response.status) {
      case 401:
        // Clear token and redirect to signin
        clearAuth();
        router.push('/signin');
        break;
      case 403:
        // Display "Access denied" message
        showError('You do not have permission to perform this action');
        break;
      case 404:
        // Display "Not found" message
        showError('The requested resource was not found');
        break;
      case 409:
        // Display conflict message
        showError(error.error.message);
        break;
      case 400:
        // Return validation errors to form
        return Promise.reject(error);
      default:
        // Generic error message
        showError('An unexpected error occurred. Please try again.');
    }

    throw error;
  }

  return response.json();
}
```

## Rate Limiting

**Expected Behavior** (backend responsibility):
- Rate limits enforced per user based on JWT
- Response headers should include:
  - `X-RateLimit-Limit`: Max requests per window
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Timestamp when limit resets

**429 Too Many Requests Response**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

**Frontend Handling**:
- Display rate limit error message
- Disable actions temporarily
- Optionally implement automatic retry with exponential backoff

## CORS Configuration

**Expected Backend CORS Headers**:
```
Access-Control-Allow-Origin: {frontend-url}
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Preflight Requests**: Backend must handle OPTIONS requests for CORS preflight.

## API Client Implementation Requirements

The frontend API client (`lib/api.ts`) MUST:

1. **Attach JWT token** to all requests (except auth endpoints)
2. **Handle token expiration** (401 → redirect to signin)
3. **Implement retry logic** for network errors (max 3 retries)
4. **Parse error responses** consistently
5. **Support request/response interceptors**
6. **Provide type-safe methods** for each endpoint
7. **Handle optimistic updates** for toggle operations
8. **Log errors** (frontend logging agent responsibility)

Example API client interface:

```typescript
interface ApiClient {
  // Auth
  signUp(data: SignUpFormData): Promise<AuthResponse>;
  signIn(data: SignInFormData): Promise<AuthResponse>;
  signOut(): Promise<void>;

  // Tasks
  getTasks(filters?: { completed?: boolean }): Promise<Task[]>;
  getTask(id: string): Promise<Task>;
  createTask(data: CreateTaskRequest): Promise<Task>;
  updateTask(id: string, data: UpdateTaskRequest): Promise<Task>;
  toggleTask(id: string, completed: boolean): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
```

## Contract Validation

**Frontend Responsibilities**:
- ✅ Send requests in documented format
- ✅ Handle all documented response codes
- ✅ Validate data before sending (UX validation)
- ✅ Handle network errors gracefully

**Backend Responsibilities** (out of scope):
- ✅ Implement all documented endpoints
- ✅ Return responses in documented format
- ✅ Validate JWT tokens
- ✅ Filter tasks by authenticated userId
- ✅ Return consistent error responses

## Testing Recommendations

**Frontend Contract Tests** (if implemented):
- Mock backend responses using documented contracts
- Test error handling for each status code
- Test request payload formatting
- Test authentication header attachment
- Test pagination and filtering

**Integration Tests**:
- Test full auth flow (signup → signin → signout)
- Test task CRUD operations end-to-end
- Test unauthorized access handling
- Test optimistic UI updates

## Summary

This API contract defines:
- ✅ 8 endpoints (3 auth + 5 task)
- ✅ Request/response formats for all operations
- ✅ Error response structure and codes
- ✅ Authentication requirements
- ✅ Frontend error handling strategy
- ✅ API client implementation requirements

**Next Steps**: Create quickstart.md for developer onboarding.
