export type Module =
  | "dashboard"
  | "members"
  | "plans"
  | "memberships"
  | "payments"
  | "staff"
  | "roles";

export type Action = "view" | "create" | "edit" | "delete" | "refund";

/** Flat permission key, e.g. "members:create" */
export type PermissionKey = `${Module}:${Action}`;

/**
 * Default permission matrix — the single source of truth.
 * No database tables. Permissions are derived from the role name
 * embedded in the JWT at login time.
 *
 * Only modules that exist as pages and only actions enforced in
 * API routes / page guards are listed.
 */
export const DEFAULT_PERMISSIONS: Record<string, PermissionKey[]> = {

  // Full access to everything that exists
  owner: [
    "dashboard:view",
    "members:view",      "members:create",     "members:edit",
    "plans:view",        "plans:create",        "plans:edit",        "plans:delete",
    "memberships:view",  "memberships:create",  "memberships:edit",
    "payments:view",     "payments:edit",       "payments:refund",
    "staff:view",        "staff:create",        "staff:edit",        "staff:delete",
    "roles:view",
  ],

  // Full access
  manager: [
    "dashboard:view",
    "members:view",      "members:create",     "members:edit",
    "plans:view",        "plans:create",        "plans:edit",        "plans:delete",
    "memberships:view",  "memberships:create",  "memberships:edit",
    "payments:view",     "payments:edit",       "payments:refund",
    "staff:view",        "staff:create",        "staff:edit",        "staff:delete",
    "roles:view",
  ],

  // Front-desk — create members/memberships, view the rest
  receptionist: [
    "dashboard:view",
    "members:view",      "members:create",
    "plans:view",
    "memberships:view",  "memberships:create",
    "payments:view",
  ],

  // Read-only on members and their memberships
  trainer: [
    "dashboard:view",
    "members:view",
    "memberships:view",
  ],

  // Finance — payments and refunds only
  accountant: [
    "dashboard:view",
    "plans:view",
    "memberships:view",
    "payments:view",     "payments:refund",
  ],

  // Member — no admin permissions (uses separate layout)
  member: [],
};

/**
 * Get all permissions for a role as a flat array.
 * Pure in-memory — no database call.
 */
export function getPermissionsForRole(role: string): PermissionKey[] {
  return DEFAULT_PERMISSIONS[role] ?? [];
}

/**
 * Check if a role has a specific permission.
 * Pure in-memory — no database call.
 */
export function can(role: string, key: PermissionKey): boolean {
  return (DEFAULT_PERMISSIONS[role] ?? []).includes(key);
}
