"use server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { getCourseById } from "./courses";
import { deleteMux } from "./mux";

// ************************
// Retrieve chapter
// ************************
export const getChapterById = async ({ chapterId }: { chapterId: string }) => {
  try {
    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        muxData: true,
      },
    });

    if (!chapter) {
      return { error: "chapter doesn't exist" };
    }

    return { success: chapter };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};

// ************************
// Create chapter
// ************************
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
    console.log({ newPosition });

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

// ************************
// Edit chapter
// ************************
export const editChapter = async ({
  data,
  courseId,
  chapterId,
}: {
  data: any;
  courseId: any;
  chapterId: any;
}) => {
  const session = await auth();

  try {
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return { error: "Chapter doesn't exist" };
    }

    await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...data,
      },
    });

    return { success: "Chapter updated successfully" };
  } catch (error: any) {
    console.log({ error });

    // if (error?.meta?.target === "Chapter_title_key") {
    //   return {
    //     error: "There is a course with the same title. Please change title",
    //   };
    // }
    return { error: "Failed to update this item" };
  }
};

// ************************
// Publish chapter
// ************************
export const publishChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if  chapter exists
    const resp = await getChapterById({ chapterId });
    const chapter = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!chapter) {
      return { error: "Chapter doesn't exist" };
    }

    // check if course exists
    const resp2 = await getCourseById({ courseId });
    const course = resp2.success;

    if (resp2.error) {
      return { error: resp2.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // check if chapter has required fields before publishing

    const requierdFields = [
      chapter.title,
      chapter.description,
      chapter.muxData,
    ];
    const completedFields = requierdFields.filter(Boolean).length === 3;

    if (!completedFields) {
      return { error: "Complete all required fields to publish the chapter" };
    }

    // publish the chapter
    await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    // publish the course if not published
    if (!course.isPublished) {
      await prismadb.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: true,
        },
      });
    }

    return { success: "Chapter has been published sucecssfully" };
  } catch (error) {
    console.log({ error });
  }
};

// ************************
// UnPublish chapter
// ************************
export const unpublishChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if  chapter exists
    const resp = await getChapterById({ chapterId });
    const chapter = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!chapter) {
      return { error: "Chapter doesn't exist" };
    }

    // unpublish the chapter
    const updatedChapter = await prismadb.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: false,
      },
    });

    // check if course exists
    const resp2 = await getCourseById({ courseId });
    const course = resp2.success;

    if (resp2.error) {
      return { error: resp2.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // unpublish the course if no other chapters are published
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (!hasPublishedChapter) {
      await prismadb.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return { success: "Chapter is unpublished now" };
  } catch (error) {
    console.log({ error });
  }
};

// ************************
// delete chapter
// ************************
export const deleteChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if  chapter exists
    const resp = await getChapterById({ chapterId });
    const chapter = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!chapter) {
      return { error: "Chapter doesn't exist" };
    }

    // check if course exists
    const resp2 = await getCourseById({ courseId });
    const course = resp2.success;

    if (resp2.error) {
      return { error: resp2.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // delete the chapter
    await prismadb.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });

    // delete mux data
    const resp3 = await deleteMux({ chapter });
    if (resp3.error) {
      return { error: resp3.error };
    }

    // unpublish the course if no other chapters are published
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (!hasPublishedChapter) {
      await prismadb.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return { success: "Chapter is unpublished now" };
  } catch (error) {
    console.log({ error });
    return { error: "something went wrong" };
  }
};
