"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { Chapter } from "@prisma/client";

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

    const course = await prismadb.course.findFirst({
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

export const getAllCategories = async () => {
  try {
    const categories = await prismadb.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const createCourseChapter = async ({
  title,
  courseId,
}: {
  title: string;
  courseId: string;
}) => {
  try {
    // check if course exists

    const course = await prismadb.course.findFirst({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!course) {
      return { error: "Course doesn't exist" };
    }
    // last chapters
    const newPosition = course.chapters.reduce((maxPosition, chapter) => {
      return Math.max(maxPosition, chapter.position);
    }, 1);

    // create course
    await prismadb.chapter.create({
      data: {
        courseId,
        title,
        position: newPosition + 1,
      },
    });

    return { success: "chapter created successfully" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};

export const reorderChapters = async ({
  courseId,
  orderedChapters,
}: {
  courseId: string;
  orderedChapters: { id: string; position: number }[];
}) => {
  try {
    for (let i of orderedChapters) {
      await prismadb.chapter.update({
        where: {
          courseId,
          id: i.id,
        },
        data: {
          position: i.position,
        },
      });
    }
    return { success: "Orderd successfully" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};
