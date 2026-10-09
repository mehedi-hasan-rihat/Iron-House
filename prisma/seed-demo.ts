/**
 * prisma/seed-demo.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Realistic demo data for Iron House Gym.
 * Includes: staff, members, memberships, payments, notes, comments, notifications.
 *
 * Run: npm run db:seed:demo
 *
 * WARNING: This seeds ON TOP of existing data (uses skipDuplicates / upsert).
 *          Run `npm run db:seed` first to ensure roles + plans + owner exist.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter });
const hash    = (p: string) => bcrypt.hash(p, 10);

// ── helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number)   { const d = new Date(); d.setDate(d.getDate() - n); return d; }
function daysFromNow(n: number){ const d = new Date(); d.setDate(d.getDate() + n); return d; }
function monthsAgo(n: number) { const d = new Date(); d.setMonth(d.getMonth() - n); return d; }
function pick<T>(arr: T[])    { return arr[Math.floor(Math.random() * arr.length)]; }

// Sequential ID counters (offset high so they don't clash with seed.ts counters)
let memberCounter     = 50;
let membershipCounter = 50;
let invoiceCounter    = 50;
let staffCounter      = 10;

function nextMemberId()     { return `GYM-${String(++memberCounter).padStart(4, "0")}`; }
function nextMembershipId() { return `MEM-${String(++membershipCounter).padStart(4, "0")}`; }
function nextInvoiceId()    { return `INV-${String(++invoiceCounter).padStart(6, "0")}`; }
function nextStaffId()      { return `STF-${String(++staffCounter).padStart(4, "0")}`; }

// ── raw data ───────────────────────────────────────────────────────────────

const STAFF_DATA = [
  { name: "Mahbubur Rahman",    phone: "01711111001", designation: "Manager",      role: "manager",      salary: 35000, joiningDate: monthsAgo(18) },
  { name: "Farzana Akter",      phone: "01711111002", designation: "Receptionist", role: "receptionist", salary: 18000, joiningDate: monthsAgo(14) },
  { name: "Rafiqul Islam",      phone: "01711111003", designation: "Trainer",       role: "trainer",      salary: 22000, joiningDate: monthsAgo(10) },
  { name: "Nazmun Nahar",       phone: "01711111004", designation: "Trainer",       role: "trainer",      salary: 22000, joiningDate: monthsAgo(8)  },
  { name: "Shakil Ahmed",       phone: "01711111005", designation: "Accountant",    role: "accountant",   salary: 28000, joiningDate: monthsAgo(12) },
];

const MEMBER_DATA = [
  // Active members with full profiles
  { name: "Rahim Uddin",        phone: "01811110001", gender: "Male",   dob: new Date("1990-03-15"), address: "Mirpur-10, Dhaka",     bloodGroup: "B+",  emergency: "Karim Uddin · 01911110001"  },
  { name: "Sumaiya Begum",      phone: "01811110002", gender: "Female", dob: new Date("1995-07-22"), address: "Dhanmondi, Dhaka",     bloodGroup: "A+",  emergency: "Rafiq Hossain · 01911110002" },
  { name: "Jakir Hossain",      phone: "01811110003", gender: "Male",   dob: new Date("1988-11-05"), address: "Uttara Sector 4",      bloodGroup: "O+",  emergency: "Nasrin Akter · 01911110003"  },
  { name: "Tasnim Rahman",      phone: "01811110004", gender: "Female", dob: new Date("1998-01-30"), address: "Banani, Dhaka",        bloodGroup: "AB+", emergency: "Lutfur Rahman · 01911110004" },
  { name: "Mizanur Rahman",     phone: "01811110005", gender: "Male",   dob: new Date("1985-09-18"), address: "Rampura, Dhaka",       bloodGroup: "A-",  emergency: "Selina Begum · 01911110005"  },
  { name: "Nusrat Jahan",       phone: "01811110006", gender: "Female", dob: new Date("2000-05-12"), address: "Mohammadpur, Dhaka",   bloodGroup: "B-",  emergency: "Jamal Hossain · 01911110006" },
  { name: "Arif Billah",        phone: "01811110007", gender: "Male",   dob: new Date("1993-08-25"), address: "Gulshan-2, Dhaka",     bloodGroup: "O-",  emergency: "Shahina Akter · 01911110007" },
  { name: "Kaniz Fatema",       phone: "01811110008", gender: "Female", dob: new Date("1996-12-03"), address: "Bashundhara R/A",      bloodGroup: "AB-", emergency: "Mosharraf Ali · 01911110008" },
  { name: "Shahriar Kabir",     phone: "01811110009", gender: "Male",   dob: new Date("1991-04-17"), address: "Tejgaon, Dhaka",       bloodGroup: "B+",  emergency: "Runa Khatun · 01911110009"   },
  { name: "Mitu Akter",         phone: "01811110010", gender: "Female", dob: new Date("1997-06-28"), address: "Shyamoli, Dhaka",      bloodGroup: "A+",  emergency: "Faruk Ahmed · 01911110010"   },
  { name: "Imran Hossain",      phone: "01811110011", gender: "Male",   dob: new Date("1987-02-14"), address: "Khilgaon, Dhaka",      bloodGroup: "O+",  emergency: "Jamila Khatun · 01911110011" },
  { name: "Sadia Islam",        phone: "01811110012", gender: "Female", dob: new Date("1999-10-09"), address: "Azimpur, Dhaka",       bloodGroup: "B+",  emergency: "Nurul Islam · 01911110012"   },
  { name: "Tanvir Ahmed",       phone: "01811110013", gender: "Male",   dob: new Date("1994-07-31"), address: "Lalbagh, Dhaka",       bloodGroup: "A+",  emergency: "Rahela Begum · 01911110013"  },
  { name: "Shirin Akter",       phone: "01811110014", gender: "Female", dob: new Date("1992-03-22"), address: "Jatrabari, Dhaka",     bloodGroup: "AB+", emergency: "Khorshed Alam · 01911110014" },
  { name: "Rubel Miah",         phone: "01811110015", gender: "Male",   dob: new Date("1986-12-07"), address: "Demra, Dhaka",         bloodGroup: "O+",  emergency: "Hasina Begum · 01911110015"  },
  // Expiring soon
  { name: "Nasrin Sultana",     phone: "01811110016", gender: "Female", dob: new Date("1993-05-19"), address: "Paltan, Dhaka",        bloodGroup: "A-",  emergency: "Khokon Mia · 01911110016"    },
  { name: "Fahim Hassan",       phone: "01811110017", gender: "Male",   dob: new Date("1990-08-11"), address: "Motijheel, Dhaka",     bloodGroup: "B+",  emergency: "Moriam Akter · 01911110017"  },
  // Frozen
  { name: "Sabina Yasmin",      phone: "01811110018", gender: "Female", dob: new Date("1989-01-25"), address: "Wari, Dhaka",          bloodGroup: "O-",  emergency: "Tofazzal Hossain · 01911110018" },
  // Suspended
  { name: "Dulal Mia",          phone: "01811110019", gender: "Male",   dob: new Date("1984-09-03"), address: "Kotwali, Dhaka",       bloodGroup: "A+",  emergency: "Champa Begum · 01911110019"  },
  // Expired membership
  { name: "Runa Laila",         phone: "01811110020", gender: "Female", dob: new Date("1995-11-14"), address: "Sutrapur, Dhaka",      bloodGroup: "B-",  emergency: "Mofiz Uddin · 01911110020"   },
];

const MEMBER_NOTES: Record<number, string[]> = {
  0:  ["Prefers morning sessions 6-8am", "Allergic to latex gloves"],
  2:  ["Has knee injury — avoid heavy squats"],
  5:  ["Wants to gain 5kg muscle in 3 months"],
  8:  ["Corporate client — invoice to Apex Group"],
  11: ["Referred by Rahim Uddin (GYM-0051)"],
  16: ["Contacted for renewal — no response yet"],
};

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding demo data...\n");

  // ── Fetch roles & plans (must already exist from seed.ts) ────────────────
  const roles = await prisma.role.findMany();
  const roleMap = Object.fromEntries(roles.map((r) => [r.name, r]));

  const plans = await prisma.membershipPlan.findMany({ where: { isActive: true } });
  if (plans.length === 0) throw new Error("No plans found. Run `npm run db:seed` first.");

  const planMap = Object.fromEntries(plans.map((p) => [p.type, p]));
  const monthlyPlan    = planMap["MONTHLY"]    ?? plans[0];
  const quarterlyPlan  = planMap["QUARTERLY"]  ?? plans[0];
  const halfYearlyPlan = planMap["HALF_YEARLY"] ?? plans[0];
  const yearlyPlan     = planMap["YEARLY"]      ?? plans[0];

  // ── Reset demo counters to avoid clashes ─────────────────────────────────
  await prisma.counter.upsert({
    where:  { id: "member_id"     }, update: { value: 50 }, create: { id: "member_id",     value: 50 },
  });
  await prisma.counter.upsert({
    where:  { id: "membership_id" }, update: { value: 50 }, create: { id: "membership_id", value: 50 },
  });
  await prisma.counter.upsert({
    where:  { id: "invoice_id"    }, update: { value: 50 }, create: { id: "invoice_id",    value: 50 },
  });
  await prisma.counter.upsert({
    where:  { id: "staff_id"      }, update: { value: 10 }, create: { id: "staff_id",      value: 10 },
  });

  // ────────────────────────────────────────────────────────────────────────
  // STAFF
  // ────────────────────────────────────────────────────────────────────────
  console.log("👥 Creating staff...");
  const staffMap: Record<string, { id: string; name: string }> = {};

  for (const s of STAFF_DATA) {
    const email = `${s.name.toLowerCase().replace(/\s+/g, ".")}@ironhouse.com`.toLowerCase();
    const staffId = nextStaffId();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const staff = await prisma.staff.findUnique({ where: { userId: existing.id } });
      if (staff) { staffMap[s.role] = { id: staff.id, name: s.name }; continue; }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await hash("staff123"),
        roleId:   roleMap[s.role].id,
        staff: {
          create: {
            staffId,
            name:        s.name,
            phone:       s.phone,
            designation: s.designation,
            salary:      s.salary,
            joiningDate: s.joiningDate,
            status:      "ACTIVE",
          },
        },
      },
      include: { staff: true },
    });
    if (user.staff) staffMap[s.role] = { id: user.staff.id, name: s.name };
    console.log(`  ✅ ${s.designation}: ${s.name}`);
  }

  const trainerIds = STAFF_DATA
    .filter((s) => s.role === "trainer")
    .map((s) => staffMap[s.role]?.id)
    .filter(Boolean) as string[];
  void trainerIds; // collected for reference, trainers fetched below

  const allStaff = await prisma.staff.findMany({
    include: { user: { include: { role: true } } },
    where:   { user: { role: { name: "trainer" } } },
  });
  const trainers = allStaff.map((s) => ({ id: s.id, name: s.name }));

  // ────────────────────────────────────────────────────────────────────────
  // MEMBERS + MEMBERSHIPS + PAYMENTS
  // ────────────────────────────────────────────────────────────────────────
  console.log("\n🏋️ Creating members...");

  const createdMembers: Array<{ id: string; userId: string; name: string; idx: number }> = [];

  for (let i = 0; i < MEMBER_DATA.length; i++) {
    const m = MEMBER_DATA[i];
    const email    = `${m.name.toLowerCase().replace(/\s+/g, ".")}@example.com`.toLowerCase();
    const memberId = nextMemberId();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const mem = await prisma.member.findUnique({ where: { userId: existing.id } });
      if (mem) { createdMembers.push({ id: mem.id, userId: existing.id, name: m.name, idx: i }); continue; }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await hash("member123"),
        roleId:   roleMap["member"].id,
        member: {
          create: {
            memberId,
            fullName:        m.name,
            phone:           m.phone,
            gender:          m.gender,
            dob:             m.dob,
            address:         m.address,
            bloodGroup:      m.bloodGroup,
            emergencyContact: m.emergency,
            status: i === 18 ? "SUSPENDED" : i === 17 ? "FROZEN" : "ACTIVE",
          },
        },
      },
      include: { member: true },
    });

    if (user.member) {
      createdMembers.push({ id: user.member.id, userId: user.id, name: m.name, idx: i });
    }
    console.log(`  ✅ Member: ${m.name}`);
  }

  // ────────────────────────────────────────────────────────────────────────
  // MEMBERSHIPS & PAYMENTS per member
  // ────────────────────────────────────────────────────────────────────────
  console.log("\n📋 Creating memberships & payments...");

  // Plan assignment per member index
  const planFor = (i: number) => {
    if (i < 5)  return yearlyPlan;
    if (i < 10) return halfYearlyPlan;
    if (i < 15) return quarterlyPlan;
    return monthlyPlan;
  };

  const methodPool: Array<"CASH" | "BKASH" | "NAGAD" | "CARD" | "ROCKET" | "BANK_TRANSFER"> =
    ["CASH", "CASH", "CASH", "BKASH", "BKASH", "NAGAD", "CARD", "ROCKET"];

  for (const cm of createdMembers) {
    const i     = cm.idx;
    const plan  = planFor(i);
    const price = Number(plan.price);

    // Determine membership scenario
    let startDate: Date;
    let endDate:   Date;
    let msStatus:  "ACTIVE" | "EXPIRED" | "FROZEN" | "CANCELLED" | "PENDING";
    let payStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
    let historyMonths = 0; // how many historical renewals

    if (i < 3) {
      // Long-term active — 2 past renewals
      startDate    = monthsAgo(plan.durationDays / 30);
      endDate      = daysFromNow(plan.durationDays - 15);
      msStatus     = "ACTIVE";
      payStatus    = "PAID";
      historyMonths = 2;
    } else if (i < 12) {
      // Normal active
      startDate = monthsAgo(1);
      endDate   = daysFromNow(plan.durationDays - 30);
      msStatus  = "ACTIVE";
      payStatus = "PAID";
      historyMonths = pick([0, 1]);
    } else if (i === 15 || i === 16) {
      // Expiring in 3-5 days
      startDate = daysAgo(plan.durationDays - pick([3, 4, 5]));
      endDate   = daysFromNow(pick([3, 4, 5]));
      msStatus  = "ACTIVE";
      payStatus = "PAID";
    } else if (i === 17) {
      // Frozen
      startDate = monthsAgo(1);
      endDate   = daysFromNow(45);
      msStatus  = "FROZEN";
      payStatus = "PAID";
    } else if (i === 18) {
      // Suspended — membership still active
      startDate = monthsAgo(1);
      endDate   = daysFromNow(20);
      msStatus  = "ACTIVE";
      payStatus = "PAID";
    } else if (i === 19) {
      // Expired
      startDate = monthsAgo(3);
      endDate   = daysAgo(15);
      msStatus  = "EXPIRED";
      payStatus = "PAID";
    } else {
      startDate = monthsAgo(1);
      endDate   = daysFromNow(plan.durationDays - 30);
      msStatus  = "ACTIVE";
      payStatus = "PAID";
    }

    // Historical memberships first
    for (let h = historyMonths; h > 0; h--) {
      const hStart = new Date(startDate); hStart.setMonth(hStart.getMonth() - h * (plan.durationDays / 30));
      const hEnd   = new Date(hStart);    hEnd.setDate(hEnd.getDate() + plan.durationDays);
      const msNum  = nextMembershipId();
      const invNum = nextInvoiceId();
      const trainer = i < 8 ? pick(trainers) : null;

      const discount  = i % 5 === 0 ? 200 : 0;
      const finalAmt  = price - discount;
      const payDate   = new Date(hStart); payDate.setDate(payDate.getDate() + 1);

      const histMs = await prisma.membership.create({
        data: {
          membershipNumber: msNum,
          memberId:  cm.id,
          planId:    plan.id,
          trainerId: trainer?.id ?? null,
          startDate: hStart, endDate: hEnd,
          amount:     price, discount, tax: 0, finalAmount: finalAmt,
          status: "EXPIRED",
          timeline: { create: [
            { event: "CREATED",   createdBy: "system", createdAt: hStart },
            { event: "ACTIVATED", createdBy: "receptionist@ironhouse.com", createdAt: hStart, note: "Payment confirmed" },
            { event: "EXPIRED",   createdBy: "system", createdAt: hEnd },
          ]},
        },
      });

      await prisma.payment.create({
        data: {
          invoiceNumber: invNum,
          memberId:      cm.id,
          membershipId:  histMs.id,
          amount:        price, discount, tax: 0, totalAmount: finalAmt,
          method:        pick(methodPool),
          status:        "PAID",
          paymentDate:   payDate,
          createdBy:     "receptionist@ironhouse.com",
        },
      });
    }

    // Current membership
    const msNum    = nextMembershipId();
    const invNum   = nextInvoiceId();
    const trainer  = i < 10 ? pick(trainers) : null;
    const discount = i % 7 === 0 ? 300 : 0;
    const finalAmt = price - discount;
    const payDate  = payStatus === "PAID" ? new Date(startDate) : null;

    const timelineEvents: Array<{ event: string; createdBy?: string; note?: string; createdAt?: Date }> = [
      { event: "CREATED", createdBy: "receptionist@ironhouse.com", createdAt: startDate },
    ];
    if (payStatus === "PAID") {
      timelineEvents.push({ event: "ACTIVATED", createdBy: "receptionist@ironhouse.com", note: "Payment received", createdAt: startDate });
    }
    if (msStatus === "FROZEN") {
      timelineEvents.push({ event: "FROZEN", createdBy: "manager@ironhouse.com",
        note: JSON.stringify({ reason: "Member travel", frozenAt: daysAgo(10).toISOString() }),
        createdAt: daysAgo(10) });
    }
    if (msStatus === "EXPIRED") {
      timelineEvents.push({ event: "EXPIRED", createdBy: "system", createdAt: endDate });
    }

    await prisma.membership.create({
      data: {
        membershipNumber: msNum,
        memberId:   cm.id,
        planId:     plan.id,
        trainerId:  trainer?.id ?? null,
        startDate, endDate,
        amount: price, discount, tax: 0, finalAmount: finalAmt,
        status: msStatus,
        timeline: { create: timelineEvents },
        payments: {
          create: {
            invoiceNumber: invNum,
            memberId:      cm.id,
            amount:        price, discount, tax: 0, totalAmount: finalAmt,
            method:        pick(methodPool),
            status:        payStatus,
            paymentDate:   payDate,
            createdBy:     "receptionist@ironhouse.com",
            transactionId: payStatus === "PAID" && pick(methodPool) !== "CASH"
              ? `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`
              : null,
          },
        },
      },
    });

    console.log(`  ✅ Membership: ${cm.name} → ${plan.name} (${msStatus})`);
  }

  // ────────────────────────────────────────────────────────────────────────
  // MEMBER NOTES
  // ────────────────────────────────────────────────────────────────────────
  console.log("\n📝 Adding member notes...");
  for (const [idxStr, notes] of Object.entries(MEMBER_NOTES)) {
    const idx = parseInt(idxStr);
    const cm  = createdMembers.find((m) => m.idx === idx);
    if (!cm) continue;
    for (const note of notes) {
      await prisma.memberNote.create({
        data: { memberId: cm.id, note, createdBy: "manager@ironhouse.com" },
      });
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // A FEW STANDALONE FAILED / PENDING PAYMENTS (no membership)
  // ────────────────────────────────────────────────────────────────────────
  console.log("\n💸 Adding failed & pending payments...");
  const extra = [
    { idx: 5,  status: "FAILED"  as const, method: "BKASH"  as const, note: "Gateway timeout" },
    { idx: 10, status: "PENDING" as const, method: "NAGAD"  as const, note: null },
    { idx: 14, status: "PENDING" as const, method: "MONEYBAG" as const, note: null },
    { idx: 3,  status: "REFUNDED" as const, method: "CASH" as const, note: null },
  ];

  for (const e of extra) {
    const cm = createdMembers.find((m) => m.idx === e.idx);
    if (!cm) continue;
    await prisma.payment.create({
      data: {
        invoiceNumber: nextInvoiceId(),
        memberId:      cm.id,
        amount:        1500, discount: 0, tax: 0, totalAmount: 1500,
        method:        e.method,
        status:        e.status,
        paymentDate:   e.status === "FAILED" || e.status === "REFUNDED" ? daysAgo(3) : null,
        createdBy:     "receptionist@ironhouse.com",
      },
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ────────────────────────────────────────────────────────────────────────
  console.log("\n🔔 Adding notifications...");
  const ownerUser = await prisma.user.findUnique({ where: { email: "owner@ironhouse.com" } });
  if (ownerUser) {
    await prisma.notification.createMany({
      data: [
        { userId: ownerUser.id, type: "expiry_reminder",  message: "3 memberships expiring in the next 7 days.",   isRead: false, createdAt: daysAgo(0) },
        { userId: ownerUser.id, type: "payment_failed",   message: "Payment failed for Sadia Islam (INV-000063).", isRead: false, createdAt: daysAgo(1) },
        { userId: ownerUser.id, type: "announcement",     message: "New trainer Nazmun Nahar has joined the team.", isRead: true,  createdAt: daysAgo(5) },
        { userId: ownerUser.id, type: "expiry_reminder",  message: "Nasrin Sultana's membership expires tomorrow.", isRead: false, createdAt: daysAgo(0) },
      ],
      skipDuplicates: false,
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.staff.count(),
    prisma.member.count(),
    prisma.membership.count(),
    prisma.payment.count(),
    prisma.memberNote.count(),
  ]);

  console.log("\n✅ Demo seed complete!");
  console.log(`   Staff:       ${counts[0]}`);
  console.log(`   Members:     ${counts[1]}`);
  console.log(`   Memberships: ${counts[2]}`);
  console.log(`   Payments:    ${counts[3]}`);
  console.log(`   Notes:       ${counts[4]}`);
  console.log("\n📋 Credentials:");
  console.log("   owner@ironhouse.com          / admin123");
  console.log("   mahbubur.rahman@ironhouse.com / staff123  (manager)");
  console.log("   farzana.akter@ironhouse.com   / staff123  (receptionist)");
  console.log("   rahim.uddin@example.com        / member123 (member)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
