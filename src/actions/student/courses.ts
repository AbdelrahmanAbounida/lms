"use server";

import { prismadb } from "@/lib/db";
import { getUserProgress } from "./get-progress";
import { auth } from "@/auth";

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

export const getStudentSignedCourses = async () => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return {};
    }

    const userId = session.user?.id;

    const purchasedCourse = await prismadb.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
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
              where: {
                isPublished: true,
              },
            },
            category: true,
          },
        },
      },
    });

    const coursesWithProgress = await Promise.all(
      purchasedCourse.map(async (purchase) => {
        const progress = await getUserProgress({
          courseId: purchase.course.id,
          userId,
        });
        return {
          course: purchase.course,
          progress,
        };
      })
    );

    const completedCourses = await coursesWithProgress.filter(
      (course) => course.progress === 100
    );
    const nonCompletedCourses = Math.abs(
      coursesWithProgress.length - completedCourses.length
    );

    const courses = coursesWithProgress.filter((course) => course.course);
    return {
      allcourses: courses,
      completedCourses: completedCourses.length,
      nonCompletedCourses,
    };
  } catch (error) {
    console.log({ error });
    return;
  }
};
