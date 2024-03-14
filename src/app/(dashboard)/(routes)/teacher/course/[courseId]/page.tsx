import { getAllCategories } from "@/actions/teacher/courses";
import CourseCategoryForm from "@/app/(dashboard)/_components/teacher/course/course-category-form";
import CourseDescriptionForm from "@/app/(dashboard)/_components/teacher/course/course-description-form";
import CourseImageForm from "@/app/(dashboard)/_components/teacher/course/course-image-form";
import CoursePriceForm from "@/app/(dashboard)/_components/teacher/course/course-price-form";
import CoursetitleForm from "@/app/(dashboard)/_components/teacher/course/course-title-form";
import { IconBadge } from "@/components/ui/icon-badge";
import { getCourseById } from "@/lib/teacher";
import { LuCircleDollarSign } from "react-icons/lu";
import { redirect } from "next/navigation";
import React from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { BsList } from "react-icons/bs";
import CourseAttachmentForm from "@/app/(dashboard)/_components/teacher/course/course-attachment-form.";
import CourseChapterForm from "@/app/(dashboard)/_components/teacher/course/course-chapter-form";
import { BsFillFilePdfFill } from "react-icons/bs";
import CourseActions from "@/app/(dashboard)/_components/teacher/course/course-actions";
import Banner from "@/app/(dashboard)/_components/banner";

interface Params {
  courseId: string;
}

const Coursepage = async ({ params }: { params: Params }) => {
  const courseId = params.courseId;
  const currentCourse = await getCourseById(courseId);
  const categories = await getAllCategories();

  const requiredFields = [
    currentCourse?.title,
    currentCourse?.description,
    currentCourse?.price,
    currentCourse?.imageUrl,
    currentCourse?.categoryId,
    currentCourse?.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalfields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalfields})`;

  if (!currentCourse) {
    return redirect("/teacher/course/all");
  }
  return (
    <div className="w-full flex  flex-col gap-5">
      {!currentCourse.isPublished ? (
        <Banner
          variant={currentCourse.isPublished ? "success" : "warning"}
          label={
            currentCourse.isPublished
              ? "This Course is published now."
              : "This Course is unpublished. it will not be visible to your students"
          }
        />
      ) : (
        <></>
      )}

      <CourseActions
        courseId={courseId}
        completedFields={completedFields}
        courseName={currentCourse.title}
        isPublished={currentCourse.isPublished}
        requiredFields={requiredFields.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full 2xl:max-w-[92%] 2xl:mx-auto">
        <div className="flex flex-col gap-5  mt-12">
          <div className="flex items-center gap-2  ">
            <div className="bg-green-50 rounded-full">
              <IconBadge
                icon={MdOutlineDashboardCustomize}
                size={"lg"}
                variant={"ghost"}
              />
            </div>
            <h1 className="font-medium text-xl">Customize Your course</h1>
          </div>
          <CoursetitleForm title={currentCourse?.title} courseId={courseId} />
          <CourseDescriptionForm
            description={currentCourse?.description}
            courseId={courseId}
          />
          <CourseImageForm
            courseId={courseId}
            image={currentCourse.imageUrl as string}
          />
          <CourseCategoryForm
            courseId={currentCourse.id}
            categoryId={currentCourse.categoryId as string}
            categories={categories}
          />
        </div>

        <div className="flex flex-col gap-5 gap-y-6 mt-12">
          {/** Course Chapters **/}

          <div className="flex items-center gap-2  ">
            <div className="bg-green-50 rounded-full">
              <IconBadge icon={BsList} size={"lg"} variant={"ghost"} />
            </div>
            <h1 className="font-medium text-xl">Course Chapters</h1>
          </div>
          <CourseChapterForm
            courseId={currentCourse.id}
            chapters={currentCourse.chapters}
          />

          {/** Course Pricing **/}

          <div className="flex items-center gap-2  ">
            <div className="bg-green-50 rounded-full">
              <IconBadge
                icon={LuCircleDollarSign}
                size={"lg"}
                variant={"ghost"}
              />
            </div>
            <h1 className="font-medium text-xl">Sell Your Course</h1>
          </div>

          <CoursePriceForm
            courseId={currentCourse.id}
            price={currentCourse.price as number}
          />

          {/** Course Attachments **/}
          <div className="flex items-center gap-2  ">
            <div className="bg-green-50 rounded-full">
              <IconBadge
                icon={BsFillFilePdfFill}
                size={"lg"}
                variant={"ghost"}
              />
            </div>
            <h1 className="font-medium fon text-xl">Resources & Attachments</h1>
          </div>

          <CourseAttachmentForm
            courseId={currentCourse.id}
            attachments={currentCourse.attachments as []}
          />
        </div>
      </div>
    </div>
  );
};

export default Coursepage;
