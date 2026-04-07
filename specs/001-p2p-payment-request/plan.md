# Implementation Plan: P2P Payment Request

**Branch**: `001-p2p-payment-request` | **Date**: 2026-04-08 | **Spec**: [spec.md](./spec.md)

## Summary

Build a P2P payment request app with Next.js 14 + Supabase. Users can create, view, pay, decline, and cancel payment requests. Two test accounts for full flow testing.

## Technical Context

**Language**: TypeScript 5.x (strict)
**Framework**: Next.js 14 (App Router), React 18, Supabase JS v2, shadcn/ui, Tailwind v4
**Database**: Supabase PostgreSQL with Row Level Security
**Testing**: Playwright E2E (video on) + Playwright MCP (visual browser testing)
**Deploy**: Vercel
**AI Tools**: Claude Code + Supabase MCP + Playwright MCP + Context7 + GitHub MCP + Agent Teams + Hooks

## Architecture Decisions

### 1. Auth: Email + Password (not Magic Link)
Magic link has rate limits on free tier — blocks testing with two accounts. Password login lets us switch accounts in seconds on camera.

### 2. Amounts: Integer Cents
$50.00 = 5000 cents. Prevents float rounding errors. This is how Stripe works.

### 3. Race Condition Protection
API uses `WHERE status = 'pending'` before any update. Two people can't pay the same request.

### 4. Expiry: Check on Read
No background job. When we read a request, we check if `expires_at < now()`. Simple and works at our scale.

### 5. Agent Teams for Parallel Build
Three agents build three features at the same time — form, dashboard, detail page. Each in its own branch.

## Project Structure

```
src/
├── app/
│   ├── (protected)/           # Login required
│   │   ├── dashboard/         # Tabs: incoming + outgoing
│   │   └── requests/          # New, detail, success
│   ├── api/requests/          # 7 API routes
│   ├── auth/callback/         # Auth callback
│   ├── login/                 # Email + password login
│   └── pay/[link]/            # Public shareable page
├── components/                # UI parts
├── lib/                       # Supabase clients, types, helpers
├── hooks/                     # React hooks
└── middleware.ts              # Auth guard

specs/                         # Spec-Kit files
tests/                         # Playwright E2E tests
```
