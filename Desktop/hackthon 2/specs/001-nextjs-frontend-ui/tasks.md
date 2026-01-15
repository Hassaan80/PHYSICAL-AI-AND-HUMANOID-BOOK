---
description: "Implementation tasks for Professional Frontend (Next.js)"
---

# Tasks: Professional Frontend (Next.js)

**Input**: Design documents from `/specs/001-nextjs-frontend-ui/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/api-endpoints.md (complete)

**Tests**: Tests are NOT explicitly requested in the spec, so test tasks are EXCLUDED per constitution guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with frontend in `frontend/` directory:
- Pages: `frontend/app/`
- Components: `frontend/components/`
- Utilities: `frontend/lib/`
- Hooks: `frontend/hooks/`

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 14+ project with TypeScript in frontend/ directory
- [x] T002 [P] Install and configure Tailwind CSS with frontend/tailwind.config.ts and frontend/app/globals.css
- [x] T003 [P] Install Better Auth client SDK and configure in frontend/package.json
- [x] T004 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [x] T005 [P] Setup ESLint with Next.js config in frontend/.eslintrc.json
- [x] T006 Create project structure (components/, lib/, hooks/, app/) per plan.md

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Define TypeScript interfaces in frontend/lib/types.ts (User, Task, Session, ApiResponse, FormData types)
- [x] T008 [P] Create validation utilities in frontend/lib/utils.ts (email validation, password validation, task validation)
- [x] T009 [P] Implement API client in frontend/lib/api.ts with fetch wrapper, JWT interceptor, and error handling
- [x] T010 [P] Create useLocalStorage hook in frontend/hooks/useLocalStorage.ts for token persistence
- [x] T011 Implement Better Auth integration in frontend/lib/auth.ts with token management
- [x] T012 Create useAuth hook in frontend/hooks/useAuth.ts providing login, logout, signup, isAuthenticated
- [x] T013 [P] Create Button component in frontend/components/ui/Button.tsx with variants (primary, secondary, destructive)
- [x] T014 [P] Create Input component in frontend/components/ui/Input.tsx with label and error state
- [x] T015 [P] Create Textarea component in frontend/components/ui/Textarea.tsx with label and error state
- [x] T016 [P] Create Modal component in frontend/components/ui/Modal.tsx with overlay and focus trap
- [x] T017 [P] Create LoadingSpinner component in frontend/components/ui/LoadingSpinner.tsx
- [x] T018 [P] Create ErrorMessage component in frontend/components/ui/ErrorMessage.tsx
- [x] T019 [P] Create Container component in frontend/components/layout/Container.tsx for responsive max-width
- [x] T020 [P] Create EmptyState component in frontend/components/layout/EmptyState.tsx for "no tasks" message
- [x] T021 Create root layout in frontend/app/layout.tsx with HTML structure, metadata, and Tailwind imports
- [x] T022 Setup environment configuration for API base URL in frontend/.env.local

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - User Authentication Flow (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Enable users to sign up, sign in, and sign out to establish authenticated sessions

**Independent Test**: Navigate to app, complete sign-up flow, logout, and sign back in successfully

### Implementation for User Story 1

- [x] T023 [P] [US1] Create SignUpForm component in frontend/components/auth/SignUpForm.tsx with email, password, confirmPassword fields and validation
- [x] T024 [P] [US1] Create SignInForm component in frontend/components/auth/SignInForm.tsx with email and password fields and validation
- [x] T025 [US1] Create auth layout in frontend/app/(auth)/layout.tsx with centered container
- [x] T026 [US1] Create sign-up page in frontend/app/(auth)/signup/page.tsx using SignUpForm
- [x] T027 [US1] Create sign-in page in frontend/app/(auth)/signin/page.tsx using SignInForm
- [x] T028 [US1] Create landing page in frontend/app/page.tsx with authentication-based redirect logic
- [x] T029 [US1] Implement auth redirect logic in useAuth hook to redirect unauthenticated users to /signin
- [x] T030 [US1] Add loading states to SignUpForm and SignInForm during API calls
- [x] T031 [US1] Add error handling and display for authentication failures in forms
- [x] T032 [US1] Create Header component in frontend/components/layout/Header.tsx with user email display and logout button

**Checkpoint**: At this point, User Story 1 should be fully functional - users can sign up, sign in, sign out, and access protected routes ✅

---

## Phase 4: User Story 2 - View and Manage Task List (Priority: P2)

**Goal**: Display all user tasks with visual indicators of completion status and responsive layout

**Independent Test**: Log in with existing tasks, observe task list displays properly with completion status

### Implementation for User Story 2

- [ ] T033 [US2] Create useTasks hook in frontend/hooks/useTasks.ts with getTasks, loading, error state
- [ ] T034 [P] [US2] Create TaskToggle component in frontend/components/tasks/TaskToggle.tsx for completion checkbox
- [ ] T035 [P] [US2] Create TaskItem component in frontend/components/tasks/TaskItem.tsx displaying title, description, completion status, edit/delete buttons
- [ ] T036 [US2] Create TaskList component in frontend/components/tasks/TaskList.tsx rendering array of TaskItem components
- [ ] T037 [US2] Create dashboard layout in frontend/app/dashboard/layout.tsx with Header component
- [ ] T038 [US2] Create dashboard page in frontend/app/dashboard/page.tsx with TaskList and authentication guard
- [ ] T039 [US2] Implement authentication guard in dashboard page to redirect unauthenticated users
- [ ] T040 [US2] Add loading state display in TaskList while tasks are fetching
- [ ] T041 [US2] Integrate EmptyState component in TaskList when tasks array is empty
- [ ] T042 [US2] Add responsive layout styling to TaskList for mobile, tablet, and desktop
- [ ] T043 [US2] Implement toggleTask method in useTasks hook with optimistic UI update
- [ ] T044 [US2] Add error handling in TaskList for failed API requests with retry option

**Checkpoint**: At this point, User Stories 1 AND 2 work independently - users can authenticate and view their task list

---

## Phase 5: User Story 3 - Create New Task (Priority: P3)

**Goal**: Enable users to create new tasks with title and description

**Independent Test**: Log in, click "Add Task", fill form, submit, and verify new task appears in list

### Implementation for User Story 3

- [ ] T045 [US3] Create TaskForm component in frontend/components/tasks/TaskForm.tsx supporting create and edit modes
- [ ] T046 [US3] Add form validation to TaskForm (title required, length limits)
- [ ] T047 [US3] Implement createTask method in useTasks hook calling POST /tasks endpoint
- [ ] T048 [US3] Add "Add Task" button to dashboard page opening modal with TaskForm
- [ ] T049 [US3] Integrate Modal component with TaskForm for task creation
- [ ] T050 [US3] Add loading state to TaskForm during task creation API call
- [ ] T051 [US3] Add error handling and display for failed task creation in TaskForm
- [ ] T052 [US3] Update tasks array in useTasks hook after successful task creation
- [ ] T053 [US3] Close modal and show success feedback after task creation
- [ ] T054 [US3] Add "Cancel" button to TaskForm to close modal without creating task

**Checkpoint**: At this point, User Stories 1, 2, AND 3 work independently - users can authenticate, view tasks, and create new tasks

---

## Phase 6: User Story 4 - Edit Existing Task (Priority: P4)

**Goal**: Enable users to edit title and description of existing tasks

**Independent Test**: Log in, select task, edit fields, save, and verify task displays updated information

### Implementation for User Story 4

- [x] T055 [US4] Add edit mode support to TaskForm component using mode prop
- [x] T056 [US4] Add "Edit" button to TaskItem component opening modal with TaskForm in edit mode
- [x] T057 [US4] Pre-populate TaskForm fields with current task data in edit mode
- [x] T058 [US4] Implement updateTask method in useTasks hook calling PUT /tasks/:id endpoint
- [x] T059 [US4] Add loading state to TaskForm during task update API call
- [x] T060 [US4] Add error handling and display for failed task update in TaskForm
- [x] T061 [US4] Update task in tasks array after successful edit
- [x] T062 [US4] Close modal and show success feedback after task update

**Checkpoint**: At this point, User Stories 1-4 work independently - users can authenticate, view, create, and edit tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P5)

**Goal**: Enable users to delete tasks that are no longer relevant

**Independent Test**: Log in, select task, click delete, confirm, and verify task is removed from list

### Implementation for User Story 5

- [ ] T063 [US5] Create DeleteConfirmDialog component in frontend/components/tasks/DeleteConfirmDialog.tsx with confirmation message and actions
- [ ] T064 [US5] Add "Delete" button to TaskItem component opening DeleteConfirmDialog
- [ ] T065 [US5] Implement deleteTask method in useTasks hook calling DELETE /tasks/:id endpoint
- [ ] T066 [US5] Add loading state to DeleteConfirmDialog during deletion API call
- [ ] T067 [US5] Add error handling and display for failed task deletion in DeleteConfirmDialog
- [ ] T068 [US5] Remove task from tasks array after successful deletion
- [ ] T069 [US5] Close dialog and show success feedback after task deletion
- [ ] T070 [US5] Add "Cancel" button to DeleteConfirmDialog to abort deletion

**Checkpoint**: All user stories are now independently functional - complete CRUD operations available

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance overall quality

- [ ] T071 [P] Add ARIA labels to all interactive elements (buttons, inputs, modals) for accessibility
- [ ] T072 [P] Implement keyboard navigation support (Tab, Enter, Escape) across all components
- [ ] T073 [P] Add focus management to modals (focus trap, return focus on close)
- [ ] T074 [P] Ensure color contrast meets WCAG 2.1 Level AA standards in all components
- [ ] T075 [P] Add loading.tsx files for Next.js route loading states
- [ ] T076 [P] Add error.tsx files for Next.js error boundaries
- [ ] T077 [P] Optimize TaskItem component with React.memo for large lists
- [ ] T078 [P] Add meta tags and SEO configuration to layout.tsx
- [ ] T079 [P] Implement proper error logging in API client error handler
- [ ] T080 Configure Next.js production build optimizations in next.config.js
- [ ] T081 Add form accessibility improvements (associated labels, error announcements)
- [ ] T082 Test responsive design at 320px, 768px, 1024px, 1440px viewports
- [ ] T083 Verify all acceptance criteria from spec.md are met
- [ ] T084 Run npm run dev and verify application starts without errors
- [ ] T085 Validate all user stories work end-to-end in sequence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires authentication from US1 but stories are independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on task viewing from US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Extends task creation from US3
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Complements other task operations

### Within Each User Story

- UI components before page integration
- Forms before submission handlers
- API methods before UI integration
- Loading states and error handling after core functionality
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T002, T003, T004, T005 can run in parallel

**Phase 2 (Foundational)**:
- Tasks T007, T008, T009, T010 can run in parallel (different utilities)
- Tasks T013, T014, T015, T016, T017, T018, T019, T020 can run in parallel (different UI components)

**Phase 3 (US1)**:
- Tasks T023, T024 can run in parallel (different auth forms)

**Phase 4 (US2)**:
- Tasks T034, T035 can run in parallel (different task components)

**Phase 8 (Polish)**:
- Tasks T071, T072, T073, T074, T075, T076, T077, T078, T079 can run in parallel (different concerns)

**Cross-Story Parallelization**:
- Once Foundational phase completes, multiple user stories can be developed in parallel by different team members
- US1 + US2 can be built in parallel
- US3, US4, US5 can be built in parallel after US2 (share TaskForm, TaskItem dependencies)

---

## Parallel Example: User Story 2

```bash
# Launch UI components for User Story 2 together:
Task: "Create TaskToggle component in frontend/components/tasks/TaskToggle.tsx"
Task: "Create TaskItem component in frontend/components/tasks/TaskItem.tsx"

