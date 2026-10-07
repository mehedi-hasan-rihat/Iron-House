# Product Requirements Document

**Product:** Iron House — Gym Management System  
**Market:** Single-gym, Bangladesh  
**Version:** 1.0

---

## Problem Statement

Gym operators in the Bangladesh market manage members through paper registers, WhatsApp, and spreadsheets. There is no unified system for tracking membership status, collecting payments through local gateways (bKash, Nagad), or sending automated reminders when memberships are about to expire. Members have no self-service view into their own account.

---

## Goals

1. Give gym staff a single interface to manage members, memberships, and payments.
2. Let members sign up and pay online without staff involvement.
3. Support local payment methods — bKash, Nagad — through Moneybag gateway.
4. Automate expiry tracking and reminders so nothing is missed.
5. Provide a public-facing marketing website with live pricing from the database.

---

## Users & Roles

| Role | Primary job | Access level |
|---|---|---|
| **Owner** | Business owner | Full access to everything |
| **Manager** | Day-to-day operations | Full except settings and role management |
| **Receptionist** | Front desk | View + create members, memberships, payments |
| **Trainer** | Personal training | View members and their own assigned memberships |
| **Accountant** | Financials | Payments, refunds, reports |
| **Member** | Gym member | Own dashboard only |

---

## Feature Areas

### 1. Public Website
- Animated landing page — hero, about, why us, trainers, facilities, gallery, testimonials, FAQ, contact
- Live membership plans pulled from the database
- Lead capture forms — "Join Now", "Free Trial", "Contact"
- Floating quick-action buttons — WhatsApp, Messenger, Call
- SEO fields — meta title, description, Open Graph, keywords

### 2. Member Onboarding (Self-service)
- Public signup with name, phone, email, password
- Plan selection on checkout page with full plan summary
- Payment through Moneybag (bKash, Nagad, card, bank)
- Automatic membership activation on payment confirmation
- Redirect to member dashboard on success

### 3. Member Dashboard (Customer Portal)
- Active membership card — plan name, days remaining, end date
- Membership status badge (ACTIVE / FROZEN / SUSPENDED / EXPIRED)
- Payment history with status badges and invoice download
- Profile edit — personal details, password change
- Notification center — expiry reminders, announcements

### 4. Admin — Member Management
- Paginated, searchable member list with status filter
- Member profile page — personal info, active membership, payment history, documents, notes
- Create member with all fields — name, phone, email, gender, DOB, address, blood group, medical info, emergency contact, profile photo
- Edit member details
- Status management — ACTIVE / SUSPENDED / FROZEN with side-effects:
  - Suspend: member barred, membership clock keeps running
  - Freeze: clock pauses, `endDate` extended on resume by exact freeze duration
  - Resume: restores ACTIVE status and extends endDate
- Internal notes (staff only)
- Document upload — NID, medical certificate, consent form

### 5. Admin — Membership Plans
- CRUD for plans with 9 types: DAILY, WEEKLY, MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY, PERSONAL_TRAINING, TRIAL, DAY_PASS
- Per-plan feature flags — gym access, group classes, personal trainer, locker, diet consult
- Activate / deactivate plans
- Trial and auto-renewal flags

### 6. Admin — Memberships
- Assign plan to member — start date, end date, trainer, discount
- Membership status timeline — every state change logged with actor and note
- Manual renewal
- Freeze / resume / cancel actions
- Expiry cron job marks memberships as EXPIRED daily

### 7. Admin — Payments
- Record cash, card, or gateway payment against a membership
- Moneybag online payment integration
- Auto-generated invoice numbers (INV-000001)
- PDF invoice and receipt generation and download
- Email receipt via Resend
- Payment attempt history for debugging failures
- Refund flow — marks payment REFUNDED and creates timeline entry
- Filter by status — PENDING, PAID, FAILED, REFUNDED

### 8. Admin — Staff
- Staff CRUD — name, designation, salary, joining date, role, status
- Status: ACTIVE / ON_LEAVE / SUSPENDED / RESIGNED
- Role assignment (links to permission matrix)
- Auto-generated staff IDs (STF-0001)

### 9. Admin — Reports
- Revenue report with date range and CSV/PDF export
- Membership report — active, expired, frozen counts
- Payment report — by method, by status
- KPI cards on dashboard — total members, active memberships, monthly revenue, expiring soon

### 10. Admin — Settings
- Gym info — name, address, phone, email, logo
- Branding — primary colour, banner image

### 11. Notifications & Reminders
- In-app notification bell (admin + member)
- Expiry reminders — 7 days, 3 days, 1 day before end
- Payment failure notification
- Gym announcements broadcast by admin
- Email via Resend
- SMS via BulkSMS BD (optional)

### 12. Landing Page CMS (Admin)
- Section-by-section editor for all public website content
- Hero, About, Why Us, Trainers, Facilities, Gallery, Testimonials, FAQ, Contact, SEO

---

## Non-functional Requirements

| Concern | Requirement |
|---|---|
| **Auth** | JWT-based session via NextAuth v5; passwords bcrypt-hashed |
| **Authorisation** | Every admin route guarded by role + permission check |
| **Payment security** | Merchant key never sent to browser; webhook verified server-side |
| **Idempotency** | Payment fulfillment safe to call multiple times |
| **Data integrity** | Membership status transitions validated server-side, not just client |
| **Performance** | Server Components — no client-side fetch on page load |
| **Mobile** | Responsive on all pages |
| **Deployment** | Vercel + Neon (managed PostgreSQL) |

---

## Out of Scope (v1)

- Mobile app (React Native)
- Multi-branch / multi-gym support
- Point-of-sale hardware integration
- Biometric check-in
- WhatsApp Business API automated messaging
- bKash / Nagad direct API (replaced by Moneybag aggregator)
