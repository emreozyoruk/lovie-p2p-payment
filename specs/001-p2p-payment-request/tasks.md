# Tasks: P2P Payment Request

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup ✅
- [x] T001 Create Next.js project with TypeScript + Tailwind
- [x] T002 Install shadcn/ui, Supabase, Playwright
- [x] T003 Set up Spec-Kit with 9 skills
- [x] T004 Set up hooks (auto-format + typecheck)
- [x] T005 Write constitution, spec, plan, tasks

## Phase 2: Database (Supabase MCP)
- [ ] T006 Create profiles table with auth trigger
- [ ] T007 Create payment_requests table (amount INTEGER)
- [ ] T008 Set up Row Level Security policies
- [ ] T009 Create indexes for performance
- [ ] T010 Create test users (email + password)

## Phase 3: Auth
- [ ] T011 Create Supabase client helpers (browser + server)
- [ ] T012 Create login page (email + password)
- [ ] T013 Create auth middleware
- [ ] T014 Create protected layout with header
- [ ] T015 Test login with Playwright MCP

## Phase 4: Core Features (Agent Teams — 3 agents parallel)

### Agent 1: Create Request
- [ ] T016 Install shadcn components (input, label, card, sonner, badge, tabs)
- [ ] T017 Build request form with dollar-to-cents
- [ ] T018 Build POST /api/requests route
- [ ] T019 Build create request page + success state

### Agent 2: Dashboard
- [ ] T020 Build status badge component
- [ ] T021 Build request card component
- [ ] T022 Build dashboard tabs (incoming/outgoing)
- [ ] T023 Build GET /api/requests route (list + filter + search)
- [ ] T024 Build dashboard page

### Agent 3: Detail + Actions
- [ ] T025 Build request detail component
- [ ] T026 Build countdown timer component
- [ ] T027 Build GET /api/requests/[id] route
- [ ] T028 Build PATCH pay/decline/cancel routes
- [ ] T029 Build detail page + success page

## Phase 5: Extra Features
- [ ] T030 Build shareable link page + API
- [ ] T031 Build header with logout
- [ ] T032 Add toast messages for all actions
- [ ] T033 Root page redirect to /dashboard

## Phase 6: Visual Testing (Playwright MCP — on camera)
- [ ] T034 Test login with both accounts
- [ ] T035 Test create request
- [ ] T036 Test dashboard both tabs
- [ ] T037 Test pay flow (sender → receiver → pay → check both)
- [ ] T038 Test decline flow
- [ ] T039 Test cancel flow
- [ ] T040 Test expiry countdown
- [ ] T041 Test responsive (375px, 768px, 1280px)

## Phase 7: E2E Tests (Playwright — automated + video)
- [ ] T042 Configure Playwright with video recording
- [ ] T043 Write 9 test files
- [ ] T044 Run all tests — all pass

## Phase 8: Deploy + Docs
- [ ] T045 Deploy to Vercel
- [ ] T046 Test production with Playwright MCP
- [ ] T047 Run accessibility audit
- [ ] T048 Write README
- [ ] T049 Final push to GitHub
