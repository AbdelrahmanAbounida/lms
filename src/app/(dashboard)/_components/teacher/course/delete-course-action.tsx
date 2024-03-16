"use client";
import { deleteCourse } from "@/actions/teacher/courses";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DeleteCourseAction = ({
  courseId,
  courseName,
  type = "button",
}: {
  courseId: string;
  courseName: string;
  type: "dropdown" | "button";
}) => {
  const [isDeleting, setisDeleting] = useState(false);
  const router = useRouter();

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

  return (
    <ConfirmModal loading={isDeleting} isDestroy onConfirm={handledeleteCourse}>
      <Button
        disabled={isDeleting}
        variant={type === "button" ? "destructive" : "ghost"}
        className={cn(
          type === "button"
            ? "flex gap-2 px-7  hover:bg-red-600/90 bg-red-600"
            : " font-normal bg-red-600 hover:bg-red-600/90 hover:text-white text-white w-full rounded-sm h-full p-[6px] mt-1 flex text-start justify-start"
        )}
      >
        Delete
      </Button>
    </ConfirmModal>
  );
};

export default DeleteCourseAction;