# After components complete, integrate:
Task: "Create TaskList component in frontend/components/tasks/TaskList.tsx"
```

---

## Parallel Example: Foundational Phase

```bash
# Launch all UI primitives together:
Task: "Create Button component in frontend/components/ui/Button.tsx"
Task: "Create Input component in frontend/components/ui/Input.tsx"
Task: "Create Textarea component in frontend/components/ui/Textarea.tsx"
Task: "Create Modal component in frontend/components/ui/Modal.tsx"
Task: "Create LoadingSpinner component in frontend/components/ui/LoadingSpinner.tsx"
Task: "Create ErrorMessage component in frontend/components/ui/ErrorMessage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Tasks T001-T006)
2. Complete Phase 2: Foundational (Tasks T007-T022) - CRITICAL
3. Complete Phase 3: User Story 1 (Tasks T023-T032)
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready

**MVP Scope**: Tasks T001-T032 (32 tasks)
**MVP Deliverable**: Working authentication system (sign up, sign in, sign out, route protection)

### Incremental Delivery

1. **Foundation** (Phases 1-2): Tasks T001-T022 → Infrastructure ready
2. **MVP** (Phase 3): Tasks T023-T032 → Auth working → Deploy/Demo (US1 complete)
3. **Task Viewing** (Phase 4): Tasks T033-T044 → View tasks → Deploy/Demo (US1+US2 complete)
4. **Task Creation** (Phase 5): Tasks T045-T054 → Create tasks → Deploy/Demo (US1+US2+US3 complete)
5. **Task Editing** (Phase 6): Tasks T055-T062 → Edit tasks → Deploy/Demo (US1+US2+US3+US4 complete)
6. **Task Deletion** (Phase 7): Tasks T063-T070 → Delete tasks → Deploy/Demo (All stories complete)
7. **Polish** (Phase 8): Tasks T071-T085 → Production-ready → Final deployment

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phases 1-2)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Authentication)
   - **Developer B**: User Story 2 (Task viewing) - can work on components in parallel
   - **Developer C**: User Story 3 (Task creation) - reuses US2 foundations
