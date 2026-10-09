import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getPermissionsForRole, type PermissionKey } from "@/lib/permissions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  secret:  process.env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where:   { email: credentials.email as string },
          include: { role: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id:          user.id,
          email:       user.email,
          role:        user.role.name,
          permissions: getPermissionsForRole(user.role.name),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.role        = (user as { role: string }).role;
        token.permissions = (user as { permissions: PermissionKey[] }).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id          = token.id          as string;
        session.user.role        = token.role        as string;
        session.user.permissions = token.permissions as PermissionKey[];
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
});
