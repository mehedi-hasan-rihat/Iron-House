import { DefaultSession, DefaultJWT } from "next-auth";
import type { PermissionKey } from "@/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id:          string;
      role:        string;
      permissions: PermissionKey[];
    };
  }
  interface User {
    role:        string;
    permissions: PermissionKey[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:          string;
    role:        string;
    permissions: PermissionKey[];
  }
}
