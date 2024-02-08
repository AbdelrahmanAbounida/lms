import { prismadb } from "./db";
import { v4 as uuid } from "uuid";
// import { lib } from "crypto-js";
import { getUserbyEmail } from "@/lib/user";
// import crypto from "crypto";

export const generateToken = async (
  email: string,
  tokenType: "verification" | "reset"
) => {
  /**
   * generate a token for email verification , password reset , twofactor auth
   */
  // check if there is user for this email
  const user = await getUserbyEmail({ email });
  if (!user) {
    return null;
  }

  // check the token type
  let token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 3600 * 1000 ms

  // check if there is an existing token with same id to edlete it
  const exitingToken = await getTokenByuserEmail(email, tokenType);
  if (exitingToken) {
    await prismadb.authToken.delete({
      where: {
        id: exitingToken.id,
      },
    });
  }

  // create new token
  let relationField: "passwordResetToken" | "verificationToken" =
    "passwordResetToken";

  if (tokenType === "reset") {
    relationField = "passwordResetToken";
  } else if (tokenType === "verification") {
    relationField = "verificationToken";
  }

  const newToken = await prismadb.authToken.create({
    data: {
      expires,
      token,
      userId: user.id,
    },
  });

  await prismadb.user.update({
    where: { id: user.id },
    data: {
      [relationField]: {
        connect: {
          id: newToken.id,
        },
      },
    },
  });

  return newToken;
};

export const getTokenByuserEmail = async (
  email: string,
  tokenType: "verification" | "reset"
) => {
  const user = await getUserbyEmail({ email });

  if (!user) {
    return null;
  }
  const token = await prismadb.authToken.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      verifyuser: tokenType == "verification",
      passwordResetuser: tokenType == "reset",
    },
  });
  return token;
};

export const getTokenById = async (
  id: any,
  tokenType: "verification" | "reset"
) => {
  const token = await prismadb.authToken.findUnique({
    where: {
      id,
    },
    include: {
      verifyuser: tokenType == "verification",
      passwordResetuser: tokenType == "reset",
    },
  });
  return token;
};
