# Research: Professional Frontend (Next.js)

**Feature**: 001-nextjs-frontend-ui
**Date**: 2026-01-11
**Phase**: 0 - Research & Technology Decisions

## Overview

This document captures research findings and technology decisions for implementing a professional Next.js frontend with Better Auth integration, task CRUD UI, and responsive design.

## Technology Stack Decisions

### 1. Next.js App Router (v14+)

**Decision**: Use Next.js 14+ with App Router architecture

**Rationale**:
- App Router is the recommended approach for new Next.js applications
- Provides built-in support for React Server Components (RSC)
- Enables better code splitting and performance optimization
- Simplifies data fetching with server components
- Better integration with modern React patterns (Suspense, Server Actions)

**Alternatives Considered**:
- **Pages Router**: Older pattern, still supported but not recommended for new projects
- **Create React App**: Lacks built-in SSR/SSG capabilities and is deprecated
- **Vite + React**: Good for SPAs but requires more configuration for auth and routing

**Best Practices**:
- Use Server Components by default; mark as 'use client' only when needed
- Implement route groups (e.g., `(auth)`) for logical organization
- Use loading.tsx and error.tsx for automatic UI states
- Leverage middleware for auth route protection

### 2. Tailwind CSS v3+

**Decision**: Use Tailwind CSS for all styling with utility-first approach

**Rationale**:
- Excellent developer experience with IntelliSense
- Highly customizable via tailwind.config.js
- Built-in responsive design utilities
- JIT (Just-In-Time) compiler for optimal bundle size
- Strong ecosystem and community support

**Alternatives Considered**:
- **CSS Modules**: More verbose, harder to maintain responsive designs
- **Styled Components**: Runtime CSS-in-JS has performance overhead
- **Chakra UI / Material-UI**: Component libraries add unnecessary bundle size

**Best Practices**:
- Use `@apply` sparingly; prefer utility classes directly in JSX
- Create custom design tokens in tailwind.config.js
- Use `clsx` or `cn` utility for conditional classNames
- Leverage Tailwind's built-in dark mode support (future enhancement)

### 3. Better Auth for Authentication

**Decision**: Integrate Better Auth for JWT-based authentication

**Rationale**:
- Pre-configured in the project (per external dependencies)
- Provides JWT token management out of the box
- Supports multiple auth strategies (email/password for Phase II)
- Built-in session management
- Type-safe with TypeScript

**Alternatives Considered**:
- **NextAuth.js**: More complex setup, heavier abstraction
- **Auth0 / Clerk**: Third-party services add cost and external dependencies
- **Custom JWT implementation**: Reinventing the wheel, security risks

**Best Practices**:
- Store tokens in httpOnly cookies when possible
- Implement token refresh logic
- Use Better Auth hooks for client-side auth state
- Handle token expiration gracefully with redirect to sign-in

### 4. Data Fetching & State Management

**Decision**: Use React Server Components for initial data fetching + React hooks for client state

**Rationale**:
- Server Components reduce client-side JavaScript
- No need for complex state management library for this scope
- React's built-in `useState` and `useEffect` sufficient for UI state
- Custom hooks (`useTasks`, `useAuth`) provide abstraction

**Alternatives Considered**:
- **Redux / Redux Toolkit**: Overkill for this application scope
- **Zustand / Jotai**: Adds dependency without clear benefit
- **React Query / SWR**: Excellent but adds complexity; can be added later if needed

**Best Practices**:
- Fetch data on server where possible (RSC)
- Use client-side fetching only for user-triggered actions (CRUD operations)
- Implement optimistic UI updates for better UX
- Cache responses appropriately with `cache()` API

### 5. Form Handling & Validation

**Decision**: Native HTML5 validation + React controlled components

**Rationale**:
- No additional dependencies needed for Phase II requirements
- HTML5 validation provides browser-native UX
- React controlled components for complex state
- Can add react-hook-form later if forms become more complex

**Alternatives Considered**:
- **react-hook-form**: Excellent library but adds dependency
- **Formik**: Legacy, more verbose API
- **Uncontrolled components**: Less React-idiomatic, harder to test

**Best Practices**:
- Use `required`, `pattern`, `minLength` HTML attributes
- Implement custom validation for business rules
- Display validation errors inline near inputs
- Disable submit buttons during submission (loading state)

### 6. API Client Architecture

**Decision**: Custom fetch-based API client with JWT interceptor

**Rationale**:
- Lightweight, no additional HTTP library needed
- Full control over request/response handling
- Easy to add JWT token attachment
- TypeScript interfaces for type safety

**Alternatives Considered**:
- **Axios**: Adds 13KB+ to bundle, fetch API is sufficient
- **ky / wretch**: Fetch wrappers, minimal benefit for our use case
- **tRPC**: Requires backend changes, outside frontend scope

**Best Practices**:
- Create centralized `lib/api.ts` with all API methods
- Implement request/response interceptors for JWT and error handling
- Define TypeScript interfaces for all API payloads
- Handle 401 errors globally (redirect to sign-in)
- Use absolute URLs or environment variables for API base URL

## Architecture Patterns

### Component Architecture

**Decision**: Atomic Design principles with clear component hierarchy

**Structure**:
```
components/
├── ui/              # Primitive components (Button, Input, Modal)
├── auth/            # Auth-specific components (SignInForm, SignUpForm)
├── tasks/           # Task-specific components (TaskList, TaskItem, TaskForm)
└── layout/          # Layout components (Header, EmptyState)
```

