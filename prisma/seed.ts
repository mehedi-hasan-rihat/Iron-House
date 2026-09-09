import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_PERMISSIONS } from "../src/lib/permissions";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

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
  const roleNames = ["owner", "manager", "receptionist", "trainer", "accountant", "member"];
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

  // ── Permissions ───────────────────────────────
  const allPerms = new Set<string>();
  Object.values(DEFAULT_PERMISSIONS).forEach((perms) =>
    perms.forEach(([m, a]) => allPerms.add(`${m}:${a}`))
  );

  const permMap: Record<string, { id: string }> = {};
  for (const key of allPerms) {
    const [module, action] = key.split(":");
    const perm = await prisma.permission.upsert({
      where:  { module_action: { module, action } },
      update: {},
      create: { module, action },
    });
    permMap[key] = perm;
  }
  console.log(`  ✅ Permissions: ${allPerms.size} created`);

  // ── Role Permissions ──────────────────────────
  for (const [roleName, perms] of Object.entries(DEFAULT_PERMISSIONS)) {
    const roleId = roles[roleName].id;
    for (const [module, action] of perms) {
      const permId = permMap[`${module}:${action}`].id;
      await prisma.rolePermission.upsert({
        where:  { roleId_permissionId: { roleId, permissionId: permId } },
        update: {},
        create: { roleId, permissionId: permId },
      });
    }
    console.log(`  ✅ Permissions assigned: ${roleName}`);
  }

  // ── Owner account ─────────────────────────────
  const ownerUser = await prisma.user.upsert({
    where:  { email: "owner@ironhouse.com" },
    update: {},
    create: {
      email:    "owner@ironhouse.com",
      password: await hashPassword("admin123"),
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
  const plans = [
    {
      name: "Monthly",
      description: "Full gym access for one month",
      durationDays: 30,
      price: 1500,
      type: "MONTHLY" as const,
      features: { gymAccess: true, groupClasses: true, personalTrainer: false, locker: true, dietConsult: false },
    },
    {
      name: "Quarterly",
      description: "Full access for 3 months",
      durationDays: 90,
      price: 4000,
      type: "QUARTERLY" as const,
      features: { gymAccess: true, groupClasses: true, personalTrainer: false, locker: true, dietConsult: false },
    },
    {
      name: "Half-Yearly",
      description: "Best value — 6 months full access",
      durationDays: 180,
      price: 7000,
      type: "HALF_YEARLY" as const,
      features: { gymAccess: true, groupClasses: true, personalTrainer: true, locker: true, dietConsult: true },
    },
    {
      name: "Annual",
      description: "12 months full access + priority booking",
      durationDays: 365,
      price: 12000,
      type: "YEARLY" as const,
      features: { gymAccess: true, groupClasses: true, personalTrainer: true, locker: true, dietConsult: true },
    },
    {
      name: "Day Pass",
      description: "Single day access",
      durationDays: 1,
      price: 200,
      type: "DAY_PASS" as const,
      features: { gymAccess: true, groupClasses: false, personalTrainer: false, locker: false, dietConsult: false },
    },
    {
      name: "Free Trial",
      description: "3-day free trial for new members",
      durationDays: 3,
      price: 0,
      type: "TRIAL" as const,
      trialEnabled: true,
      features: { gymAccess: true, groupClasses: false, personalTrainer: false, locker: false, dietConsult: false },
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where:  { id: plan.name },   // fallback — will always miss, so always creates
      update: {},
      create: { ...plan, features: plan.features },
    }).catch(() => null); // skip if already exists
  }
  console.log(`  ✅ Membership plans: ${plans.length} created`);

  console.log("\n✅ Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Email:    owner@ironhouse.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
