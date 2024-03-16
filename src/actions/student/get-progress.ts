"use server";

import { prismadb } from "@/lib/db";

export const getUserProgress = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  try {
    const publishedChapters = await prismadb.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

    const userProgress = await prismadb.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersId,
        },
        isCompleted: true,
      },
    });

    if (userProgress === 0) {
      return 0;
    }

    const progressPercentage =
      (userProgress / publishedChaptersId.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log({ error });
    return 0;
  }
};

export const updateUserProgress = async ({
  userId,
  chapterId,
  isCompleted,
}: {
  userId: string;
  chapterId: string;
  isCompleted: boolean;
}) => {
  try {
    const userProgress = await prismadb.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    const progress = await getUserProgress({
      userId,
      courseId: chapter?.courseId!,
    });
    return progress;
  } catch (error) {
    console.log({ error });
    return;
  }
};
