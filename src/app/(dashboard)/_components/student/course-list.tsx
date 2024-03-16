import React from "react";
import CourseCard from "./course-card";

export const CourseList = ({ courses }: { courses: any[] }) => {
  console.log({ courses });
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-6  gap-6">
      {courses.map((course, index) => (
        <CourseCard
          key={index}
          id={course.course?.id}
          category={course.course?.category?.name}
          chaptersLength={course.course?.chapters?.length}
          imageUrl={course.course?.imageUrl!}
          progress={course.progress}
          title={course.course?.title}
          price={course.course?.price}
        />
      ))}
    </div>
  );
};
