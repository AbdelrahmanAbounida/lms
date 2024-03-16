import { getSearchCourses } from "@/actions/student/courses";
import { getAllCategories } from "@/actions/teacher/courses";
import Categories from "@/app/(dashboard)/_components/student/categories";
import CourseCard from "@/app/(dashboard)/_components/student/course-card";
import SearchInput from "@/app/(dashboard)/_components/student/search-input";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

interface SearchParamsProps {
  searchParams: {
    title: string;
    categoryId: string;
    search: boolean;
  };
}

const BrowseStudent = async ({ searchParams }: SearchParamsProps) => {
  const categories = await getAllCategories();

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/");
  }

  const courses = await getSearchCourses({
    userId: session.user.id,
    ...searchParams,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex xl:hidden p-4">
        <SearchInput />
      </div>
      <Categories items={categories} />

      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-6  gap-6">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            id={course.id}
            category={course.category?.name!}
            chaptersLength={course.chapters.length}
            imageUrl={course.imageUrl!}
            progress={course.progress!}
            title={course.title}
            price={course.price}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center text-lg text-muted-foreground mt-10">
          No Courses found
        </div>
      )}
    </div>
  );
};

export default BrowseStudent;
