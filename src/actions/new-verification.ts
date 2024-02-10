"use server";
import { prismadb } from "@/lib/db";
import { getUserbyId } from "@/lib/user";

export const verifyEmail = async (token: string) => {
  // Check if token exists
  if (!token) return { error: "Token doesn't exist" };

  // check if user already verified

  const tokenexist = await prismadb.authToken.findUnique({
    where: {
      token,
    },
  });
  if (!tokenexist) return { error: "Token is not correct" };

  // check if there is no email for the given token
  const user = await getUserbyId({ id: tokenexist.userId });

  if (!user) return { error: "No Email found for the given token" };

  // check if the token expired
  if (new Date().getTime() - tokenexist.expires.getTime() > 0)
    return { error: "Token has expired" };

  // verify user

  await prismadb.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  // delete the verification token
  await prismadb.authToken.delete({
    where: {
      id: tokenexist.id,
    },
  });

  return { success: "Account has been verified successfully" };
};
