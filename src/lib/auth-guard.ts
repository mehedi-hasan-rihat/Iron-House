import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Module, Action, PermissionKey } from "./permissions";

type StaffRole = "owner" | "manager" | "receptionist" | "trainer" | "accountant";

const STAFF_ROLES: StaffRole[] = ["owner", "manager", "receptionist", "trainer", "accountant"];

/**
 * Call at the top of any Server Component that needs protection.
 * Redirects to /login if unauthenticated.
 * Redirects to /unauthorized if role is not allowed.
 */
export async function requireAuth(allowedRoles?: StaffRole[]) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (allowedRoles && !allowedRoles.includes(session.user.role as StaffRole)) {
    redirect("/unauthorized");
  }

  return session;
}

/** All staff roles (excludes member) */
export const requireStaff = () => requireAuth(STAFF_ROLES);

/** Owner + manager */
export const requireAdmin = () => requireAuth(["owner", "manager"]);

/** Owner only */
export const requireOwner = () => requireAuth(["owner"]);

/**
 * Gate a page by fine-grained permission.
 * Reads from the JWT — zero DB calls.
 *
 * @example
 *   await requirePermission("members", "create");
 */
export async function requirePermission(module: Module, action: Action) {
  const session = await requireStaff();
  const key: PermissionKey = `${module}:${action}`;
  if (!session.user.permissions.includes(key)) redirect("/unauthorized");
  return session;
}
