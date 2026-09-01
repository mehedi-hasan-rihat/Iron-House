# Gym Management System — Full Project Plan
**Single Gym · Bangladesh Market**

---

## Overview

A complete web-based gym management platform with admin panel, customer portal, and public landing page CMS. Built for Bangladesh market with local payment gateway support (bKash, Nagad, Rocket).

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15+ |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS v4 + shadcn/ui | latest |
| Database | PostgreSQL | 16+ |
| ORM | Prisma | 6+ |
| Auth | NextAuth v5 | 5+ |
| Payments | bKash API, Nagad API, SSL Commerz | — |
| File Storage | Cloudinary or AWS S3 | — |
| PDF | React-PDF / Puppeteer | — |
| Email | Resend | — |
| SMS | BulkSMS BD / Twilio | — |
| Charts | Recharts | — |
| Deployment | Vercel + Neon (PostgreSQL) | — |

---

## Database Schema

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String
  roleId     String
  role       Role     @relation(fields: [roleId], references: [id])
  member     Member?
  staff      Staff?
  createdAt  DateTime @default(now())
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique  // owner|manager|receptionist|trainer|accountant|member
  users       User[]
  permissions RolePermission[]
}

model Permission {
  id      String           @id @default(cuid())
  module  String           // members|plans|memberships|payments|staff|landing|reports|settings
  action  String           // view|create|edit|delete|export|refund
  roles   RolePermission[]
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}

model Member {
  id               String        @id @default(cuid())
  memberId         String        @unique  // auto: GYM-0001
  userId           String        @unique
  user             User          @relation(fields: [userId], references: [id])
  fullName         String
  gender           String
  dob              DateTime?
  phone            String
  email            String?
  address          String?
  bloodGroup       String?
  medicalInfo      String?
  emergencyContact String?
  profilePhoto     String?
  status           String        @default("active")  // active|suspended|frozen
  memberships      Membership[]
  payments         Payment[]
  documents        Document[]
  notes            MemberNote[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model MembershipPlan {
  id            String       @id @default(cuid())
  name          String
  description   String?
  durationDays  Int
  price         Decimal
  type          String       // daily|weekly|monthly|quarterly|half_yearly|yearly|pt|trial|day_pass
  features      Json         // { gymAccess, groupClasses, personalTrainer, locker, dietConsult }
  isActive      Boolean      @default(true)
  trialEnabled  Boolean      @default(false)
  autoRenewal   Boolean      @default(false)
  memberships   Membership[]
  createdAt     DateTime     @default(now())
}

model Membership {
  id                 String              @id @default(cuid())
  membershipNumber   String              @unique  // auto: MEM-0001
  memberId           String
  member             Member              @relation(fields: [memberId], references: [id])
  planId             String
  plan               MembershipPlan      @relation(fields: [planId], references: [id])
  trainerId          String?
  trainer            Staff?              @relation(fields: [trainerId], references: [id])
  startDate          DateTime
  endDate            DateTime
  amount             Decimal
  discount           Decimal             @default(0)
  tax                Decimal             @default(0)
  finalAmount        Decimal
  status             String              @default("pending")  // pending|active|frozen|expired|cancelled
  timeline           MembershipTimeline[]
  payments           Payment[]
  createdAt          DateTime            @default(now())
}

model MembershipTimeline {
  id           String     @id @default(cuid())
  membershipId String
  membership   Membership @relation(fields: [membershipId], references: [id])
  event        String     // created|activated|renewed|frozen|resumed|expired|cancelled
  note         String?
  createdBy    String?
  createdAt    DateTime   @default(now())
}

model Payment {
  id            String           @id @default(cuid())
  invoiceNumber String           @unique  // auto: INV-0001
  transactionId String?
  memberId      String
  member        Member           @relation(fields: [memberId], references: [id])
  membershipId  String?
  membership    Membership?      @relation(fields: [membershipId], references: [id])
  amount        Decimal
  discount      Decimal          @default(0)
  tax           Decimal          @default(0)
  totalAmount   Decimal
  method        String           // cash|card|bkash|nagad|rocket|bank
  status        String           @default("pending")  // pending|processing|paid|failed|cancelled|refunded
  paymentDate   DateTime?
  createdBy     String?
  attempts      PaymentAttempt[]
  createdAt     DateTime         @default(now())
}

model PaymentAttempt {
  id              String   @id @default(cuid())
  paymentId       String
  payment         Payment  @relation(fields: [paymentId], references: [id])
  attemptAt       DateTime @default(now())
  status          String
  failureReason   String?
  gatewayResponse Json?
}

model Staff {
  id          String       @id @default(cuid())
  staffId     String       @unique  // auto: STF-0001
  userId      String       @unique
  user        User         @relation(fields: [userId], references: [id])
  name        String
  photo       String?
  phone       String
  email       String?
  address     String?
  designation String
  roleId      String
  salary      Decimal?
  joiningDate DateTime
  status      String       @default("active")  // active|on_leave|suspended|resigned
  trainings   Membership[]
}

model Document {
  id        String   @id @default(cuid())
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id])
  type      String   // nid|medical_certificate|consent_form
  url       String
  createdAt DateTime @default(now())
}

