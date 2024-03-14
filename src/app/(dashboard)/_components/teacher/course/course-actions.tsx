"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ConfirmModal from "../modals/confirm-modal";
import toast from "react-hot-toast";
import Spinner from "@/app/(auth)/_components/spinner";
import { useRouter } from "next/navigation";
import {
  deleteCourse,
  publishCourse,
  unpublishCourse,
} from "@/actions/teacher/courses";

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
  console.log({ isPublished });
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
      router.refresh();
    } catch (error) {
      console.log({ error });
    } finally {
      setispublishing(false);
    }
  };

  // delete course
  const handledeleteCourse = async () => {
    try {
      setisDeleting(true);
      toast.promise(deleteCourse({ courseId }), {
        error: `Failed to delete ${courseName}`,
        loading: `Deleting ${courseName}`,
        success: `${courseName} has been deleted`,
      });
      router.push(`/teacher/all`);
    } catch (error) {
      console.log({ error });
    } finally {
      setisDeleting(false);
    }
  };

  const [ispublishing, setispublishing] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);

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
          disabled={
            completedFields !== requiredFields || ispublishing || isDeleting
          }
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

        <ConfirmModal
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
        </ConfirmModal>
      </div>
    </div>
  );
};

export default CourseActions;
