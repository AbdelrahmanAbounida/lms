"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/app/(auth)/_components/spinner";
import { useRouter } from "next/navigation";
import { publishCourse, unpublishCourse } from "@/actions/teacher/courses";
import DeleteCourseAction from "./delete-course-action";
import { useConfetti } from "@/hooks/use-confetti";

const CourseActions = ({
  completedFields,
  requiredFields,
  courseId,
  isPublished,
  courseName,
}: {
  completedFields: number;
  requiredFields: number;
  courseId: string;
  isPublished: boolean;
  courseName: string;
}) => {
  const router = useRouter();
  const confetti = useConfetti();
  // publish course
  const handlePublishingCourse = async () => {
    try {
      setispublishing(true);
      if (isPublished) {
        toast.promise(unpublishCourse({ courseId }), {
          error: `Failed to unpublish ${courseName}`,
          loading: `Unpublishing ${courseName}`,
          success: `${courseName} has been unpublished`,
        });
      } else {
        toast.promise(publishCourse({ courseId }), {
          error: `Failed to publish ${courseName}`,
          loading: `Publishing ${courseName}`,
          success: `${courseName} has been published `,
        });
      }
      if (!isPublished) {
        confetti.onOpenConfetti();
      }
      router.refresh();
    } catch (error) {
      console.log({ error });
    } finally {
      setispublishing(false);
    }
  };

  const [ispublishing, setispublishing] = useState(false);

  return (
    <div className="flex justify-between px-7 mt-11  w-full mx-auto">
      <div className="flex flex-col p-1 ">
        <div className="text-3xl font-medium">Course Setup</div>
        <div className="text-md text-slate-600/90 mt-2 ml-1">
          Complete all fields ({completedFields}/{requiredFields})
        </div>
      </div>

      <div className="flex justify-between gap-3 px-9 items-center p-5">
        <Button
          onClick={handlePublishingCourse}
          disabled={completedFields !== requiredFields || ispublishing}
          variant={"outline"}
          className="px-9"
        >
          {ispublishing ? (
            <div className="flex gap-1 items-center">
              <Spinner className="animate-spin w-4 h-4" />
              Loading
            </div>
          ) : isPublished ? (
            "Unpublish"
          ) : (
            "Publish"
          )}
        </Button>

        {/* <ConfirmModal
          loading={isDeleting}
          isDestroy
          onConfirm={handledeleteCourse}
        >
          <Button
            disabled={ispublishing || isDeleting}
            variant={"destructive"}
            className="flex gap-2 px-7  hover:bg-red-600/90 bg-red-600"
          >
            Delete
          </Button>
        </ConfirmModal> */}
        <DeleteCourseAction
          courseId={courseId}
          courseName={courseName}
          type="button"
        />
      </div>
    </div>
  );
};

export default CourseActions;
