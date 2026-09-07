/**
 * apiHandler — wraps any Next.js route handler with structured error logging.
 *
 * Every unhandled exception is:
 *   1. Logged to the server console with full context (method, path, stack)
 *   2. Returned to the client as a consistent JSON error shape
 *
 * Usage:
 *   export const GET  = apiHandler(async (req) => { ... });
 *   export const POST = apiHandler(async (req, ctx) => { ... });
 */
import { NextRequest, NextResponse } from "next/server";

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
        {
          error:  "Internal server error",
          detail: message,
          path:   req.nextUrl.pathname,
        },
        { status: 500 }
      );
    }
  };
}
