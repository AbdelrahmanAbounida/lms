"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECTED } from "@/routes";

export const authSocial = async (
  provider: "google" | "github",
  callbackurl: string | null
) => {
  try {
    await signIn(provider, {
      redirectTo: callbackurl || DEFAULT_LOGIN_REDIRECTED,
    });
  } catch (error) {
    console.log({ error });
    return { error: `Failed to register with ${provider}` };
  }
};
