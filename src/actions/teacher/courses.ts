"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { deleteChapter } from "./chapters";

// ************************
// Retrieve course
// ************************
export const getCourseById = async ({ courseId }: { courseId: string }) => {
  const course = await prismadb.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: true,
    },
  });

  if (!course) {
    return { error: "Course doesn't exist" };
  }

  return { success: course };
};

// ************************
// Create course
// ************************
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

// ************************
// Edit course
// ************************
export const editCourse = async ({
  data,
  courseId,
}: {
  data: any;
  courseId: any;
}) => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const resp = await getCourseById({ courseId });

    if (resp.error) {
      return { error: resp.error };
    }

    const course = resp.success;

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

// ************************
// all categories for course
// ************************
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

// ************************
// specific category
// ************************
export const getCategoryById = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return category;
  } catch (error) {
    console.log({ error });
    return;
  }
};
// ************************
// all categories for course
// ************************
export const getAllCourses = async ({ userId }: { userId: string }) => {
  try {
    const courses = await prismadb.course.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return courses;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

// ************************
// Reorder course chapters
// ************************
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

// ************************
// Publish Course
// ************************
export const publishCourse = async ({ courseId }: { courseId: string }) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if course exists
    const resp = await getCourseById({ courseId });
    const course = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // check if chapter has required fields before publishing

    const requierdFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.chapters.some((chapter) => chapter.isPublished),
      course.categoryId,
    ];
    const completedFields = requierdFields.filter(Boolean).length === 6;

    if (!completedFields) {
      return { error: "Complete all required fields to publish the course" };
    }

    // publish the course
    await prismadb.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return { success: "Course has been published sucecssfully" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};

// ************************
// Unpublish Course
// ************************
export const unpublishCourse = async ({ courseId }: { courseId: string }) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if course exists
    const resp = await getCourseById({ courseId });
    const course = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // publish the course
    await prismadb.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    return { success: "Course is un published now" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};

// ************************
// Delete Course
// ************************
export const deleteCourse = async ({ courseId }: { courseId: string }) => {
  try {
    // check auth
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    // check if course exists
    const resp = await getCourseById({ courseId });
    const course = resp.success;

    if (resp.error) {
      return { error: resp.error };
    }
    if (!course) {
      return { error: "Course doesn't exist" };
    }

    // delete course chapters
    for (const chapter of course.chapters) {
      let resp = await deleteChapter({ courseId, chapterId: chapter.id });
      if (resp.error) {
        return { error: resp.error };
      }
    }

    // delete the course
    await prismadb.course.delete({
      where: {
        id: courseId,
      },
    });

    return { success: "Course has been deleted successfully" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};
