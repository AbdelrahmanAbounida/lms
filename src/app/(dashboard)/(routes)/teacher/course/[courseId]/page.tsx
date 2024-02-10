import CourseDescriptionForm from "@/app/(dashboard)/_components/teacher/course/course-description-form";
import CourseImageForm from "@/app/(dashboard)/_components/teacher/course/course-image-form";
import CoursetitleForm from "@/app/(dashboard)/_components/teacher/course/course-title-form";
import { IconBadge } from "@/components/ui/icon-badge";
import { getCourseById } from "@/lib/teacher";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";

interface Params {
  courseId: string;
}

const Coursepage = async ({ params }: { params: Params }) => {
  const courseId = params.courseId;
  const currentCourse = await getCourseById(courseId);

  const requiredFields = [
    currentCourse?.title,
    currentCourse?.description,
    currentCourse?.price,
    currentCourse?.imageUrl,
    currentCourse?.categoryId,
  ];

  const totalfields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalfields})`;

  if (!currentCourse) {
    return redirect("/teacher/course/all");
  }
  return (
    <div className="w-full flex p-4 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium">Course Setup</h1>

        <div className="text-slate-600 text-md">
          Complete all fields {completionText}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-12 ">
        <div className="bg-green-50 rounded-full">
          <IconBadge
            icon={MdOutlineDashboardCustomize}
            size={"lg"}
            variant={"ghost"}
          />
        </div>
        <h1 className="font-md text-xl">Customize Your course</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3  gap-5  mx-auto w-full">
        <CoursetitleForm title={currentCourse?.title} courseId={courseId} />
        <CourseDescriptionForm
          description={currentCourse?.description}
          courseId={courseId}
        />
        <CourseImageForm courseId={courseId} image="" />
      </div>
    </div>
  );
};

export default Coursepage;
