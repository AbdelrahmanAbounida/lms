"use server";

import { sendResendEmail } from "@/email-providers/resend";
import { generateToken } from "@/lib/tokens";
import { prismadb } from "@/lib/db";
import { getUserbyEmail, getUserbyId } from "@/lib/user";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
} from "@/schemas/auth-schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

// *************************
// Send a reset email
// *************************

export const sendResetPasswordEmail = async ({
  email,
}: z.infer<typeof forgetPasswordSchema>) => {
  // check if there is a user for the given email
  const userExists = await getUserbyEmail({ email });

  if (!userExists) {
    return { error: "Email doesn't exist" };
  }

  // generate new token
  const token = await generateToken(email, "reset");

  // send email
  if (token) {
    // const resetLink = `${process.env.NEXT_PUBLIC_APP_MAIN_URL}/reset-password/token?=${token.token}`;
    await sendResendEmail("forgetPassword", email, token.token);
    return {
      success: "An Email has been sent to you.",
    };
  } else {
    return { error: "Something went wrong" };
  }
};

// *************************
// Handle Reset Password
// *************************

export const resetPassword = async ({
  newPassword,
  confirmNewPassword,
  token,
}: any) => {
  try {
    // check if token exists
    if (!token) {
      return { error: "No Token Exists" };
    }
    const tokenExists = await prisma?.authToken.findUnique({
      where: {
        token,
      },
    });
    if (!tokenExists) {
      return { error: "No token found" };
    }

    // check if there is a user for the given token
    const user = await getUserbyId({ id: tokenExists.userId });

    if (!user) {
      return { error: "No user found for the given token" };
    }

    // check the correctness of passowrds

    const passwordsRight = resetPasswordSchema.safeParse({
      newPassword,
      confirmNewPassword,
    });
    if (!passwordsRight.success) {
      return { error: "Passwords are not valid" };
    }

    // reset user passwords
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prismadb.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: newHashedPassword,
      },
    });

    // delete token

    await prismadb.authToken.delete({
      where: {
        id: tokenExists.id,
      },
    });

    return { success: "password has been reset successfully " };
  } catch (error) {
    console.log({ error });
    return { error: "something wentwrong" };
  }
};
