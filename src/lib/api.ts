/**
 * apiHandler — wraps any Next.js route handler with structured error logging.
 *
 * Every unhandled exception is:
 *   1. Logged to the server console with full context (method, path, stack)
 *   2. Returned to the client as a consistent JSON error shape
 */
import { NextRequest, NextResponse } from "next/server";
import type { Module, Action, PermissionKey } from "./permissions";

type RouteContext = { params?: Promise<Record<string, string>> };
type Handler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse | Response>;

export function apiHandler(fn: Handler): Handler {
  return async (req: NextRequest, ctx: RouteContext) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack   = err instanceof Error ? err.stack   : undefined;

      console.error(
        `[API ERROR] ${req.method} ${req.nextUrl.pathname}\n`,
        message,
        stack ? `\n${stack}` : ""
      );

      return NextResponse.json(
        { error: "Internal server error", detail: message, path: req.nextUrl.pathname },
        { status: 500 }
      );
    }
  };
}

/**
 * Check a fine-grained permission inside an API route handler.
 * Reads from the JWT — zero DB calls.
 * Returns a 403 response if denied, or null if the check passes.
 *
 * @example
 *   const denied = await checkPermission(session, "members", "create");
 *   if (denied) return denied;
 */
export async function checkPermission(
  session: { user: { permissions: string[] } },
  module: Module,
  action: Action
): Promise<NextResponse | null> {
  const key: PermissionKey = `${module}:${action}`;
  if (!session.user.permissions.includes(key)) {
    return NextResponse.json(
      { error: `Forbidden — requires ${key}` },
      { status: 403 }
    );
  }
  return null;
}

