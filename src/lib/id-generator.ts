import prisma from "./prisma";

/**
 * Generates auto-incremented IDs like GYM-0001, INV-0001 etc.
 * Uses a Counters table to track the last value safely.
 */
async function nextId(prefix: string, counterKey: string, pad = 4): Promise<string> {
  const counter = await prisma.counter.upsert({
    where:  { id: counterKey },
    update: { value: { increment: 1 } },
    create: { id: counterKey, value: 1 },
  });
  return `${prefix}-${String(counter.value).padStart(pad, "0")}`;
}

export const generateMemberId     = () => nextId("GYM", "member_id");
export const generateMembershipId = () => nextId("MEM", "membership_id");
export const generateInvoiceId    = () => nextId("INV", "invoice_id", 6);
export const generateStaffId      = () => nextId("STF", "staff_id");
