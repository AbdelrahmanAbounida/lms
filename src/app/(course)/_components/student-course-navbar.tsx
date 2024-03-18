"use client";
import React from "react";
import { CgMenu } from "react-icons/cg";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import StudentCourseSidebar, {
  StudentCourseSidebarProps,
} from "./student-course-sidebar";
import PropfileSettings from "@/app/(dashboard)/_components/profile-avatar";
import { RxExit } from "react-icons/rx";
import Link from "next/link";

const StudentCourseNavbar = ({
  title,
  chapters,
  courseId,
  userId,
  purchase,
  image,
  name,
  email,
}: StudentCourseSidebarProps & {
  image?: string;
  name?: string;
  email?: string;
}) => {
  return (
    <div className="px-3 w-full text-md py-3 shadow-sm flex items-center justify-between border-b  ">
      <Sheet>
        <SheetTrigger asChild className="md:hidden ">
          <Button variant={"ghost"}>
            <CgMenu size={25} />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 w-[300px]">
          <StudentCourseSidebar
            chapters={chapters}
            title={title!}
            courseId={courseId}
            userId={userId}
            purchase={purchase}
          />
        </SheetContent>
      </Sheet>

      <div className="  md:ml-auto md:mr-3 space-x-3 flex items-center ">
        {
          <Link
            href={"/student/browse"}
            className="px-7 text-md font-medium flex gap-1 items-center justify-center bg-slate-100 p-1 transition-all hover:bg-slate-200/80 rounded-md"
          >
            <RxExit className="w-4 h-4 mr-3" />
            Exit
          </Link>
        }

        <PropfileSettings
          image={image as string}
          name={name as string}
          email={email as string}
        />
      </div>
    </div>
  );
};

export default StudentCourseNavbar;
