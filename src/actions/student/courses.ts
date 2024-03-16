"use server";

import { prismadb } from "@/lib/db";
import { getUserProgress } from "./get-progress";

export const getSearchCourses = async ({
  userId,
  title,
  categoryId,
  search,
}: {
  userId: string;
  title: string;
  categoryId: string;
  search: boolean;
}) => {
  try {
    const courses = await prismadb.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: search ? title : "",
          mode: "insensitive",
        },
        categoryId,
      },
      include: {
        purchases: {
          where: {
            userId,
          },
        },
        chapters: {
          select: {
            id: true,
          },
        },
        category: true,
      },
      orderBy: {
        title: "desc",
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length == 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progress = await getUserProgress({ courseId: course.id, userId });
        return {
          ...course,
          progress,
        };
      })
    );
    return coursesWithProgress;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getCoursesWithProgress = async ({}: {}) => {};
