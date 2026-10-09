import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_PERMISSIONS } from "../src/lib/permissions";
import { PLANS } from "./data/plans";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Counters ──────────────────────────────────
  await prisma.counter.createMany({
    data: [
      { id: "member_id",     value: 0 },
      { id: "membership_id", value: 0 },
      { id: "invoice_id",    value: 0 },
      { id: "staff_id",      value: 0 },
    ],
    skipDuplicates: true,
  });

  // ── Roles ─────────────────────────────────────
  // Permissions are NOT stored in the DB — they live in DEFAULT_PERMISSIONS
  // in src/lib/permissions.ts and are embedded in the JWT at login.
  // The DB only stores the role name so users can be assigned a role.
  const roleNames = [...Object.keys(DEFAULT_PERMISSIONS), "member"];
  const roles: Record<string, { id: string }> = {};

  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where:  { name },
      update: {},
      create: { name },
    });
    roles[name] = role;
    console.log(`  ✅ Role: ${name}`);
  }

  // ── Owner account ─────────────────────────────
  const ownerUser = await prisma.user.upsert({
    where:  { email: "owner@ironhouse.com" },
    update: {},
    create: {
      email:    "owner@ironhouse.com",
      password: await bcrypt.hash("admin123", 12),
      roleId:   roles["owner"].id,
    },
  });

  await prisma.staff.upsert({
    where:  { staffId: "STF-0001" },
    update: {},
    create: {
      staffId:     "STF-0001",
      userId:      ownerUser.id,
      name:        "Gym Owner",
      phone:       "+880 1700 000 000",
      designation: "Owner",
      joiningDate: new Date(),
      status:      "ACTIVE",
    },
  });
  console.log("  ✅ Owner account: owner@ironhouse.com / admin123");

  // ── Default Membership Plans ──────────────────
  for (const plan of PLANS) {
    await prisma.membershipPlan.upsert({
      where:  { name: plan.name },
      update: {},
      create: plan,
    });
  }
  console.log(`  ✅ Membership plans: ${PLANS.length} seeded`);

  console.log("\n✅ Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Email:    owner@ironhouse.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
