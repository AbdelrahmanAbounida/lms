"use client";
import MuxViewer from "@/app/(dashboard)/_components/teacher/mux/MuxViewer";
import { Download, Lock } from "lucide-react";
import React from "react";
import { Attachment, Chapter, Course, Purchase } from "@prisma/client";
import ChapterViewFooter from "./chapter-view-footer";
import { downloadAttachment } from "@/app/(dashboard)/_components/teacher/course/course-attachment-form.";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { updateUserProgress } from "@/actions/student/get-progress";

const ChapterViedoViewer = ({
  userId,
  playbackId,
  chapter,
  course,
  purchase,
  attachments,
  nextChapter,
  isCompleted,
}: {
  userId: string;
  playbackId: string;
  chapter: Chapter;
  course: Course;
  purchase: Purchase;
  attachments: Attachment[];
  nextChapter: Chapter;
  isCompleted: boolean;
}) => {
  const handleDownload = async ({ attachment }: { attachment: Attachment }) => {
    try {
      await downloadAttachment({ attachment });
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };

  const router = useRouter();
  const { onOpenConfetti } = useConfetti();
  const nextChapterId = nextChapter?.id;

  const handleProgressOnVideoEnd = async () => {
    try {
      const progress = await updateUserProgress({
        userId,
        chapterId: chapter.id,
        isCompleted: !isCompleted,
      });

      if (!isCompleted && !nextChapterId && progress === 100) {
        onOpenConfetti();
      }
      if (!isCompleted && nextChapterId) {
        toast.success("Chapter completed successfully");
        router.push(`/course/${course.id}/chapter/${nextChapterId}`);
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log({ error });
    }
  };

  return (
    <div className="flex flex-col w-full px-5 xl:px-14 rounded-lg pt-6 relative">
      <div className=" relative aspect-video  rounded-lg ">
        {playbackId && (chapter.isFree || purchase) ? (
          <MuxViewer
            playbackId={playbackId}
            handleProgressOnVideoEnd={handleProgressOnVideoEnd}
          />
        ) : (
          <div className="flex flex-col gap-y-1">
            <div className="text-secondary mb-0 xl:mb-36 rounded-md  absolute top-0 inset-0 w-full">
              <div className="bg-slate-800 flex items-center justify-center flex-col h-full">
                <Lock className="h-8 w-8 text-white" />
                This chapter is locked
              </div>

              {/** in case course is not free and user didn't pay  */}
              <ChapterViewFooter
                courseId={course.id}
                isFree={chapter.isFree}
                price={course.price!}
                title={chapter.title}
                purchase={purchase}
                handleProgressOnVideoEnd={handleProgressOnVideoEnd}
                isCompleted={isCompleted}
              />
            </div>
          </div>
        )}

        {/** in case course is free or user paied */}
        {playbackId && (chapter.isFree || purchase) && (
          <ChapterViewFooter
            courseId={course.id}
            isFree={chapter.isFree}
            price={course.price!}
            title={chapter.title}
            purchase={purchase}
            handleProgressOnVideoEnd={handleProgressOnVideoEnd}
            isCompleted={isCompleted}
          />
        )}

        {attachments.length > 0 && (
          <div className="mt-2 p-3 flex flex-col gap-2 mb-3">
            {attachments?.map((attachment, index) => (
              <div
                className="max-w-lg flex bg-green-100 items-center justify-between px-5 mx-2 p-2 rounded-md  gap-3 "
                key={index}
              >
                {attachment.name}
                <Download
                  onClick={() => handleDownload({ attachment })}
                  className="w-9 h-9 text-white bg-green-600 cursor-pointer hover:bg-green-600/80  rounded-full p-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterViedoViewer;