3. **Integration Phase**: Merge and test all stories work together
4. **Developer A**: User Story 4 (Edit)
5. **Developer B**: User Story 5 (Delete)
6. **Team**: Polish phase in parallel

---

## Task Count Summary

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 16 tasks (BLOCKS all user stories)
- **Phase 3 (US1 - Authentication)**: 10 tasks
- **Phase 4 (US2 - View Tasks)**: 12 tasks
- **Phase 5 (US3 - Create Task)**: 10 tasks
- **Phase 6 (US4 - Edit Task)**: 8 tasks
- **Phase 7 (US5 - Delete Task)**: 8 tasks
- **Phase 8 (Polish)**: 15 tasks

**Total**: 85 tasks

**Parallel Opportunities**: 22 tasks marked [P] can run in parallel within their phases

**MVP Scope**: 32 tasks (Phases 1-3) deliver working authentication

**Full Feature**: 85 tasks deliver complete todo application with all CRUD operations

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability (US1-US5)
- **Each user story**: Independently completable and testable
- **Tests**: NOT included per spec requirements (no explicit TDD request)
- **File paths**: All paths relative to repository root
- **Commit strategy**: Commit after each task or logical group
- **Validation checkpoints**: Stop at phase checkpoints to validate independently
- **Agent boundaries**: No backend, database, or authentication logic modifications (frontend only)

