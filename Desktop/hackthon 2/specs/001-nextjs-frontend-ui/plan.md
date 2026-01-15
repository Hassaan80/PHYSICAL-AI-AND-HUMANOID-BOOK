# Implementation Plan: Next.js Frontend UI

**Branch**: `001-nextjs-frontend-ui` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nextjs-frontend-ui/spec.md`

## Summary

Implement a professional, polished Next.js frontend for the Phase II Full-Stack Todo Application. This frontend provides complete user authentication flows, task CRUD operations, and responsive UI design. The implementation uses Next.js App Router, Tailwind CSS, and Better Auth integration, consuming backend APIs exclusively through a type-safe API client.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**: Next.js, React 18+, Tailwind CSS, Better Auth (client), TypeScript
**Storage**: Browser localStorage for JWT tokens; all data fetched from backend API
**Testing**: Jest + React Testing Library for component tests; Playwright for E2E tests
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions); responsive for 320px-2560px
**Project Type**: Web frontend (SPA with SSR capabilities via Next.js)
**Performance Goals**: Task list loads <2s; operations provide feedback <1s; smooth 60fps interactions
**Constraints**: <200ms p95 for route transitions; App Router only (no Pages Router); no direct DB access
**Scale/Scope**: 5 pages, 15+ components, 100 tasks per user display capability

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Spec-First, Code-Second**: Implementation strictly follows `/specs/001-nextjs-frontend-ui/spec.md`
✅ **Agent Responsibility**: Frontend agent ONLY implements UI and API consumption; does NOT modify backend, database, or authentication logic
✅ **User-Centric Security**: JWT tokens attached to all API requests; user data isolation enforced by backend
✅ **Stateless Authentication**: Frontend stores JWT and attaches to requests via Authorization header
✅ **Separation of Layers**: Frontend consumes APIs via API client library; no direct database access
✅ **Test-First Discipline**: Component tests written for all UI components; E2E tests for critical flows

## Project Structure

### Documentation (this feature)

```text
specs/001-nextjs-frontend-ui/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0: Research findings (to be created)
├── data-model.md        # Phase 1: Frontend data types (to be created)
├── quickstart.md        # Phase 1: Developer setup guide (to be created)
├── contracts/           # Phase 1: API contract documentation (to be created)
└── tasks.md             # Phase 2: Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx           # Auth layout (server component)
│   │   ├── signin/
│   │   │   └── page.tsx         # Sign-in page (client component)
│   │   └── signup/
│   │       └── page.tsx         # Sign-up page (client component)
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout with header (server component)
│   │   └── page.tsx             # Task dashboard (client component)
│   ├── layout.tsx               # Root layout (server component)
│   ├── page.tsx                 # Home/landing (redirects based on auth state)
│   └── globals.css              # Tailwind CSS imports and global styles
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx       # Sign-in form with validation (client)
│   │   └── SignUpForm.tsx       # Sign-up form with validation (client)
│   ├── tasks/
│   │   ├── TaskList.tsx         # Task list container (client)
│   │   ├── TaskItem.tsx         # Individual task card (client)
│   │   ├── TaskForm.tsx         # Create/edit task form (client)
│   │   ├── DeleteConfirmDialog.tsx  # Deletion confirmation modal (client)
│   │   └── TaskToggle.tsx       # Checkbox for completion toggle (client)
│   ├── ui/
│   │   ├── Button.tsx           # Reusable button component
│   │   ├── Input.tsx            # Reusable text input component
│   │   ├── Textarea.tsx         # Reusable textarea component
│   │   ├── Modal.tsx            # Reusable modal/dialog component
│   │   ├── LoadingSpinner.tsx   # Loading indicator
│   │   └── ErrorMessage.tsx     # Error display component
│   └── layout/
│       ├── Header.tsx           # App header with user info and logout (client)
│       ├── EmptyState.tsx       # Empty state message component
│       └── Container.tsx        # Responsive container wrapper
├── lib/
│   ├── api.ts                   # API client with JWT handling and error management
│   ├── auth.ts                  # Better Auth client integration utilities
│   ├── types.ts                 # TypeScript interfaces (Task, User, ApiResponse, etc.)
│   └── utils.ts                 # Utility functions (validation, formatting)
├── hooks/
│   ├── useTasks.ts              # Custom hook for task CRUD operations
│   ├── useAuth.ts               # Custom hook for authentication state
│   └── useLocalStorage.ts       # Custom hook for JWT token storage
├── public/
│   └── [static assets]          # Images, icons, fonts if needed
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

