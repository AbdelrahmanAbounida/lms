"use client";
import { cn } from "@/lib/utils";
import { Chapter, userProgress } from "@prisma/client";
import { CheckCircle, LockIcon, PauseCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const StudentCourseSiedbarItem = ({
  chapter,
  userProgress,
  isLocked,
}: {
  chapter: Chapter;
  userProgress: userProgress | null;
  isLocked: boolean;
}) => {
  const pathname = usePathname();

  const isActive = pathname.includes(chapter.id);

  const Icon = isLocked
    ? LockIcon
    : userProgress?.isCompleted
    ? CheckCircle
    : isActive
    ? PauseCircle
    : PlayCircle;

  return (
    <Link
      href={`/course/${chapter.courseId}/chapter/${chapter.id}`}
      className={cn(
        "text-md text-slate-600  border-b w-full border-slate-200 py-5 flex items-center justify-start pl-6 gap-x-2 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        userProgress?.isCompleted && "text-emerald-700 hover:text-emerald-700",
        isActive &&
          "bg-slate-200/50 text-slate-700 hover:bg-slate/20 hover:text-slate-700",

        userProgress?.isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5",
          userProgress?.isCompleted && "text-emerald-600"
        )}
      />

      {chapter.title}
    </Link>
  );
};

export default StudentCourseSiedbarItem;