---

## Acceptance Validation

Before marking feature complete, verify against spec.md:

**User Stories** (Section: User Scenarios & Testing):
- ✅ US1: All 5 acceptance scenarios for authentication flow pass
- ✅ US2: All 5 acceptance scenarios for task viewing pass
- ✅ US3: All 5 acceptance scenarios for task creation pass
- ✅ US4: All 4 acceptance scenarios for task editing pass
- ✅ US5: All 4 acceptance scenarios for task deletion pass

**Functional Requirements** (23 total - FR-001 through FR-023):
- ✅ All authentication requirements (FR-001 through FR-005, FR-015)
- ✅ All task management requirements (FR-006 through FR-014)
- ✅ All technical requirements (FR-016 through FR-023)

**Success Criteria** (10 total - SC-001 through SC-010):
- ✅ Performance criteria met (load times, operation feedback)
- ✅ Responsive design working (320px to 2560px)
- ✅ Accessibility standards met (keyboard nav, WCAG 2.1 AA)
- ✅ Developer experience criteria met (npm run dev works)

**Edge Cases** (Section: Edge Cases):
- ✅ Session expiration handling
- ✅ API unreachable error handling
- ✅ Large task lists (100+ tasks)
- ✅ Network connectivity issues
- ✅ Special characters and long text handling

---

## Next Steps After Task Completion

1. Run full QA validation against spec.md acceptance criteria
2. Deploy to staging environment for user testing
3. Collect feedback and create follow-up tasks if needed
4. Prepare production deployment
5. Document any deviations from spec in ADR if applicable