**Structure Decision**: This is a web application frontend using Next.js App Router. The structure follows Next.js conventions with route-based file organization in `app/` and feature-based component organization in `components/`. All authentication-related routes are grouped under `(auth)` route group for shared layout. The `lib/` directory contains business logic and API integration, while `hooks/` provides reusable state management patterns.

## Complexity Tracking

No constitution violations. The implementation follows all principles:
- Frontend only (no backend or database modification)
- Spec-driven development
- Clear separation of concerns
- JWT-based stateless authentication

---

## Phase 0: Research & Design Decisions

### Research Areas

1. **Next.js App Router Best Practices**
   - Server vs. Client component strategy
   - Route groups for authentication layouts
   - Loading and error boundary patterns
   - Metadata and SEO configuration

2. **Better Auth Frontend Integration**
   - JWT token storage strategy (localStorage vs. cookies)
   - Token refresh mechanism
   - Session management and expiration handling
   - Client-side auth state management

3. **API Client Architecture**
   - Axios vs. fetch API for HTTP requests
   - Request/response interceptors for JWT attachment
   - Error handling and retry strategies
   - Type-safe request/response patterns with TypeScript

4. **Tailwind CSS Design System**
   - Component styling patterns
   - Responsive design breakpoints
   - Accessibility considerations (focus states, ARIA)
   - Dark mode preparation (future consideration)

5. **State Management Strategy**
   - React hooks vs. external state library
   - Optimistic UI updates for task operations
   - Cache invalidation and data refetching
   - Local state vs. API state synchronization

### Design Decisions (to be documented in research.md)

- **Token Storage**: Use localStorage for simplicity (httpOnly cookies are backend concern)
- **API Client**: Use fetch API with custom wrapper for type safety and interceptors
- **State Management**: Use React hooks (useState, useEffect, custom hooks) without external library
- **Form Validation**: Client-side validation with HTML5 + custom logic; server validation is authoritative
- **Loading Pattern**: Suspense boundaries for pages, inline spinners for operations
- **Error Handling**: Toast notifications for operations, inline messages for forms

---

## Phase 1: Implementation Steps

### Step 1: Project Setup and Configuration

**Objective**: Initialize Next.js project with TypeScript, Tailwind CSS, and necessary dependencies.

