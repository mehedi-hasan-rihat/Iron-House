# Iron House — Gym Management System

A full-stack gym management platform built with **Next.js 16**, **Prisma 7**, **PostgreSQL**, and **Moneybag** payment gateway. Covers everything from public membership checkout to a role-based admin back-office.

---

## Live Features

### Public Website
- Animated landing page with GSAP scroll-driven hero, parallax, and SplitText reveals
- Membership pricing section that reads live plans from the database
- "Get Started" per plan — routes unauthenticated users through signup → checkout → payment

### Member Onboarding Flow
```
Landing page → Pick a plan
  → /signup  (create account: name, phone, email, password)
  → /checkout (plan summary + member info)
  → Moneybag hosted checkout (bKash, Nagad, card, etc.)
  → /payments/success (server-side payment verification)
  → /dashboard (membership active)
```

### Member Dashboard (`/dashboard`)
- Active membership card with days remaining and renewal date
- Recent payment history
- Full payment history page with status badges

### Admin Back-office (`/admin`)
- Role-based access control (owner, manager, receptionist, trainer, accountant)
- Member management — create, search, filter, view profiles
- Membership management — assign plans, track status, timeline events
- Payment records — list, filter by status, view details, refund actions
- Staff management — roles, designations, salary tracking
- Notification bell for system alerts
- Settings panel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 7 ORM |
| Auth | NextAuth.js v5 (JWT, credentials) |
| Payments | Moneybag Payment Gateway |
| Styling | Tailwind CSS v4 |
| Animations | GSAP 3 (SplitText, ScrollTrigger, MatchMedia) |
| UI Primitives | Radix UI, Lucide React |

---

## Architecture Highlights

**Multi-file Prisma schema** — split into domain files (`auth`, `members`, `memberships`, `payments`, `staff`, `supporting`) for maintainability.

**Role-based permissions** — every admin route is guarded by `requireStaff()` with a fine-grained permission matrix seeded into the database. Members can only access their own dashboard.

**Idempotent payment fulfillment** — Moneybag webhooks and success-page redirects both call the same `fulfillPayment()` function. Duplicate calls are safe — the function skips records already in a terminal state.

**Server-first data fetching** — pages fetch directly from Prisma in async Server Components. No client-side data fetching for authenticated pages.

---

## Project Structure

```
src/
├── app/
│   ├── (admin)/          # Role-guarded admin back-office
│   ├── (auth)/           # Login + signup pages
│   ├── (customer)/       # Member dashboard, payments, profile
│   ├── api/
│   │   ├── moneybag/     # Checkout session + IPN webhook
│   │   ├── members/      # Member CRUD
│   │   ├── payments/     # Payment records
│   │   └── ...
│   ├── checkout/         # Plan selection + pay button
│   └── payments/         # Success, failed, cancelled pages
├── components/
│   ├── admin/            # AdminShell, forms, tables
│   ├── customer/         # CustomerShell
│   ├── motion/           # GSAP wrappers (Reveal, CountUp, Stagger…)
│   └── *.tsx             # Landing page sections
├── lib/
│   ├── payments/
│   │   └── moneybag.ts   # createCheckout(), verifyPayment()
│   ├── auth-guard.ts
│   ├── id-generator.ts
│   └── prisma.ts
└── generated/prisma/     # Auto-generated Prisma client

prisma/schema/
├── base.prisma           # generator + datasource
├── auth.prisma           # User, Role, Permission
├── members.prisma        # Member
├── memberships.prisma    # MembershipPlan, Membership, Timeline
├── payments.prisma       # Payment, PaymentAttempt
├── staff.prisma          # Staff
└── supporting.prisma     # Document, Note, Notification, Counter
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Moneybag sandbox merchant ([create one](https://developers.moneybag.com.bd/sandbox))

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Fill in:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ironhouse"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
MONEYBAG_MERCHANT_KEY="your-sandbox-key"
MONEYBAG_BASE_URL="https://api.sandbox.moneybag.com.bd"
```

### Database

```bash
npx prisma db push
npx prisma db seed
```

Seed creates roles, permissions, membership plans, and an owner account:
```
Email:    owner@ironhouse.com
Password: admin123
```

### Dev server

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

---

## Payment Flow (Moneybag)

```
POST /api/moneybag/checkout
  → creates PENDING Payment + Membership in DB
  → calls Moneybag POST /api/v2/payments/checkout
  → returns checkout_url

Browser redirects to Moneybag hosted checkout
  → customer pays (bKash / Nagad / card)

Moneybag redirects to /payments/success?invoice=INV-xxx&transaction_id=txn_xxx
  → server calls GET /api/v2/payments/verify/{transaction_id}
  → fulfillPayment() updates Payment → PAID, Membership → ACTIVE

POST /api/moneybag/webhook (IPN)
  → same fulfillPayment() called again, safely skipped if already PAID
```

---

## License

Private project — all rights reserved.
