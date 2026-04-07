# PayRequest Constitution

## Core Principles

### I. Security-First Fintech Development
All code must treat money with care. Amounts are stored as integers in cents — never floats. Row Level Security keeps user data private. Validation runs on both client and server. No user sees another user's data.

### II. Spec-Driven Development
Every feature starts with a spec. The spec is the source of truth. It must be clear enough that any developer or AI agent can build from it with no questions. Specs include user stories, data models, API contracts, validation rules, and edge cases.

### III. Type Safety & Code Quality
TypeScript strict mode. All API responses typed. No `any` types. Prettier and ESLint auto-run via hooks on every edit. TypeScript check runs after every response.

### IV. Test-First Quality
E2E tests cover all user paths. Playwright with video recording. Tests pass before deploy. Each feature is tested with both sender and receiver accounts.

### V. Mobile-First Design
All UI works on mobile (375px), tablet (768px), and desktop (1280px). Touch targets minimum 44px. Forms full-width on mobile.

### VI. Keep It Simple
No over-engineering. Use ready-made tools — shadcn/ui, Supabase. Ship fast. YAGNI.

## Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth (email + password for testing)
- **UI**: Tailwind CSS + shadcn/ui
- **Testing**: Playwright (E2E + video recording + Playwright MCP for visual testing)
- **Deploy**: Vercel
- **AI Tools**: Claude Code with MCP servers (Supabase, Playwright, Context7, GitHub), hooks, skills, and Agent Teams

## Governance

Security and fintech rules are not optional. Every change must follow this constitution.

**Version**: 1.0.0 | **Date**: 2026-04-08