**Files/Folders**:
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/next.config.js`
- `frontend/tailwind.config.ts`
- `frontend/app/globals.css`

**Dependencies**: None (initial setup)

**Expected Outcome**:
- Working Next.js development environment
- `npm run dev` starts the application
- Tailwind CSS properly configured and applied
- TypeScript strict mode enabled

---

### Step 2: Define TypeScript Interfaces and Types

**Objective**: Create type-safe interfaces for all data structures used in the frontend.

**Files/Folders**:
- `frontend/lib/types.ts`

**Dependencies**: Step 1 (project setup)

**Expected Outcome**:
- `User` interface (id, email, createdAt)
- `Task` interface (id, userId, title, description, completed, createdAt, updatedAt)
- `ApiResponse<T>` generic type for API responses
- `AuthTokens` interface for JWT storage
- `ValidationError` type for form errors

---

### Step 3: Implement API Client Library

**Objective**: Create a centralized API client that handles all HTTP requests, JWT attachment, and error handling.

**Files/Folders**:
- `frontend/lib/api.ts`
- `frontend/lib/utils.ts`

**Dependencies**: Step 2 (types defined)

**Expected Outcome**:
- `apiClient` object with methods for GET, POST, PUT, DELETE
- Automatic JWT token attachment from localStorage
- Interceptors for handling 401 (redirect to signin) and 500 errors
- Type-safe request/response handling
- Error normalization for consistent error display

---

### Step 4: Implement Better Auth Integration

**Objective**: Create utilities for Better Auth client-side integration, token management, and auth state.

**Files/Folders**:
- `frontend/lib/auth.ts`
- `frontend/hooks/useAuth.ts`
- `frontend/hooks/useLocalStorage.ts`

**Dependencies**: Step 3 (API client ready)

**Expected Outcome**:
- `useAuth` hook providing: `user`, `login()`, `logout()`, `signup()`, `isAuthenticated`
- Token storage/retrieval from localStorage
- Automatic token cleanup on logout
- Session validation on app load

---

### Step 5: Build Reusable UI Components

**Objective**: Create foundational UI primitives used throughout the application.

**Files/Folders**:
- `frontend/components/ui/Button.tsx`
- `frontend/components/ui/Input.tsx`
- `frontend/components/ui/Textarea.tsx`
- `frontend/components/ui/Modal.tsx`
- `frontend/components/ui/LoadingSpinner.tsx`
- `frontend/components/ui/ErrorMessage.tsx`

**Dependencies**: Step 1 (Tailwind configured)

**Expected Outcome**:
- Accessible, styled button component with variants (primary, secondary, destructive)
- Form input components with label, error state, and validation display
- Modal component with overlay, focus trap, and ESC key handling
- Loading spinner with size variants
- Error message component with icon and styling

---

### Step 6: Build Layout Components

**Objective**: Create shared layout components for consistent structure across pages.

**Files/Folders**:
- `frontend/components/layout/Header.tsx`
- `frontend/components/layout/EmptyState.tsx`
- `frontend/components/layout/Container.tsx`

**Dependencies**: Step 5 (UI components ready)

**Expected Outcome**:
- Header component with app title, user email, and logout button
- EmptyState component for "no tasks" message
- Container component for responsive max-width and padding

---

### Step 7: Implement Root Layout and Landing Page

**Objective**: Set up the root application layout and landing page with authentication-based routing.

**Files/Folders**:
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx`

**Dependencies**: Step 4 (auth utilities), Step 6 (layout components)

**Expected Outcome**:
- Root layout with HTML structure, metadata, and global styles
- Landing page that redirects authenticated users to `/dashboard` and others to `/signin`
- Proper Next.js metadata for SEO

---

### Step 8: Build Authentication Forms

**Objective**: Create sign-up and sign-in forms with validation and error handling.

**Files/Folders**:
- `frontend/components/auth/SignUpForm.tsx`
- `frontend/components/auth/SignInForm.tsx`

**Dependencies**: Step 4 (auth hooks), Step 5 (UI components)

**Expected Outcome**:
- SignUpForm with email and password fields, validation, and submission
- SignInForm with email and password fields, validation, and submission
- Client-side validation (email format, password length)
- Loading states during API calls
- Error display for failed authentication

---

### Step 9: Build Authentication Pages

**Objective**: Create sign-up and sign-in pages using authentication forms.

**Files/Folders**:
- `frontend/app/(auth)/layout.tsx`
- `frontend/app/(auth)/signin/page.tsx`
- `frontend/app/(auth)/signup/page.tsx`

**Dependencies**: Step 8 (auth forms ready)

**Expected Outcome**:
- Auth layout with centered form container
- Sign-in page with SignInForm and link to sign-up
- Sign-up page with SignUpForm and link to sign-in
- Responsive design for all screen sizes

---

### Step 10: Implement Task CRUD Hook

