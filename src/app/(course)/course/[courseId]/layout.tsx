import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { redirect } from "next/navigation";
import StudentCourseSidebar from "../../_components/student-course-sidebar";
import StudentCourseNavbar from "../../_components/student-course-navbar";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { courseId: string };
}>) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return redirect("/");
  }

  const course = await prismadb.course.findFirst({
    where: {
      id: params.courseId,
    },
    include: {
      purchases: {
        where: {
          userId: session.user.id,
        },
      },
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="flex ">
      <div className="hidden md:flex min-w-72 flex-col  h-screen inset-y-0 z-50 fixed">
        <StudentCourseSidebar
          chapters={course.chapters}
          title={course?.title!}
          courseId={course.id}
          userId={session.user.id}
          purchase={course.purchases && course.purchases[0]}
        />
      </div>

      <div className="flex flex-col pl-0 md:pl-72  w-full">
        <StudentCourseNavbar
          chapters={course.chapters}
          title={course?.title!}
          courseId={course.id}
          userId={session.user.id}
          purchase={course.purchases && course.purchases[0]}
          email={session.user.email!}
          image={session.user.image!}
          name={session.user.name!}
        />
        {children}
      </div>
    </div>
  );
}
