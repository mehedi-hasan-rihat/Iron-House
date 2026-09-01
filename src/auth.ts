import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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
          id:     user.id,
          email:  user.email,
          roleId: user.roleId,
          role:   user.role.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.roleId = (user as { roleId: string }).roleId;
        token.role   = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id     = token.id     as string;
        session.user.roleId = token.roleId as string;
        session.user.role   = token.role   as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
});
