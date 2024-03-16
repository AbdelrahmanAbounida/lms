import { getChapterData } from "@/actions/student/chapters";
import ChapterViedoViewer from "@/app/(course)/_components/chapter-video-viewer";
import Banner from "@/app/(dashboard)/_components/banner";
import { redirect } from "next/navigation";
import React from "react";

const StudentCoursChapterView = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const data = await getChapterData({ ...params });

  if (!data) {
    return redirect("/");
  }
  const {
    chapter,
    course,
    nextChapter,
    muxData,
    purchase,
    attachments,
    userId,
    userProgress,
  } = data;

  const isLocked = !chapter.isFree && !purchase;

  return (
    <div className="flex flex-col ">
      {/** if chapter is locked in case no purchase and chatpter is not free */}

      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase this course to watch this chapter"
        />
      )}

      {/** video viewer in case user is locked , loading state, video in case of free */}
      {/** purchase ui, go to next chapter button */}
      <ChapterViedoViewer
        playbackId={muxData?.playbackId!}
        chapter={chapter}
        course={course}
        purchase={purchase!}
        attachments={attachments}
        userId={userId}
        nextChapter={nextChapter!}
        isCompleted={userProgress?.isCompleted!}
      />
    </div>
  );
};

export default StudentCoursChapterView;