**Objective**: Create a custom React hook that encapsulates all task-related API operations.

**Files/Folders**:
- `frontend/hooks/useTasks.ts`

**Dependencies**: Step 3 (API client)

**Expected Outcome**:
- `useTasks` hook providing: `tasks`, `loading`, `error`, `createTask()`, `updateTask()`, `deleteTask()`, `toggleTask()`, `refetchTasks()`
- Automatic task list fetching on hook initialization
- Optimistic UI updates for toggle operations
- Error handling and retry capability

---

### Step 11: Build Task Components

**Objective**: Create all task-related UI components for display, creation, editing, and deletion.

**Files/Folders**:
- `frontend/components/tasks/TaskItem.tsx`
- `frontend/components/tasks/TaskToggle.tsx`
- `frontend/components/tasks/TaskForm.tsx`
- `frontend/components/tasks/DeleteConfirmDialog.tsx`

**Dependencies**: Step 5 (UI components), Step 10 (task hook)

**Expected Outcome**:
- TaskItem displays task title, description, completion status, edit/delete buttons
- TaskToggle provides checkbox for completion status
- TaskForm handles both create and edit modes with validation
- DeleteConfirmDialog shows confirmation modal before deletion

---

### Step 12: Build Task List Component

**Objective**: Create the main task list component that displays all tasks and handles empty states.

**Files/Folders**:
- `frontend/components/tasks/TaskList.tsx`

**Dependencies**: Step 11 (task components), Step 6 (EmptyState)

**Expected Outcome**:
- TaskList renders all tasks using TaskItem
- Shows EmptyState when no tasks exist
- Shows LoadingSpinner while tasks are loading
- Responsive grid/list layout

---

### Step 13: Build Dashboard Page

**Objective**: Create the main dashboard page where users view and manage their tasks.

**Files/Folders**:
- `frontend/app/dashboard/layout.tsx`
- `frontend/app/dashboard/page.tsx`

**Dependencies**: Step 12 (TaskList), Step 6 (Header)

**Expected Outcome**:
- Dashboard layout with Header component
- Dashboard page with "Add Task" button and TaskList
- Modal for creating new tasks
- Protected route (redirects to signin if not authenticated)

---

### Step 14: Implement Authentication Middleware/Guards

**Objective**: Protect dashboard and other authenticated routes from unauthenticated access.

**Files/Folders**:
- `frontend/app/dashboard/page.tsx` (add auth check)
- `frontend/lib/auth.ts` (add route protection utility)

**Dependencies**: Step 4 (auth utilities), Step 13 (dashboard)

**Expected Outcome**:
- Authenticated routes check for valid JWT on load
- Unauthenticated users redirected to `/signin`
- Authenticated users on auth pages redirected to `/dashboard`

---

### Step 15: Implement Responsive Design and Accessibility

**Objective**: Ensure all components are fully responsive and meet accessibility standards.

**Files/Folders**:
- All component files (review and enhance)
- `frontend/tailwind.config.ts` (custom breakpoints if needed)

**Dependencies**: All previous steps

**Expected Outcome**:
- All layouts work seamlessly on 320px, 768px, 1024px, 1440px, 2560px viewports
- All interactive elements keyboard accessible (Tab, Enter, Esc)
- Proper ARIA labels on form inputs, buttons, and modals
- Focus indicators visible and clear
- Color contrast meets WCAG 2.1 Level AA

---

### Step 16: Implement Loading and Error States

**Objective**: Add comprehensive loading indicators and error handling throughout the application.

**Files/Folders**:
- All page and component files (add loading/error states)
- `frontend/app/error.tsx` (global error boundary)
- `frontend/app/loading.tsx` (global loading state)

**Dependencies**: Step 5 (LoadingSpinner, ErrorMessage)

**Expected Outcome**:
- Loading states displayed during all API operations
- Error boundaries catch and display component errors
- Failed operations show retry buttons
- Network errors show user-friendly messages

