import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id:     string;
      roleId: string;
      role:   string;
    };
  }
  interface User {
    roleId: string;
    role:   string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:     string;
    roleId: string;
    role:   string;
  }
}
