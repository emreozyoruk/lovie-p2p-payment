# PayRequest — P2P Payment Request Feature

A peer-to-peer payment request app built for the Lovie interview assignment. Users can create, manage, pay, decline, and cancel payment requests — like Venmo.

## Live Demo

[https://lovie-p2p-payment.vercel.app](https://lovie-p2p-payment.vercel.app)

## Build Process Video

[Watch the full build process on YouTube](https://youtu.be/UbOJPW8kpEo)

## Features

- **Create Payment Requests** — Enter email, amount, and note. Gets a shareable link.
- **Dashboard** — Incoming and outgoing tabs with status badges, filter, and search.
- **Pay Requests** — 2-3 second loading simulation, then success page.
- **Decline & Cancel** — Receiver declines, sender cancels. Only for pending requests.
- **Expiration** — 7-day countdown timer. Expired requests can't be paid.
- **Shareable Links** — Public page anyone can view.
- **Responsive** — Works on mobile (375px), tablet (768px), desktop (1280px).
- **Password Login** — Two test accounts for fast switching during demo.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email + password) |
| UI | Tailwind CSS + shadcn/ui |
| Testing | Playwright (E2E + video recording) + Playwright MCP (visual) |
| Deployment | Vercel |
| Spec Workflow | GitHub Spec-Kit |

## AI-Native Development Setup

Built with **Claude Code** (Opus 4.6) as the primary coding tool:

- **Supabase MCP** — Claude creates tables, runs SQL, checks data directly from the terminal
- **Playwright MCP** — Claude opens a real browser to test every feature visually
- **Context7 Plugin** — Pulls latest library docs live (Next.js, Supabase, Playwright)
- **GitHub MCP** — Version control from the terminal
- **Hooks** — PostToolUse: auto Prettier + ESLint on every edit. Stop: auto TypeScript check after every response.
- **Skills** — `/supabase-postgres-best-practices` for schema, `/frontend-design` for UI
- **Spec-Kit** — 9 skills for spec-driven workflow (constitution, specify, plan, tasks, implement, clarify, analyze, checklist)

## Fintech Best Practices

- **Amounts as integers (cents)** — $50.00 stored as 5000. No floats.
- **Row Level Security** — Users only see their own requests
- **Server-side validation** — All inputs checked on client AND server
- **Race condition protection** — `WHERE status = 'pending'` prevents double-pay
- **Proper HTTP codes** — 400, 403, 404, 410 for each error type

## Project Structure

```
src/
├── app/
│   ├── (protected)/           # Login required
│   │   ├── dashboard/         # Tabs: incoming + outgoing
│   │   └── requests/          # New, detail, success
│   ├── api/requests/          # 7 API routes
│   ├── login/                 # Email + password login
│   └── pay/[link]/            # Public shareable page
├── components/                # UI components
├── lib/                       # Supabase clients, types, validators
└── middleware.ts              # Auth guard

specs/001-p2p-payment-request/ # Spec-Kit artifacts
├── spec.md                    # 5 user stories, 9 edge cases
├── plan.md                    # Architecture decisions
└── tasks.md                   # 49 tasks in 8 phases

tests/                         # 9 Playwright E2E test files
screenshots/                   # 10 Playwright MCP screenshots
```

## Local Setup

```bash
git clone https://github.com/emreozyoruk/lovie-p2p-payment.git
cd lovie-p2p-payment
npm install
cp .env.example .env.local     # Add your Supabase keys
npm run dev                    # Open http://localhost:3000
```

Run `supabase-schema.sql` in Supabase SQL Editor to create tables.

## Running Tests

```bash
npx playwright install         # Install browsers
npx playwright test            # Run all tests with video
npx playwright show-report     # View HTML report
```

Videos saved to `test-results/`. Screenshots in `screenshots/`.

## Spec-Kit Artifacts

Full specification in `specs/001-p2p-payment-request/`:
- **spec.md** — 5 user stories, 16 requirements, 9 edge cases, 7 API contracts
- **plan.md** — Architecture decisions, why password not magic link, why cents not dollars
- **tasks.md** — 49 tasks across 8 phases

## License

MIT
