import prisma from "./prisma";

export type Module =
  | "dashboard"
  | "members"
  | "plans"
  | "memberships"
  | "payments"
  | "staff"
  | "roles"
  | "reports"
  | "settings";

export type Action = "view" | "create" | "edit" | "delete" | "export" | "refund";

/**
 * Check if a role has a specific permission.
 */
export async function hasPermission(
  roleId: string,
  module: Module,
  action: Action
): Promise<boolean> {
  const perm = await prisma.rolePermission.findFirst({
    where: {
      roleId,
      permission: { module, action },
    },
  });
  return !!perm;
}

/**
 * Get all permissions for a role as a flat set.
 * e.g. { "members:view", "members:create", "payments:view" }
 */
export async function getRolePermissions(roleId: string): Promise<Set<string>> {
  const rolePerms = await prisma.rolePermission.findMany({
    where: { roleId },
    include: { permission: true },
  });
  return new Set(rolePerms.map((rp) => `${rp.permission.module}:${rp.permission.action}`));
}

/**
 * Default permission matrix — used during seeding.
 */
export const DEFAULT_PERMISSIONS: Record<string, Array<[Module, Action]>> = {
  owner: [
    ["dashboard", "view"],
    ["members",   "view"], ["members",   "create"], ["members",   "edit"], ["members",   "delete"],
    ["plans",     "view"], ["plans",     "create"], ["plans",     "edit"], ["plans",     "delete"],
    ["memberships","view"],["memberships","create"],["memberships","edit"],["memberships","delete"],
    ["payments",  "view"], ["payments",  "create"], ["payments",  "edit"], ["payments",  "delete"],
    ["payments",  "export"], ["payments", "refund"],
    ["staff",     "view"], ["staff",     "create"], ["staff",     "edit"], ["staff",     "delete"],
    ["roles",     "view"], ["roles",     "create"], ["roles",     "edit"], ["roles",     "delete"],
    ["reports",   "view"], ["reports",   "export"],
    ["settings",  "view"], ["settings",  "edit"],
  ],
  manager: [
    ["dashboard",  "view"],
    ["members",    "view"], ["members",   "create"], ["members",   "edit"],
    ["plans",      "view"], ["plans",     "create"], ["plans",     "edit"],
    ["memberships","view"], ["memberships","create"],["memberships","edit"],
    ["payments",   "view"], ["payments",  "create"], ["payments",  "export"],
    ["staff",      "view"],
    ["reports",    "view"], ["reports",   "export"],
  ],
  receptionist: [
    ["dashboard",  "view"],
    ["members",    "view"], ["members",   "create"],
    ["plans",      "view"],
    ["memberships","view"], ["memberships","create"],
    ["payments",   "view"], ["payments",  "create"],
  ],
  trainer: [
    ["dashboard",  "view"],
    ["members",    "view"],
    ["memberships","view"],
  ],
  accountant: [
    ["dashboard",  "view"],
    ["plans",      "view"],
    ["memberships","view"],
    ["payments",   "view"], ["payments",  "create"], ["payments",  "export"], ["payments", "refund"],
    ["reports",    "view"], ["reports",   "export"],
  ],
  member: [
    ["dashboard",  "view"],
    ["memberships","view"],
    ["payments",   "view"],
  ],
};
