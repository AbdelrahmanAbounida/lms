"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

export const createCourse = async ({
  courseTitle,
}: {
  courseTitle: string;
}) => {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const course = await prismadb.course.create({
      data: {
        userId: session.user.id,
        title: courseTitle,
      },
    });
    return { course };
  } catch (error: any) {
    console.log({ error });
    console.log(error?.meta?.target);

    if (error?.meta?.target === "Course_title_key") {
      return {
        error: "There is a course with the same title. Please change title",
      };
    }

    return { error: "something went wrong" };
  }
};

export const editCourse = async ({
  data,
  courseId,
}: {
  data: any;
  courseId: any;
}) => {
  const session = await auth();

  try {
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return { error: "Course doesn't exist" };
    }

    await prismadb.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...data,
      },
    });

    return { success: "Course updated successfully" };
  } catch (error: any) {
    console.log({ error });

    if (error?.meta?.target === "Course_title_key") {
      return {
        error: "There is a course with the same title. Please change title",
      };
    }
    return { error: "Failed to update this item" };
  }
};
