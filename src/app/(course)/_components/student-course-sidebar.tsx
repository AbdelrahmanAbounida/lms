import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chapter, Purchase, userProgress } from "@prisma/client";
import React from "react";
import StudentCourseSiedbarItem from "./student-course-sidebar-item";
import { getUserProgress } from "@/actions/student/get-progress";

export interface StudentCourseSidebarProps {
  title: string;
  chapters: (Chapter & { userProgress: userProgress[] | null })[]; // ChapterWithUserProgress[];
  courseId: string;
  userId: string;
  purchase: Purchase;
}

const StudentCourseSidebar = async ({
  title,
  chapters,
  courseId,
  userId,
  purchase,
}: StudentCourseSidebarProps) => {
  const userprogress = await getUserProgress({ courseId, userId });

  // const pur = await prismadb.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId,
  //     },
  //   },
  // });

  return (
    <div className="border-r border h-full w-full">
      {/** Course title, progress */}
      <div className="flex p-3 items-center justify-center  top-0 left-0 w-full  border-b">
        <div className="flex flex-col w-full p-6 gap-1">
          <div className="text-xl font-medium">{title}</div>
          <Progress value={userprogress || 0} className="mt-2" />

          <div className="text-emerald-600 text-sm font-medium">
            {userprogress}% Complete
          </div>
        </div>
      </div>

      {/** Chapters */}
      <ScrollArea className="h-full w-full rounded-md border">
        {chapters.map((chapter, index) => (
          <StudentCourseSiedbarItem
            chapter={chapter}
            key={index}
            userProgress={chapter.userProgress ? chapter.userProgress[0] : null}
            isLocked={!purchase && !chapter.isFree}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default StudentCourseSidebar;
