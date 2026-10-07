# Members Module

## Overview

Covers the full lifecycle of a gym member — creation, profile management, status transitions, and internal staff notes.

---

## Pages

| Route | Component | Description |
|---|---|---|
| `/admin/members` | `members/page.tsx` | Paginated list with search and status filter |
| `/admin/members/new` | `members/new/page.tsx` | Create member form |
| `/admin/members/[id]` | `members/[id]/page.tsx` | Full profile — details, memberships, payments, notes |
| `/admin/members/[id]/edit` | `members/[id]/edit/page.tsx` | Edit member details |

---

## API Routes

### `GET /api/members`
List members. Supports query params:
- `search` — matches fullName, phone, email, memberId (case-insensitive)
- `status` — `ACTIVE` | `SUSPENDED` | `FROZEN`
- `page` (default 1), `limit` (default 20, max 100)

Returns `{ members, total, page, limit }`.

### `POST /api/members`
Create a member. Also creates a linked `User` with the `member` role.

Required fields: `fullName`, `phone`

Optional: `email`, `gender`, `dob` (ISO date string), `address`, `bloodGroup`, `medicalInfo`, `emergencyContact`, `password` (defaults to `"member123"`)

Auto-generates `memberId` (GYM-xxxx).

### `GET /api/members/[id]`
Fetch a single member with full includes: memberships (with plan + trainer), last 10 payments, all documents, all notes.

### `PATCH /api/members/[id]`
Two modes depending on body:

**Status transition** — send `{ status: "ACTIVE" | "SUSPENDED" | "FROZEN", note?: string }`:
- `SUSPENDED` — blocks entry, membership clock keeps running. Writes a `MembershipTimeline` entry.
- `FROZEN` — pauses membership clock. Writes timeline entry with `frozenAt` timestamp.
- `ACTIVE` — reactivates. If coming from `FROZEN`, extends membership `endDate` by the exact freeze duration.

**Field update** — send any subset of: `fullName`, `phone`, `email`, `gender`, `dob`, `address`, `bloodGroup`, `medicalInfo`, `emergencyContact`

`dob` rules:
- Empty string `""` → clears the field (sets `null`)
- Invalid date string → returns 400 `"Invalid date of birth."`
- Future date → rejected client-side before request is sent

### `DELETE /api/members/[id]`
Hard delete the member record (cascades to memberships, payments, notes, documents via Prisma `onDelete: Cascade`).

---

## Notes API

### `POST /api/members/[id]/notes`
Add an internal staff note.

Body: `{ note: string }`

Saves `createdBy` from the session email. Returns the created `MemberNote`.

### `GET /api/members/[id]/notes`
Returns all notes for the member, ordered newest first.

### `DELETE /api/members/[id]/notes/[noteId]`
Delete a single note by ID.

---

## Components

### `MemberForm` (`src/components/admin/MemberForm.tsx`)
Used for both create and edit. Client component with local state.

- Validates `dob` before submit — invalid date and future date both show an inline field error under the date input
- On edit, sends `PATCH`; on create, sends `POST`
- Empty `dob` sends `""` which the API maps to `null`

### `MemberNotes` (`src/components/admin/MemberNotes.tsx`)
Client component rendered on the member profile page.

- Receives `initialNotes` from the Server Component (serialised with `.toISOString()`)
- Add note: inline text input + submit → `POST /api/members/[id]/notes` → prepends to local state
- Delete note: trash icon → `DELETE /api/members/[id]/notes/[noteId]` → removes from local state
- No page reload needed — all updates are optimistic local state

---

## Schema

```prisma
// prisma/schema/members.prisma

model Member {
  id               String       @id @default(cuid())
  memberId         String       @unique          // GYM-0001
  userId           String       @unique
  user             User         @relation(...)
  fullName         String
  gender           String?
  dob              DateTime?
  phone            String
  email            String?
  address          String?
  bloodGroup       String?
  medicalInfo      String?
  emergencyContact String?
  profilePhoto     String?
  status           MemberStatus @default(ACTIVE)
  memberships      Membership[]
  payments         Payment[]
  documents        Document[]   // schema only — upload UI not yet built
  notes            MemberNote[] // ✅ functional
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
}

enum MemberStatus {
  ACTIVE
  SUSPENDED
  FROZEN
}

// prisma/schema/supporting.prisma

model MemberNote {
  id        String   @id @default(cuid())
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  note      String
  createdBy String?  // staff email from session
  createdAt DateTime @default(now())
}
```

---

## Not Yet Built

| Feature | Notes |
|---|---|
| Document upload | Schema exists (`Document` model), no API or UI yet — needs file storage (Cloudinary / S3) |
| Profile photo upload | `profilePhoto String?` field exists, no upload UI |
| Member ID card / PDF export | Planned in Phase 4 |
