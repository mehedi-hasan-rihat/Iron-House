<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Iron House — Agent Guide

## Project Docs

Before writing code, read the relevant doc:

| Task | Read first |
|---|---|
| Adding a page or API route | [docs/architecture.md](./docs/architecture.md) |
| Adding a feature | [docs/prd.md](./docs/prd.md) |
| Building a UI component | [docs/design-system.md](./docs/design-system.md) |
| Auth, permissions, payments, env vars | [docs/security.md](./docs/security.md) |

## Tech Stack

- **Framework:** Next.js (App Router, Server Components) — read `node_modules/next/dist/docs/` before using any Next.js API
- **ORM:** Prisma 7 — schema is split across `prisma/schema/*.prisma`; run `npx prisma generate` after schema changes
- **Auth:** NextAuth v5 — session accessed via `auth()` from `src/auth.ts`
- **Payments:** Moneybag gateway — `src/lib/payments/moneybag.ts`; merchant key is server-side only
- **Styling:** Tailwind CSS v4 — no `tailwind.config.js`; config is in `postcss.config.mjs`

## Key Conventions

### Route protection
Always call a guard at the top of protected Server Components:
```ts
await requireStaff();   // all admin pages
await requireOwner();   // owner-only pages
await requireAuth();    // any authenticated page
```

API routes check `auth()` directly:
```ts
const session = await auth();
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### API route wrapper
Wrap all route handlers with `apiHandler()` from `src/lib/api.ts` — it catches unhandled errors and returns a consistent JSON error shape.

### ID generation
Use helpers from `src/lib/id-generator.ts` — never generate IDs manually:
```ts
generateMemberId()      // GYM-0001
generateMembershipId()  // MEM-0001
generateInvoiceId()     // INV-000001
generateStaffId()       // STF-0001
```

### Prisma schema changes
1. Edit the relevant file in `prisma/schema/`
2. Run `npx prisma db push` (dev) or `npx prisma migrate dev` (tracked migration)
3. Run `npx prisma generate` to regenerate the client in `src/generated/prisma/`

### Design
Follow the tokens and patterns in `docs/design-system.md`. Use the existing `inputCls` constant, `Field` wrapper, and panel border pattern. Do not introduce new colour values or font sizes.

### Membership status transitions
Status changes have side-effects (freeze extends `endDate`, suspend does not). Always use the PATCH `/api/members/[id]` route with `body.status` for transitions — do not update status fields directly in ad-hoc Prisma calls.

### Date handling
- Always guard `DateTime?` fields: `date && !isNaN(date.getTime()) ? date.toISOString() : ""`
- Validate user-submitted date strings server-side: `isNaN(new Date(value).getTime())` → 400
- Treat empty string `""` as null when writing to DB

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npx prisma db push   # sync schema to DB (dev)
npx prisma generate  # regenerate Prisma client
npx prisma db seed   # seed roles, permissions, plans, owner account
npx prisma studio    # visual DB browser
```

## Seed credentials

```
Email:    owner@ironhouse.com
Password: admin123
```
