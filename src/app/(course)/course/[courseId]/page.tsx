import { prismadb } from "@/lib/db";
import { redirect } from "next/navigation";

interface StudentCourseParams {
  params: {
    courseId: string;
  };
}

const StudentCourse = async ({ params }: StudentCourseParams) => {
  const course = await prismadb.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: true,
    },
  });
  if (!course || !course.chapters.length) {
    return redirect("/");
  }

  return redirect(
    `/course/${params.courseId}/chapter/${course.chapters[0].id}`
  );
};

export default StudentCourse;
