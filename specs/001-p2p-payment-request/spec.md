# Feature Specification: P2P Payment Request

**Feature Branch**: `001-p2p-payment-request`
**Created**: 2026-04-08
**Status**: Approved

## User Scenarios & Testing

### User Story 1 — Create Payment Request (Priority: P1)

A user can request money from someone by entering their email, a dollar amount, and a note. The system makes a request with a unique ID and a shareable link.

**Why this priority**: This is the core action — nothing works without it. It is the MVP.

**Independent Test**: Fill in email, amount ($25.00), note. Check that the request shows up in Outgoing tab with Pending status and a shareable link.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they enter a valid email (jane@example.com), amount ($50.00), and note ("Dinner"), **Then** a request is made with status "Pending", a unique ID, a shareable link, and expiry set to 7 days.
2. **Given** amount is $0 or negative, **Then** error: "Amount must be greater than zero".
3. **Given** amount is over $10,000, **Then** error: "Amount is too high. Max is $10,000".
4. **Given** bad email format, **Then** error: "Please enter a valid email".
5. **Given** user enters their own email, **Then** error: "You can't request money from yourself".
6. **Given** success, **Then** user sees a "Copy Link" button for the shareable URL.

---

### User Story 2 — Dashboard (Priority: P1)

A user sees all requests in two tabs: Incoming (from others) and Outgoing (sent by user). Each shows email, amount, date, and color status badge. User can filter by status and search by email.

**Why this priority**: Users need to see their requests to act on them.

**Acceptance Scenarios**:

1. **Given** 3 outgoing requests (1 pending, 1 paid, 1 declined), **Then** all show with correct badges — amber, green, red.
2. **Given** incoming requests, **Then** pending ones show Pay and Decline options.
3. **Given** user picks "Pending" filter, **Then** only pending requests show.
4. **Given** user types "jane" in search, **Then** only requests with "jane" in email show.
5. **Given** no requests, **Then** message: "No requests yet. Create your first one!"

---

### User Story 3 — Pay a Request (Priority: P1)

A receiver can pay a pending request. Click Pay → 2-3 second loading → success. Status changes to Paid on both sides.

**Why this priority**: Paying is the main action that closes the loop.

**Acceptance Scenarios**:

1. **Given** pending incoming request, **When** click Pay, **Then** loading overlay shows "Processing payment..." for 2-3 seconds.
2. **Given** payment done, **Then** success screen with checkmark and "Payment done!" message.
3. **Given** payment done, **Then** status is "Paid" with timestamp.
4. **Given** payment done, **When** sender checks their outgoing tab, **Then** it shows "Paid".
5. **Given** request is not pending, **When** user tries to pay, **Then** error message, no payment.

---

### User Story 4 — Decline and Cancel (Priority: P2)

A receiver can decline. A sender can cancel. Only works on pending requests.

**Acceptance Scenarios**:

1. **Given** pending incoming request, **When** click Decline, **Then** status changes to "Declined" + toast message.
2. **Given** pending outgoing request, **When** click Cancel, **Then** status changes to "Cancelled" + toast message.
3. **Given** paid/declined/expired request, **Then** no action buttons shown.

---

### User Story 5 — Expiry (Priority: P2)

Requests expire after 7 days. Detail page shows countdown. Expired requests can't be paid.

**Acceptance Scenarios**:

1. **Given** pending request made 2 days ago, **Then** detail shows "Expires in 5d Xh Ym".
2. **Given** request older than 7 days, **Then** status is "Expired".
3. **Given** expired request, **When** try to pay, **Then** error: "This request has expired".

---

### Edge Cases

- **Self-request** → error: "You can't request money from yourself"
- **Receiver has no account** → request made anyway; they see it when they sign up
- **Double-pay race condition** → API checks `WHERE status = 'pending'` before update — only first one wins
- **Expired pay attempt** → HTTP 410: "This request has expired"
- **Zero or negative amount** → HTTP 400: "Amount must be greater than zero"
- **Amount over $10,000** → HTTP 400: "Amount is too high"
- **Bad email** → HTTP 400: "Please enter a valid email"
- **Wrong user tries action** → HTTP 403: "You don't have access"
- **Request not found** → HTTP 404: "Request not found"

## Requirements

### Functional Requirements

- **FR-001**: Users can make payment requests with email, amount, and note
- **FR-002**: Amount must be positive, max 1,000,000 cents ($10,000)
- **FR-003**: Amounts stored as integers (cents) — never floats
- **FR-004**: Each request gets a unique UUID shareable link
- **FR-005**: Dashboard shows incoming and outgoing tabs
- **FR-006**: Filter by status (Pending, Paid, Declined, Expired, Cancelled)
- **FR-007**: Search by email
- **FR-008**: Payment simulation with 2-3 second delay
- **FR-009**: Only pending requests can be acted on
- **FR-010**: Only receiver can pay or decline
- **FR-011**: Only sender can cancel
- **FR-012**: Requests expire after 7 days
- **FR-013**: Countdown timer on detail page
- **FR-014**: Email + password auth (two test accounts)
- **FR-015**: Responsive on mobile, tablet, desktop
- **FR-016**: Public shareable link page

### Key Entities

- **Profile**: id (UUID, FK to auth.users), email, full_name, created_at
- **PaymentRequest**: id (UUID), sender_id (FK), recipient_email, amount (INTEGER, cents), currency (USD), note, status (enum: pending/paid/declined/expired/cancelled), shareable_link (UUID), expires_at, paid_at, declined_at, cancelled_at, created_at, updated_at

### API Contracts

| Method | Route | What | Auth | OK | Errors |
|--------|-------|------|------|-----|--------|
| POST | /api/requests | Make new request | Yes | 201 | 400, 401 |
| GET | /api/requests | List requests | Yes | 200 | 401 |
| GET | /api/requests/[id] | Get detail | Yes | 200 | 401, 403, 404 |
| PATCH | /api/requests/[id]/pay | Pay it | Yes | 200 | 400, 403, 404, 410 |
| PATCH | /api/requests/[id]/decline | Decline it | Yes | 200 | 400, 403, 404 |
| PATCH | /api/requests/[id]/cancel | Cancel it | Yes | 200 | 400, 403, 404 |
| GET | /api/requests/share/[link] | Public view | No | 200 | 404 |

**POST /api/requests body**: `{ recipient_email, amount (cents), note }`
**GET /api/requests params**: `direction`, `status`, `search`

## Success Criteria

- **SC-001**: Create a request in under 30 seconds
- **SC-002**: Payment simulation takes 2-3 seconds with visual feedback
- **SC-003**: Dashboard loads in under 2 seconds
- **SC-004**: All E2E tests pass with video
- **SC-005**: Works on mobile (375px)
- **SC-006**: Expired requests are blocked
- **SC-007**: Both test accounts can complete full flow

## Assumptions

- Modern browser (Chrome, Firefox, Safari, Edge)
- Valid email for login
- Internet needed (no offline)
- Payment is simulated — no real money
- Max $10,000 per request
- 7 day expiry
- USD only
- Receiver doesn't need an account to receive a request
