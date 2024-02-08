import { prismadb } from "@/lib/db";

export const getUserbyEmail = async ({ email }: { email: string }) => {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const getUserbyId = async ({ id }: { id: any }) => {
  try {
    console.log({ id });
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log({ error_id: error });
    return null;
  }
};
