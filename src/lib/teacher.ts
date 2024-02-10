import { prismadb } from "./db";

export const getCourseById = async (id: any) => {
  try {
    const course = await prismadb.course.findUnique({
      where: {
        id,
      },
    });
    return course;
  } catch (error) {
    console.log({ error });
    return;
  }
};