**Rationale**:
- Clear separation of concerns
- Reusable primitives reduce duplication
- Domain-specific components easy to locate
- Scales well as feature set grows

### Server vs Client Components

**Decision**: Default to Server Components, use Client Components only when necessary

**Client Component Triggers** (requires 'use client'):
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window)
- Third-party libraries that use hooks

**Server Components** (default):
- Static content
- Data fetching
- Layout wrappers
- SEO-critical pages

**Rationale**:
- Reduces JavaScript sent to browser
- Better performance and SEO
- Leverages Next.js 14 strengths

### Error Handling Strategy

**Decision**: Multi-layer error handling approach

**Layers**:
1. **Component Level**: Try-catch for specific operations
2. **API Client Level**: Centralized error response handling
3. **UI Level**: Toast notifications or inline error messages
4. **Route Level**: error.tsx boundaries for unhandled errors

**Rationale**:
- Prevents app crashes from API failures
- Provides user-friendly error messages
- Centralizes error logic for consistency

## Accessibility Considerations

### WCAG 2.1 Level AA Compliance

**Required Implementations**:
- Semantic HTML5 elements (button, form, input labels)
- ARIA attributes for dynamic content (aria-live, aria-label, aria-describedby)
- Keyboard navigation support (tab order, Enter/Escape handlers)
- Focus management (focus trapping in modals)
- Color contrast ratios (4.5:1 minimum for text)
- Screen reader announcements for async state changes

**Tools for Validation**:
- axe DevTools browser extension
- Lighthouse accessibility audit
- Manual keyboard navigation testing

**Best Practices**:
- Always associate labels with inputs
- Provide skip-to-content links
- Use focus-visible for keyboard-only focus indicators
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Responsive Design Strategy

### Breakpoints

**Tailwind Default Breakpoints** (to be used):
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (small desktops)
- `xl`: 1280px (large desktops)
- `2xl`: 1536px (extra large screens)

**Mobile-First Approach**:
- Base styles target mobile (320px+)
- Use `md:` prefix for tablet adjustments
- Use `lg:` prefix for desktop layouts

**Per Spec Requirements**:
- **Mobile**: 320px-767px (single column, touch-optimized)
- **Tablet**: 768px-1023px (two columns where appropriate)
- **Desktop**: 1024px+ (three columns for task list, sidebar navigation)

### Touch Targets

**Minimum Sizes**:
- Buttons: 44x44px (iOS/Android recommendation)
- Interactive elements: 48x48px minimum
- Spacing between touch targets: 8px minimum

## Performance Considerations

### Bundle Size Optimization

**Strategies**:
- Use Next.js automatic code splitting
- Lazy load modals and heavy components with `React.lazy()`
- Minimize client-side JavaScript with Server Components
- Tree-shake unused Tailwind utilities (automatic with JIT)

**Target Metrics** (per spec):
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Total Blocking Time (TBT): <200ms

### Runtime Performance

**Strategies**:
- Debounce API calls for search/filter (future enhancement)
- Implement virtual scrolling for 100+ tasks (react-window if needed)
- Use `React.memo()` for expensive task item renders
- Optimize re-renders with proper key usage in lists

## Security Best Practices

### Frontend Security Measures

**Implemented**:
- JWT tokens stored securely (httpOnly cookies preferred over localStorage)
- No sensitive data in client-side code or console logs
- Input sanitization to prevent XSS (React escapes by default)
- CSP headers configured in next.config.js
- HTTPS required in production

**NOT Frontend Responsibility** (per agent separation):
- Token generation and signing (Backend Agent)
- SQL injection prevention (Backend/Database Agent)
- Rate limiting (Backend Agent)
- Password hashing (Backend/Auth Agent)

## Dependencies Summary

**Production Dependencies**:
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "better-auth": "^1.x",
  "clsx": "^2.x" // or tailwind-merge for className utility
}
```

**Development Dependencies**:
```json
{
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x",
  "eslint": "^8.x",
  "eslint-config-next": "^14.x"
}
```

**Optional** (can be added if needed):
- `@heroicons/react` - Icon library
- `react-hot-toast` - Toast notifications
- `clsx` + `tailwind-merge` - className utility

## Testing Strategy

**Testing Approach** (if tests required):
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: Test user flows (sign-in → view tasks → create task)
- **E2E Tests**: Playwright or Cypress for critical paths
- **Accessibility Tests**: axe-core integration in test suite

**Per Constitution**: Test-First Discipline (Principle VIII)
- Write tests before implementation
- Follow Red-Green-Refactor cycle
- Tests are OPTIONAL per spec unless explicitly requested

## Open Questions & Clarifications

**Resolved Assumptions** (from spec):
- ✅ Backend API endpoints available with JWT support
- ✅ Backend returns standard HTTP status codes
- ✅ Better Auth pre-configured with BETTER_AUTH_SECRET
- ✅ JWT expiration handled by Better Auth
- ✅ Modern browser support only (no IE11)

**No Outstanding Clarifications**: All technical decisions resolved based on spec requirements and standard best practices.

## Next Steps

After research completion:
1. Proceed to Phase 1: Data Model Design
2. Define API contracts based on functional requirements
3. Generate quickstart.md for developer onboarding
4. Update plan.md with detailed implementation steps
