"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ConfirmModal from "../modals/confirm-modal";
import toast from "react-hot-toast";
import {
  deleteChapter,
  publishChapter,
  unpublishChapter,
} from "@/actions/teacher/chapters";
import Spinner from "@/app/(auth)/_components/spinner";
import { useRouter } from "next/navigation";

const ChapterActions = ({
  completedFields,
  requiredFields,
  courseId,
  chapterId,
  isPublished,
  chapterName,
}: {
  completedFields: number;
  requiredFields: number;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  chapterName: string;
}) => {
  const router = useRouter();

  // publish chapter
  const handlePublishingChapter = async () => {
    try {
      setispublishing(true);
      if (isPublished) {
        toast.promise(unpublishChapter({ chapterId, courseId }), {
          error: `Failed to unpublish ${chapterName}`,
          loading: `Unpublishing ${chapterName}`,
          success: `${chapterName} has been unpublished`,
        });
      } else {
        toast.promise(publishChapter({ chapterId, courseId }), {
          error: `Failed to publish ${chapterName}`,
          loading: `Publishing ${chapterName}`,
          success: `${chapterName} has been published `,
        });
      }
      router.refresh();
    } catch (error) {
      console.log({ error });
    } finally {
      setispublishing(false);
    }
  };

  // delete chapter
  const handledeleteChapter = async () => {
    try {
      setisDeleting(true);
      toast.promise(deleteChapter({ chapterId, courseId }), {
        error: `Failed to delete ${chapterName}`,
        loading: `Deleting ${chapterName}`,
        success: `${chapterName} has been deleted`,
      });
      router.push(`/teacher/course/${courseId}`);
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
        <div className="text-3xl font-medium">Chapter Setup</div>
        <div className="text-md text-slate-600/90 mt-2 ml-1">
          Complete all fields ({completedFields}/{requiredFields})
        </div>
      </div>

      <div className="flex justify-between gap-3 px-9 items-center p-5">
        <Button
          onClick={handlePublishingChapter}
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
          onConfirm={handledeleteChapter}
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

export default ChapterActions;
