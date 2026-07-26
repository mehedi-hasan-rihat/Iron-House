import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Role = "owner" | "manager" | "receptionist" | "trainer" | "accountant" | "member";

/**
 * Call at the top of any Server Component / layout that needs protection.
 * Redirects to /login if unauthenticated.
 * Redirects to /unauthorized if role is not in allowedRoles.
 */
export async function requireAuth(allowedRoles?: Role[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
    redirect("/unauthorized");
  }

  return session;
}

/** Convenience: staff only (all except member) */
export const requireStaff = () =>
  requireAuth(["owner", "manager", "receptionist", "trainer", "accountant"]);

/** Convenience: admin level (owner + manager) */
export const requireAdmin = () =>
  requireAuth(["owner", "manager"]);

/** Convenience: owner only */
export const requireOwner = () =>
  requireAuth(["owner"]);