---

### Step 17: Add Form Validation and User Feedback

**Objective**: Implement client-side validation and provide clear feedback for all user actions.

**Files/Folders**:
- `frontend/lib/utils.ts` (validation functions)
- All form components (add validation logic)

**Dependencies**: Step 8 (auth forms), Step 11 (task forms)

**Expected Outcome**:
- Email validation for auth forms
- Password strength requirements displayed
- Task title required validation
- Real-time validation feedback as user types
- Success messages after successful operations

---

### Step 18: Optimize Performance and Bundle Size

**Objective**: Ensure fast load times and optimal performance.

**Files/Folders**:
- `frontend/next.config.js` (optimization settings)
- Component files (add dynamic imports where appropriate)

**Dependencies**: All previous steps

**Expected Outcome**:
- Code splitting for routes
- Dynamic imports for modals and heavy components
- Image optimization if images added later
- Tree-shaking for unused code
- Bundle size analysis shows no unnecessary dependencies

---

### Step 19: Write Component Tests

**Objective**: Create unit tests for all components and hooks.

**Files/Folders**:
- `frontend/__tests__/components/` (all component tests)
- `frontend/__tests__/hooks/` (all hook tests)
- `frontend/__tests__/lib/` (API client tests)

**Dependencies**: All implementation steps

**Expected Outcome**:
- 80%+ code coverage
- Tests for all user interactions
- Tests for error states
- Tests for loading states
- Mocked API calls for isolation

---

### Step 20: Write End-to-End Tests

**Objective**: Create E2E tests for critical user flows.

**Files/Folders**:
- `frontend/e2e/auth.spec.ts`
- `frontend/e2e/tasks.spec.ts`

**Dependencies**: All implementation steps

**Expected Outcome**:
- E2E test for complete sign-up flow
- E2E test for sign-in and logout flow
- E2E test for creating, editing, deleting tasks
- E2E test for toggling task completion
- E2E test for authentication redirect

---

## Phase 2: Testing and Validation

**Objective**: Ensure all acceptance criteria from spec.md are met.

### Validation Checklist

- [ ] All 5 user stories pass their acceptance scenarios
- [ ] All 23 functional requirements implemented
- [ ] All 10 success criteria verified
- [ ] Authentication flows work with Better Auth
- [ ] JWT tokens properly stored and attached
- [ ] Task CRUD operations functional
- [ ] Responsive design tested on all breakpoints
- [ ] Accessibility tested with keyboard only
- [ ] All forms validated and show clear errors
- [ ] Loading states displayed during operations
- [ ] Error handling provides clear feedback
- [ ] Empty states displayed appropriately
- [ ] All tests pass (unit + E2E)
- [ ] `npm run dev` works without configuration
- [ ] No hardcoded data; all from API
- [ ] No backend/database modifications made

---

## Architectural Decisions

### Decision 1: Local State Management with Hooks

**Context**: Need to manage task list, authentication state, and form state across components.

**Options Considered**:
1. React hooks only (useState, useEffect, custom hooks)
2. Redux Toolkit
3. Zustand
4. React Query

**Decision**: Use React hooks only with custom hooks for encapsulation.

**Rationale**:
- Application state is simple (tasks, auth)
- No complex state updates or middleware needed
- Reduces bundle size and dependencies
- Easier for future developers to understand
- Custom hooks provide sufficient abstraction

**Trade-offs**:
- Manual cache invalidation required
- More boilerplate for state updates
- No built-in devtools for debugging state

---

### Decision 2: Fetch API Over Axios

**Context**: Need HTTP client for API communication.

**Options Considered**:
1. Native Fetch API with custom wrapper
2. Axios library

**Decision**: Use Fetch API with custom wrapper in `lib/api.ts`.

**Rationale**:
- Fetch is native; no additional dependencies
- Custom wrapper provides type safety
- Easier to implement custom interceptors
- Smaller bundle size
- Sufficient for application needs

