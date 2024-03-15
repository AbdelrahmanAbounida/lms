import { getAllCourses } from "@/actions/teacher/courses";
import { columns } from "@/app/(dashboard)/_components/teacher/all-courses/columns";
import { DataTable } from "@/app/(dashboard)/_components/teacher/all-courses/data-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const TeacherCourses = async () => {
  const user = await auth();

  const session = await auth();

  if (!session?.user.id) {
    return redirect("/");
  }

  const courses = await getAllCourses({ userId: session.user.id });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default TeacherCourses;
