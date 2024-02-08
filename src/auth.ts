import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserbyId } from "./lib/user";
import { prismadb } from "./lib/db";
import { getTokenByuserEmail } from "./lib/tokens";
import { userRole } from "@prisma/client";

/**
 *
 * this page includes callback , events , provider
 */

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: userRole;
      isauth: boolean;
    };
  }
}

// declare module "next-auth" {
//   interface User {
//     role: userRole;
//   }
// }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      // check if email is verified
      const existuser = await getUserbyId({ id: user.id });
      if (!existuser?.emailVerified) return false;

      return true;
    },
    async jwt({ token, session, account }) {
      if (!token.sub) return token;

      const user = await getUserbyId({ id: token.sub });
      if (!user) return token;

      token.role = user.role;
      token.isauth = !!(account?.provider !== "credentials");
      token.id = user.id;
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.isauth = token.isauth;
        session.user.id = token.id;
      }

      // console.log({ session });
      return session;
    },
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
});
