"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

export const getChapterData = async ({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return;
    }
    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return;
    }

    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: true,
      },
    });
    if (!chapter) {
      return;
    }
    const purchase = await prismadb.purchase.findUnique({
      where: {
        userId_courseId: {
          courseId: courseId,
          userId: session.user.id,
        },
      },
    });

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await prismadb.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await prismadb.muxData.findUnique({
        where: {
          chapterId,
        },
      });
      nextChapter = await prismadb.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await prismadb.userProgress.findUnique({
      where: {
        userId_chapterId: {
          chapterId,
          userId: session.user.id,
        },
      },
    });

    return {
      course,
      purchase,
      chapter,
      nextChapter,
      muxData,
      attachments,
      userId: session.user.id,
      userProgress,
    };
  } catch (error) {
    console.log({ chapterId });
    console.log({ errrrrrrrrrrrrr: error });
    return;
  }
};
