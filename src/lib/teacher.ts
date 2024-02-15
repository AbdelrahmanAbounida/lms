import { auth } from "@/auth";
import { prismadb } from "./db";

export const getCourseById = async (id: string) => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return;
    }

    const course = await prismadb.course.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    return course;
  } catch (error) {
    console.log({ error });
    return;
  }
};
