# Security

## Authentication

- **Provider:** NextAuth v5, credentials strategy (email + password)
- **Session:** JWT stored in a secure, HTTP-only cookie
- **Passwords:** bcrypt with cost factor 12 (`bcrypt.hash(password, 12)`)
- **Session shape:** `session.user` carries `id`, `role`, `memberId` — augmented via `next-auth.d.ts`

---

## Route Protection

Every protected page and API route performs an explicit auth check. There is no security through obscurity — middleware alone is not relied upon.

### Server Components / Pages

```ts
// Staff-only page
await requireStaff();

// Owner-only page
await requireOwner();
```

`requireAuth()` in `src/lib/auth-guard.ts` redirects to `/login` if no session, or `/unauthorized` if the role is not allowed.

### API Routes

Every route handler calls `auth()` from NextAuth before any data operation:

```ts
const session = await auth();
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

---

## Permission Matrix

Fine-grained module × action permissions are stored in the database and seeded from `DEFAULT_PERMISSIONS` in `src/lib/permissions.ts`. `hasPermission(roleId, module, action)` queries the DB at runtime.

Roles from least to most privileged: `member` → `trainer` → `receptionist` → `accountant` → `manager` → `owner`.

The `roles` module (permission matrix management) is owner-only by default.

---

## Payment Security

- The Moneybag `MONEYBAG_MERCHANT_KEY` is read from `process.env` server-side only — it never appears in client bundles or responses
- Webhook endpoint (`/api/moneybag/webhook`) processes IPN callbacks from Moneybag
- Payment fulfillment is **idempotent** — if a `Payment` record is already in a terminal state (`PAID`, `FAILED`, `CANCELLED`, `REFUNDED`), `fulfillPayment()` returns early without side effects, preventing double-fulfillment from race conditions between webhook and browser redirect

---

## Input Validation

### Server-side (API routes)

- Required fields checked explicitly before any DB operation
- `dob` validated with `isNaN(new Date(value).getTime())` before write — invalid dates return HTTP 400
- Status transitions validated against known enum values — unknown values return HTTP 400
- Prisma typed enums prevent out-of-range values reaching the database

### Client-side (forms)

Client validation runs before the network request and shows inline errors:

- DOB: invalid date check + future date check
- Required fields: HTML `required` attribute + server-side double-check

Client validation is a UX convenience, not a security boundary. All rules are enforced server-side.

---

## Data Handling

- Member PII (name, phone, DOB, medical info) is stored in PostgreSQL, not in session or local storage
- Prisma parameterised queries are used throughout — no raw string interpolation in SQL
- File uploads (profile photos, documents) should go to Cloudinary or S3 — URLs stored in DB, raw files never served through the app server

---

## Environment Variables

Secrets are never committed. Required variables:

```env
DATABASE_URL            # PostgreSQL connection string
NEXTAUTH_SECRET         # JWT signing secret — generate with: openssl rand -base64 32
NEXTAUTH_URL            # Full base URL (e.g. https://ironhouse.com)
MONEYBAG_MERCHANT_KEY   # Server-side only — never expose to client
MONEYBAG_BASE_URL       # Sandbox or production API base
```

Optional:
```env
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
BULKSMS_API_KEY
BULKSMS_SENDER_ID
```

See `.env.example` for the full list.

---

## Known Gaps (to address before production)

| Item | Risk | Recommendation |
|---|---|---|
| Moneybag webhook signature | Replay attacks if Moneybag signs payloads | Verify `X-Moneybag-Signature` header once Moneybag publishes signature docs |
| Rate limiting | Brute-force on `/login` | Add rate limiting middleware (e.g. `@upstash/ratelimit`) |
| File upload validation | Malicious files via document upload | Validate MIME type and size on upload; scan with Cloudinary or S3 policies |
| CSRF | Mutations via API routes use `fetch()` with JSON body | JSON content-type provides CSRF resistance; verify NextAuth CSRF token is enabled |
| Audit log | No record of who changed what | Add an `AuditLog` model for sensitive mutations (status changes, refunds) |
