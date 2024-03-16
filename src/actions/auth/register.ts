"use server";

import { getUserbyEmail } from "@/lib/user";
import { registerSchema } from "@/schemas/auth-schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prismadb } from "@/lib/db";
import { sendResendEmail } from "@/email-providers/resend";
import { generateToken } from "@/lib/tokens";

export const registerUser = async ({
  email,
  password,
  confirmPassword,
}: z.infer<typeof registerSchema>) => {
  if (password !== confirmPassword) {
    return { error: "Passwords don't match" };
  }
  try {
    // check if user exists
    const userExists = await getUserbyEmail({ email });

    if (userExists) {
      return { error: "User Already exists" };
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prismadb.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
    // send verification email
    const token = await generateToken(email, "verification");
    if (token) {
      await sendResendEmail("verifyEmail", email, token.token);

      return {
        success: "A verification email has been sent to you",
      };
    } else {
      return { error: "Something went wrong" };
    }
  } catch (error) {
    console.log({ error });
    return { error: "Failed to register user for this account" };
  }
};