model MemberNote {
  id        String   @id @default(cuid())
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id])
  note      String
  createdBy String?
  createdAt DateTime @default(now())
}

model LandingPage {
  id        String   @id @default(cuid())
  section   String   @unique  // hero|about|why_us|trainers|facilities|gallery|testimonials|faq|contact|seo
  content   Json
  isActive  Boolean  @default(true)
  updatedBy String?
  updatedAt DateTime @updatedAt
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // expiry_reminder|payment_failed|announcement
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── forgot-password/
│   │
│   ├── (admin)/
│   │   ├── layout.tsx              ← admin shell + sidebar
│   │   ├── dashboard/
│   │   ├── members/
│   │   │   ├── page.tsx            ← list + search + filter
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← member profile
│   │   │       ├── edit/
│   │   │       └── history/
│   │   ├── plans/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/edit/
│   │   ├── memberships/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── payments/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── staff/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/edit/
│   │   ├── roles/
│   │   │   └── page.tsx            ← permission matrix
│   │   ├── reports/
│   │   │   ├── revenue/
│   │   │   ├── memberships/
│   │   │   └── payments/
│   │   ├── landing/
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── trainers/
│   │   │   ├── gallery/
│   │   │   ├── testimonials/
│   │   │   ├── faq/
│   │   │   ├── contact/
│   │   │   └── seo/
│   │   └── settings/
│   │       ├── gym-info/
│   │       └── branding/
│   │
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── membership/
│   │   ├── payments/
│   │   │   └── [id]/retry/
│   │   └── profile/
│   │
│   ├── (public)/                   ← landing page (CMS-driven)
│   │   └── page.tsx
│   │
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── members/
│       ├── plans/
│       ├── memberships/
│       ├── payments/
│       ├── staff/
│       ├── reports/
│       ├── notifications/
│       └── webhooks/
│           ├── bkash/
│           └── nagad/
│
├── components/
│   ├── ui/                         ← shadcn base components
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── MemberForm.tsx
│   │   ├── PaymentForm.tsx
│   │   ├── MembershipForm.tsx
│   │   ├── PermissionMatrix.tsx
│   │   └── charts/
│   │       ├── RevenueChart.tsx
│   │       ├── MemberGrowthChart.tsx
│   │       └── PlanDistributionChart.tsx
│   ├── customer/
│   │   ├── MembershipCard.tsx
│   │   ├── PaymentHistory.tsx
│   │   └── ProfileForm.tsx
│   └── landing/
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Plans.tsx
│       ├── Trainers.tsx
│       ├── Gallery.tsx
│       ├── Testimonials.tsx
│       ├── FAQ.tsx
│       ├── Contact.tsx
│       └── FloatingButtons.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── permissions.ts
│   ├── id-generator.ts             ← GYM-0001, INV-0001 etc.
│   ├── pdf.ts                      ← receipt / invoice PDF
│   ├── email.ts                    ← Resend templates
│   ├── sms.ts                      ← BulkSMS BD
│   └── payments/
│       ├── bkash.ts
│       ├── nagad.ts
│       └── ssl-commerz.ts
│
├── hooks/
│   ├── usePermission.ts
│   ├── useMembers.ts
│   └── usePayments.ts
│
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

---

## Development Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Project setup (Next.js, Prisma, PostgreSQL, NextAuth)
- [ ] Database schema + migrations
- [ ] Seed data (roles, permissions, owner account)
- [ ] Auth system (login, logout, session, password reset)
- [ ] Role-based middleware + permission gates
- [ ] Admin shell layout (sidebar, header, breadcrumbs)

### Phase 2 — Member Management (Week 2–3)
- [ ] Member list (search, filter by status/plan, pagination)
- [ ] Add member form (photo upload, all fields)
- [ ] Member profile page
- [ ] Edit member
- [ ] Suspend / freeze / resume / delete
- [ ] Document upload (NID, medical, consent)
- [ ] Internal notes
- [ ] Member ID auto-generation (GYM-0001)

### Phase 3 — Plans & Memberships (Week 3–4)
- [ ] Membership plans CRUD (all 9 types)
- [ ] Feature toggles per plan
- [ ] Create membership (assign plan + trainer)
- [ ] Membership status management
- [ ] Manual renewal
- [ ] Renewal history timeline
- [ ] Membership number auto-generation (MEM-0001)
- [ ] Expiry cron job (mark expired daily)

### Phase 4 — Payments (Week 4–5)
- [ ] Record cash/card payment
- [ ] bKash payment integration
- [ ] Nagad payment integration
- [ ] SSL Commerz fallback
- [ ] Invoice number auto-generation (INV-0001)
- [ ] PDF invoice generation + download
- [ ] PDF receipt generation + download
- [ ] Email receipt (Resend)
- [ ] Payment attempt history
- [ ] Retry failed payment
- [ ] Refund flow
- [ ] Webhook handlers (bKash/Nagad callbacks)

### Phase 5 — Dashboard & Reports (Week 5–6)
- [ ] KPI cards (members, revenue, expiring)
- [ ] Revenue chart (daily/weekly/monthly toggle)
- [ ] Member growth chart
- [ ] Plan distribution pie chart
- [ ] New member chart
- [ ] Payment statistics
- [ ] Recent activity feed
- [ ] Quick action buttons
- [ ] Revenue report (date range, export CSV/PDF)
- [ ] Membership report
- [ ] Payment report

### Phase 6 — Staff & Permissions (Week 6–7)
- [ ] Staff CRUD
- [ ] Role assignment
- [ ] Staff status management
- [ ] Permission matrix UI (module × action grid)
- [ ] Custom role creation

### Phase 7 — Customer Portal (Week 7–8)
- [ ] Customer login (member account)
- [ ] Membership status dashboard
- [ ] Payment history
- [ ] Download invoice / receipt
- [ ] Retry failed payment
- [ ] Profile edit + password change
- [ ] Notification center

### Phase 8 — Notifications & Reminders (Week 8)
- [ ] Expiry reminder (7 days, 3 days, 1 day before)
- [ ] Payment failure notification
- [ ] Gym announcements (admin broadcast)
- [ ] Email templates (Resend)
- [ ] SMS reminders (BulkSMS BD) — optional

### Phase 9 — Landing Page CMS (Week 9)
- [ ] Hero section editor (title, subtitle, CTA, image)
- [ ] About / Mission / Vision editor
- [ ] Why Choose Us — feature cards CRUD
- [ ] Membership plans display (auto from DB)
- [ ] Trainers CRUD (photo, name, designation, bio)
- [ ] Facilities editor
- [ ] Gallery (image + video upload)
- [ ] Testimonials CRUD
- [ ] FAQ CRUD
- [ ] Contact info editor (phone, email, address, hours)
- [ ] Google Maps embed
- [ ] Lead forms (Join Now, Free Trial, Contact)
- [ ] Floating buttons (WhatsApp, Messenger, Call)
- [ ] SEO fields (meta title, description, OG, keywords)

### Phase 10 — QA, Polish & Deploy (Week 10)
- [ ] Mobile responsive QA (all pages)
- [ ] Permission QA (all roles)
- [ ] Payment flow end-to-end test
- [ ] PDF generation test
- [ ] Email/SMS delivery test
- [ ] Performance audit (Lighthouse)
- [ ] Security review (auth, SQL injection, file uploads)
- [ ] Environment variables setup
- [ ] Production deployment (Vercel + Neon)
- [ ] Staff training session

---

## Auto-generated ID Format

| Entity | Format | Example |
|---|---|---|
| Member | `GYM-XXXX` | GYM-0001 |
| Membership | `MEM-XXXX` | MEM-0001 |
| Invoice | `INV-XXXX` | INV-0001 |
| Staff | `STF-XXXX` | STF-0001 |

---

## Roles & Default Permissions

| Module | Owner | Manager | Receptionist | Trainer | Accountant | Member |
|---|---|---|---|---|---|---|
| Dashboard | ✅ full | ✅ full | ✅ view | ✅ view | ✅ view | ✅ own |
| Members | ✅ full | ✅ full | ✅ view+create | ❌ | ❌ | ✅ own |
| Plans | ✅ full | ✅ full | ✅ view | ❌ | ✅ view | ✅ view |
| Memberships | ✅ full | ✅ full | ✅ view+create | ✅ view | ✅ view | ✅ own |
| Payments | ✅ full | ✅ full | ✅ view+create | ❌ | ✅ full | ✅ own |
| Staff | ✅ full | ✅ view | ❌ | ❌ | ❌ | ❌ |
| Landing | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ |
| Reports | ✅ full | ✅ full | ❌ | ❌ | ✅ full | ❌ |
| Settings | ✅ full | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## BD Pricing Estimate

| Package | Scope | Price (BDT) |
|---|---|---|
| Basic | Members + Payments + Dashboard | ৳60,000 – ৳80,000 |
| Standard | Full system (all 10 phases) | ৳1,20,000 – ৳1,80,000 |
| Premium | Full + Mobile App (React Native) | ৳2,00,000 – ৳3,00,000 |
| Maintenance | Monthly support + updates | ৳5,000 – ৳10,000/mo |

**Extra charges:**
- bKash/Nagad live integration (requires business registration): ৳15,000 – ৳20,000 extra
- SMS gateway setup: ৳5,000 extra
- Hosting + domain setup (1 year): ৳8,000 – ৳15,000
- Staff training (2 sessions): ৳5,000

**Timeline:** 10 weeks solo · 6 weeks with 2 devs

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# bKash
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_BASE_URL=

# Nagad
NAGAD_MERCHANT_ID=
NAGAD_MERCHANT_KEY=
NAGAD_BASE_URL=

# Email
RESEND_API_KEY=

# SMS
BULKSMS_API_KEY=
BULKSMS_SENDER_ID=
```

---

*Plan version: 1.0 · Last updated: 2026*
