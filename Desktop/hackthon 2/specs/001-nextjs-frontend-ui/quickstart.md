# Quickstart Guide: Professional Frontend (Next.js)

**Feature**: 001-nextjs-frontend-ui
**Date**: 2026-01-11
**Audience**: Frontend developers implementing this feature

## Overview

This guide provides a quickstart for developing the Professional Frontend (Next.js) implementation. Follow this guide to understand the project structure, set up your development environment, and begin implementation.

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.17+ or v20.x+ (LTS recommended)
- **npm**: v9+ or yarn v1.22+
- **Git**: v2.x+
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - Prettier
  - TypeScript and JavaScript Language Features

**Backend Requirement**: The backend API must be running and accessible. See backend setup documentation for details.

## Project Setup

### 1. Install Dependencies

```bash
cd frontend

# Install all dependencies
npm install

# Dependencies will include:
# - next@^14.x
# - react@^18.x
# - react-dom@^18.x
# - better-auth@^1.x
# - tailwindcss@^3.x
# - typescript@^5.x
```

### 2. Environment Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration (from backend setup)
BETTER_AUTH_SECRET=your-secret-key-from-backend

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=false
```

**Important**:
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_*` variables
- Backend must be running at the specified API_URL

### 3. Verify Setup

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Start development server
npm run dev
```

The app should be accessible at `http://localhost:3000`.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── signin/
│   │   │   └── page.tsx          # Sign-in page
│   │   └── signup/
│   │       └── page.tsx          # Sign-up page
│   ├── dashboard/
│   │   └── page.tsx              # Task dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/home page
│   ├── loading.tsx               # Global loading UI
│   └── error.tsx                 # Global error boundary
├── components/
│   ├── auth/                     # Auth components
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── tasks/                    # Task components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── DeleteConfirmDialog.tsx
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Toast.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Better Auth utilities
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions (cn, formatDate, etc.)
├── hooks/
│   ├── useTasks.ts               # Task CRUD hooks
│   └── useAuth.ts                # Auth state hook
├── contexts/
│   └── AuthContext.tsx           # Auth context provider
├── public/                       # Static assets
├── styles/
│   └── globals.css               # Global styles + Tailwind directives
├── .env.local                    # Environment variables (gitignored)
├── .eslintrc.json                # ESLint configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Development Workflow

### Step 1: Foundation Setup

Create core infrastructure:

1. **Configure Tailwind** (`tailwind.config.js`)
2. **Set up global styles** (`styles/globals.css`)
3. **Create type definitions** (`lib/types.ts`)
4. **Implement API client** (`lib/api.ts`)
5. **Set up Better Auth integration** (`lib/auth.ts`)

### Step 2: Build UI Primitives

Create reusable components in `components/ui/`:

1. **Button** - Primary, secondary, danger variants
2. **Input** - Text, email, password with validation states
3. **Modal** - Reusable dialog component
4. **LoadingSpinner** - Loading indicator
5. **Toast** - Notification system (optional)

### Step 3: Authentication Flow

Implement auth components and pages:

1. **AuthContext** - Global auth state management
2. **useAuth hook** - Auth state and actions
3. **SignUpForm** - User registration
4. **SignInForm** - User login
5. **Auth pages** - `/signin` and `/signup`
6. **Route protection** - Middleware for auth guards

### Step 4: Task Management UI

Build task-related components:

1. **TaskList** - Display all tasks
2. **TaskItem** - Individual task display with actions
3. **TaskForm** - Create/edit task form
4. **DeleteConfirmDialog** - Delete confirmation
5. **Dashboard page** - Main task interface

### Step 5: Layout & Navigation

Implement layout components:

1. **Header** - App header with logout
2. **RootLayout** - Global layout wrapper
3. **EmptyState** - No tasks message
4. **Loading/Error states** - Global UI states

### Step 6: Polish & Refinement

Add final touches:

1. **Responsive design** - Test on mobile, tablet, desktop
2. **Accessibility** - Keyboard navigation, ARIA attributes
3. **Error handling** - User-friendly error messages
4. **Loading states** - Smooth UX during API calls
5. **Validation** - Client-side form validation

## Key Implementation Patterns

### Server vs Client Components

**Server Components** (default):
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // This runs on the server
  // Can access backend directly (if same-origin)
  // No JavaScript sent to client
  return <div>...</div>;
}
```

**Client Components** (use sparingly):
```typescript
// components/tasks/TaskForm.tsx
'use client';

