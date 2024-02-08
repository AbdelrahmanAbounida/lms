import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/auth-schemas";
import { getUserbyEmail } from "./lib/user";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
/**
 *
 * this page includes credential providers
 *
 * http://localhost:3000/api/auth/callback/github
 * https://github.com/settings/applications/new
 *
 *
 *
 * http://localhost:3000/api/auth/callback/google
 */

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // login user
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse({ ...credentials });

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // check email validation && !google/github providers
          const user = await getUserbyEmail({ email });
          if (!user || !user.hashedPassword) {
            return null;
          }
          // check if password matches
          const validPassword = await bcrypt.compare(
            password,
            user.hashedPassword
          );
          if (validPassword) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
