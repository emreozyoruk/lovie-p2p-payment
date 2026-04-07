# PayRequest — Project Instructions for Claude Code

## Project Overview
P2P payment request app (like Venmo). Users create, pay, decline, and cancel payment requests.

## Tech Stack
- Next.js 14 (App Router) + TypeScript (strict)
- Supabase (PostgreSQL + Row Level Security + Auth)
- Tailwind CSS + shadcn/ui
- Playwright (E2E testing + video recording)

## Architecture Rules

### Fintech — Non-Negotiable
- Amounts ALWAYS stored as INTEGER (cents). $50.00 = 5000. NEVER use floats for money.
- Row Level Security on all tables. Users can only see their own data.
- Validate inputs on BOTH client and server. Never trust the client alone.
- Race condition protection: always use `WHERE status = 'pending'` before status changes.
- Correct HTTP codes: 400 (bad input), 403 (no access), 404 (not found), 410 (expired).

### Code Style
- TypeScript strict mode. No `any` types.
- Use shadcn/ui components (Button, Input, Card, Badge, Tabs, etc.).
- Tailwind for all styling. No inline styles.
- Hooks auto-run Prettier + ESLint on every edit. TypeScript check on every response.

### Auth
- Email + password login (not magic link — rate limits break testing).
- Two test accounts: samsungsarz@outlook.com and emreozyorukdev@gmail.com
- Password for both: testpass123

### Database
- `profiles` table — synced from auth.users via trigger
- `payment_requests` table — amount INTEGER, status enum, shareable_link UUID
- Schema in `supabase-schema.sql`

### Testing
- Playwright E2E with `video: 'on'`, `screenshot: 'on'`, `trace: 'on'`
- Test files in `tests/`
- Use Playwright MCP for visual browser testing

### MCP Servers
- Supabase MCP — run SQL, check data from terminal
- Playwright MCP — visual browser testing
- Context7 — pull latest library docs
- GitHub MCP — version control

### Spec-Kit Workflow
- Constitution: `.specify/memory/constitution.md`
- Spec: `specs/001-p2p-payment-request/spec.md`
- Plan: `specs/001-p2p-payment-request/plan.md`
- Tasks: `specs/001-p2p-payment-request/tasks.md`

## File Structure
```
src/app/(protected)/    — Auth-required pages (dashboard, requests)
src/app/api/requests/   — 7 API routes
src/app/login/          — Login page
src/app/pay/[link]/     — Public shareable link page
src/components/         — UI components
src/lib/                — Supabase clients, types, validators
src/middleware.ts       — Auth guard
```

@AGENTS.md