export function TaskForm() {
  const [title, setTitle] = useState('');
  // This runs on the client
  // Can use hooks and event handlers
  return <form>...</form>;
}
```

### API Client Pattern

```typescript
// lib/api.ts
import { getToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Handle errors
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export const api = {
  tasks: {
    getAll: () => apiRequest<Task[]>('/tasks'),
    create: (data: CreateTaskRequest) =>
      apiRequest<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // ... other methods
  },
};
```

### Form Validation Pattern

```typescript
// components/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle API errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        required
      />
      {/* ... */}
    </form>
  );
}
```

### Tailwind Styling Pattern

```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        }
      )}
    >
      {children}
    </button>
  );
}
```

## Coding Standards

### TypeScript

- **Always use explicit types** for props and return values
- **Avoid `any`** - use `unknown` if type is truly unknown
- **Use interfaces** for object types
- **Enable strict mode** in tsconfig.json

### React

- **Functional components** only (no class components)
- **Custom hooks** for reusable logic
- **Controlled components** for forms
- **Proper key usage** in lists (use unique IDs, not array index)

### Naming Conventions

- **Components**: PascalCase (e.g., `TaskList`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### File Organization

- **One component per file**
- **Co-locate related files** (component + styles + tests)
- **Use barrel exports** (`index.ts`) for directories
- **Group by feature**, not by type

## Testing Strategy

### Unit Tests (if required)

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Sign-up flow works correctly
- [ ] Sign-in flow works correctly
- [ ] Logout clears session
- [ ] Dashboard displays user tasks
- [ ] Create task adds to list
- [ ] Edit task updates correctly
- [ ] Delete task removes from list
- [ ] Toggle completion works
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1280px)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Debugging Tips

### Common Issues

**Issue**: "Cannot find module '@/...' "
- **Solution**: Check `tsconfig.json` paths configuration

**Issue**: Tailwind classes not applying
- **Solution**: Verify `tailwind.config.js` content paths include all component directories

**Issue**: API requests failing with CORS errors
- **Solution**: Ensure backend CORS configuration allows frontend origin

**Issue**: Hydration errors in console
- **Solution**: Ensure server and client render the same initial HTML (no client-only data in initial render)

**Issue**: JWT token not being sent
- **Solution**: Check `lib/api.ts` token attachment logic

### Development Tools

- **React DevTools**: Inspect component tree and props
- **Network Tab**: Monitor API requests/responses
- **Lighthouse**: Audit performance and accessibility
- **axe DevTools**: Check accessibility issues

## Performance Optimization

### Best Practices

1. **Use Server Components** by default
2. **Lazy load** modals and heavy components
3. **Optimize images** with Next.js `<Image>` component
4. **Minimize client JavaScript** bundle size
5. **Implement pagination** for large task lists (future)
6. **Use React.memo()** for expensive renders
7. **Debounce** search inputs (future feature)

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze
```

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no errors
- [ ] Build succeeds (`npm run build`)
- [ ] All acceptance criteria from spec.md met
- [ ] Manual testing completed
- [ ] Accessibility audit passes (Lighthouse)
- [ ] Performance meets targets (FCP < 1.5s, TTI < 3s)
- [ ] Responsive design verified
- [ ] Error handling tested
- [ ] Backend API endpoints accessible

## Resources

### Documentation

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Specifications

- [Feature Spec](./spec.md) - Requirements and user stories
- [Data Model](./data-model.md) - Type definitions and entities
- [API Contracts](./contracts/api-endpoints.md) - Backend API specification
- [Research](./research.md) - Technology decisions and patterns

## Getting Help

If you encounter issues:

1. **Check spec documents** for requirements clarification
2. **Review constitution** (`.specify/memory/constitution.md`) for agent rules
3. **Consult research.md** for architecture decisions
4. **Reach out to team** if backend integration issues arise

## Next Steps

1. **Review all spec documents** before coding
2. **Set up development environment** following this guide
3. **Start with foundation** (types, API client, auth setup)
4. **Build UI primitives** before complex features
5. **Follow constitution principles** (spec-first, agent separation, test-first)
6. **Refer to plan.md** for detailed implementation steps

---

**Ready to start?** Proceed to `plan.md` for the detailed implementation plan with step-by-step instructions.