**Trade-offs**:
- More boilerplate for interceptors
- No automatic JSON transformation
- Manual error handling required

---

### Decision 3: localStorage for JWT Storage

**Context**: Need to store JWT tokens on client side.

**Options Considered**:
1. localStorage
2. sessionStorage
3. httpOnly cookies (backend-managed)

**Decision**: Use localStorage for JWT token storage.

**Rationale**:
- Simple implementation
- Persists across browser sessions
- Frontend has full control over token lifecycle
- Better Auth client SDK expects this pattern
- Backend enforces security via token validation

**Trade-offs**:
- Vulnerable to XSS attacks (mitigated by CSP and input sanitization)
- Not available in private browsing modes
- Requires manual cleanup on logout

---

### Decision 4: Optimistic UI for Task Toggle

**Context**: Task completion toggle should feel instant.

**Options Considered**:
1. Optimistic update (update UI immediately, rollback on error)
2. Pessimistic update (wait for API response)

**Decision**: Implement optimistic UI for toggle operations.

**Rationale**:
- Better perceived performance
- Toggle operations are low-risk
- Easy to rollback on failure
- Improves user experience

**Trade-offs**:
- More complex error handling
- Must handle rollback scenarios
- Can show stale data briefly on failure

---

## Dependencies and Integration Points

### Backend API Dependencies

The frontend assumes the following backend endpoints exist and return expected responses:

**Authentication Endpoints** (managed by Better Auth):
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Authenticate user and return JWT
- `POST /api/auth/signout` - Invalidate session

**Task Endpoints**:
- `GET /api/tasks` - Fetch all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion status

All task endpoints must:
- Require valid JWT in Authorization header
- Return 401 for invalid/missing tokens
- Filter results by authenticated user_id from JWT payload
- Return consistent JSON response format

### Better Auth Integration

- Better Auth SDK configured with `BETTER_AUTH_SECRET`
- JWT tokens include: user_id, email, expiration
- Token expiration handled by Better Auth
- Refresh token mechanism managed by Better Auth (if configured)

---

## Risk Analysis

### Risk 1: Backend API Not Available During Development

**Impact**: High - Frontend cannot function without backend
**Mitigation**:
- Create mock API responses for local development
- Use MSW (Mock Service Worker) for API mocking
- Document expected API contracts in `contracts/`

### Risk 2: Better Auth Configuration Issues

**Impact**: Medium - Authentication flows will fail
**Mitigation**:
- Verify Better Auth setup before starting frontend work
- Document Better Auth configuration requirements
- Create troubleshooting guide in `quickstart.md`

### Risk 3: Performance Issues with Large Task Lists

**Impact**: Medium - UI may lag with 500+ tasks
**Mitigation**:
- Implement pagination or infinite scroll if needed
- Use React.memo for TaskItem components
- Implement virtualized list if performance degrades

### Risk 4: Browser Compatibility Issues

**Impact**: Low - Modern browsers well supported
**Mitigation**:
- Test on all target browsers (Chrome, Firefox, Safari, Edge)
- Use Babel for transpilation
- Add polyfills if needed

---

## Success Metrics

- **Load Time**: Initial page load <3s on 3G connection
- **Interaction Time**: All user interactions respond <100ms
- **Accessibility Score**: Lighthouse accessibility score >95
- **Test Coverage**: >80% code coverage
- **Bundle Size**: Total JS bundle <300KB gzipped
- **Build Time**: Production build completes <2 minutes

---

## Next Steps

1. Run `/sp.tasks` command to generate detailed implementation tasks from this plan
2. Review and approve tasks before beginning implementation
3. Execute tasks in dependency order (setup → types → API client → components → pages → tests)
4. After implementation, run QA validation against spec.md acceptance criteria

---

**Plan Version**: 1.0
**Last Updated**: 2026-01-11
**Status**: Ready for Task Generation
