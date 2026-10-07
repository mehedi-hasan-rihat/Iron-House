# Architecture

## Overview

Iron House is a server-first Next.js application. Pages are async Server Components that query Prisma directly — no separate REST layer for page rendering. REST API routes exist only for client-side mutations (forms, admin actions).

---

## Request Flow

### Public checkout (unauthenticated member)
```
/ (landing)
  → /checkout?plan=<id>          Server Component — reads plan from DB
  → POST /api/moneybag/checkout  Creates PENDING Payment + Membership
  → Moneybag hosted checkout     External — bKash, Nagad, card, etc.
  → /payments/success?invoice=INV-xxx&transaction_id=txn_xxx
      verifyPayment() → fulfillPayment()
      Payment → PAID, Membership → ACTIVE
  → /dashboard
```

### IPN (webhook) path
```
POST /api/moneybag/webhook
  → same fulfillPayment() as above
  → idempotent — skipped if Payment already in terminal state
```

### Admin page request
```
Browser → Next.js Server Component
  → requireStaff() checks NextAuth session + role
  → prisma.model.find...()     direct DB query, no HTTP hop
  → renders HTML with data embedded
```

### Admin mutation
```
Admin form submit → fetch() → /api/<resource>/[id]
  → auth() check in route handler
  → prisma.model.update/create/delete
  → JSON response → React state update
```

---

## Directory Layout

```
src/
├── app/
│   ├── (admin)/              Role-guarded admin back-office
│   │   └── admin/
│   │       ├── dashboard/    KPI overview
│   │       ├── members/      CRUD + profiles
│   │       ├── memberships/  Assign plans, manage status
│   │       ├── payments/     Records, refunds
│   │       ├── plans/        Membership plan CRUD
│   │       ├── staff/        Staff CRUD
│   │       ├── roles/        Permission matrix
│   │       ├── reports/      Revenue, memberships, payments
│   │       └── settings/     Gym info, branding
│   ├── (auth)/               Login, signup
│   ├── (customer)/           Member dashboard, payments, profile
│   ├── api/
│   │   ├── auth/             NextAuth handler + signup
│   │   ├── members/          GET/POST list, GET/PATCH/DELETE by ID
│   │   │   └── [id]/notes/   POST (add note), GET (list), DELETE by noteId
│   │   ├── memberships/      GET/POST list, GET/PATCH by ID
│   │   ├── payments/         GET/POST list, GET/PATCH by ID
│   │   ├── plans/            GET/POST list, GET/PATCH/DELETE by ID
│   │   ├── staff/            GET/POST list, GET/PATCH/DELETE by ID
│   │   ├── notifications/    GET/PATCH (mark read)
│   │   ├── moneybag/
│   │   │   ├── checkout/     POST — initiate Moneybag session
│   │   │   └── webhook/      POST — IPN callback
│   │   └── cron/             GET — daily expiry job
│   ├── checkout/             Plan summary + pay button
│   ├── payments/
│   │   ├── success/          Post-payment verification page
│   │   ├── failed/
│   │   └── cancelled/
│   └── site/                 Public landing page
├── components/
│   ├── admin/                AdminShell, DataTable, all admin forms
│   ├── customer/             CustomerShell
│   ├── motion/               GSAP wrappers (Reveal, CountUp, Stagger…)
│   └── *.tsx                 Landing page sections
├── lib/
│   ├── api.ts                apiHandler() wrapper — error boundary
│   ├── auth-guard.ts         requireAuth/requireStaff/requireAdmin/requireOwner
│   ├── id-generator.ts       GYM-xxxx, MEM-xxxx, INV-xxxxxx, STF-xxxx
│   ├── permissions.ts        hasPermission(), getRolePermissions(), DEFAULT_PERMISSIONS
│   ├── prisma.ts             Singleton PrismaClient
│   └── payments/
│       └── moneybag.ts       createCheckout(), verifyPayment()
├── types/
│   └── next-auth.d.ts        Session type augmentation
└── generated/prisma/         Auto-generated Prisma client (do not edit)

prisma/
├── schema/
│   ├── base.prisma           generator + datasource
│   ├── auth.prisma           User, Role, Permission, RolePermission
│   ├── members.prisma        Member, MemberStatus enum
│   ├── memberships.prisma    MembershipPlan, Membership, MembershipTimeline, enums
│   ├── payments.prisma       Payment, PaymentAttempt, enums
│   ├── staff.prisma          Staff, StaffStatus enum
│   └── supporting.prisma     Document, MemberNote, Notification, Counter
└── seed.ts                   Roles, permissions, plans, owner account
```

---

## Auth & Guards

NextAuth v5 with JWT strategy and credentials provider. Session carries `user.id`, `user.role`, and `user.memberId`.

Guard helpers in `src/lib/auth-guard.ts`:

| Helper | Allowed roles |
|---|---|
| `requireAuth(roles?)` | Base — redirects to `/login` if unauthenticated |
| `requireStaff()` | owner, manager, receptionist, trainer, accountant |
| `requireAdmin()` | owner, manager |
| `requireOwner()` | owner only |

Members are redirected to `/dashboard`. Staff to `/admin/dashboard`. Suspended members to `/suspended`.

---

## Permissions

Fine-grained module × action matrix stored in the database and seeded via `DEFAULT_PERMISSIONS` in `src/lib/permissions.ts`.

Modules: `dashboard` · `members` · `plans` · `memberships` · `payments` · `staff` · `roles` · `reports` · `settings`

Actions: `view` · `create` · `edit` · `delete` · `export` · `refund`

---

## Database Schema Summary

The schema is split into domain files under `prisma/schema/`. Key relationships:

```
User ──1:1── Member ──1:N── Membership ──N:1── MembershipPlan
User ──1:1── Staff
Member ──1:N── Payment
Membership ──1:N── Payment
Membership ──1:N── MembershipTimeline
Payment ──1:N── PaymentAttempt
Member ──1:N── Document
Member ──1:N── MemberNote
Role ──N:N── Permission (via RolePermission)
```

---

## Payment Architecture

All payment logic lives in `src/lib/payments/moneybag.ts`. The gateway is Moneybag (Bangladesh) — a single integration that routes internally to bKash, Nagad, card, etc.

Two entry points call `fulfillPayment()`:
1. `/payments/success` — browser redirect after payment
2. `/api/moneybag/webhook` — Moneybag IPN callback

Both are idempotent: if the Payment is already `PAID`, the function returns early without side effects.

---

## Membership Lifecycle

```
PENDING → ACTIVE   (payment confirmed)
ACTIVE  → FROZEN   (member requests pause — clock stops, endDate extended on resume)
ACTIVE  → SUSPENDED (admin action — clock keeps running)
ACTIVE  → EXPIRED  (cron job at /api/cron runs daily)
ACTIVE  → CANCELLED
FROZEN  → ACTIVE   (resume — endDate extended by freeze duration)
SUSPENDED → ACTIVE (reactivated by admin)
```

Every transition writes a `MembershipTimeline` record with the actor and optional note.

---

## ID Generation

Atomic counter increments via the `Counter` table (Prisma `upsert`):

| Entity | Format | Counter key |
|---|---|---|
| Member | `GYM-0001` | `member_id` |
| Membership | `MEM-0001` | `membership_id` |
| Invoice | `INV-000001` (6 digits) | `invoice_id` |
| Staff | `STF-0001` | `staff_id` |

---

## Cron Job

`GET /api/cron/route.ts` — intended to be called daily by Vercel Cron or an external scheduler. Marks memberships with `endDate < now` and status `ACTIVE` as `EXPIRED`, and updates the linked member status accordingly.
