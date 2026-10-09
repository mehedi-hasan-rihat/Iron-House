import prisma from "./prisma";

/**
 * Generates auto-incremented IDs like GYM-0001, INV-0001 etc.
 * Uses a Counters table to track the last value safely.
 *
 * Before incrementing, we sync the counter to MAX(existing numeric suffix)
 * so re-seeds or manual inserts can never cause a unique-constraint collision.
 */
async function nextId(prefix: string, counterKey: string, pad = 4): Promise<string> {
  // Find the highest existing numeric suffix for this prefix in one raw query
  // so we can ensure the counter is never behind reality.
  const tableMap: Record<string, { table: string; column: string }> = {
    member_id:     { table: "members", column: "memberId"         },
    membership_id: { table: "memberships", column: "membershipNumber" },
    invoice_id:    { table: "payments", column: "invoiceNumber"   },
    staff_id:      { table: "staff", column: "staffId"            },
  };

  const meta = tableMap[counterKey];
  if (meta) {
    // Extract the numeric part after the dash and find the max
    const rows = await prisma.$queryRawUnsafe<{ max_val: number | null }[]>(
      `SELECT MAX(CAST(SPLIT_PART("${meta.column}", '-', 2) AS INTEGER)) AS max_val FROM "${meta.table}"`
    );
    const maxInDb = rows[0]?.max_val ?? 0;

    // Bring the counter up to at least maxInDb so the next increment is safe
    await prisma.counter.upsert({
      where:  { id: counterKey },
      update: { value: { increment: 0 } }, // no-op update to ensure row exists
      create: { id: counterKey, value: 0 },
    });
    // Set to max only if the DB is ahead of the counter
    await prisma.$executeRawUnsafe(
      `UPDATE "counters" SET value = GREATEST(value, $1) WHERE id = $2`,
      maxInDb,
      counterKey
    );
  }

  const counter = await prisma.counter.update({
    where: { id: counterKey },
    data:  { value: { increment: 1 } },
  });

  return `${prefix}-${String(counter.value).padStart(pad, "0")}`;
}

export const generateMemberId     = () => nextId("GYM", "member_id");
export const generateMembershipId = () => nextId("MEM", "membership_id");
export const generateInvoiceId    = () => nextId("INV", "invoice_id", 6);
export const generateStaffId      = () => nextId("STF", "staff_id");
