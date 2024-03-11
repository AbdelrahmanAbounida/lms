import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ChapterTitleForm from "@/app/(dashboard)/_components/teacher/course-chapters/chapter-title-form";
import { IconBadge } from "@/components/ui/icon-badge";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import ChapterDescriptionForm from "@/app/(dashboard)/_components/teacher/course-chapters/chapter-description-form";
import { IoVideocamOutline } from "react-icons/io5";
import ChapterAccessSettingForm from "@/app/(dashboard)/_components/teacher/course-chapters/chapter-access-settings-form";
import ChapterVideoForm from "@/app/(dashboard)/_components/teacher/course-chapters/chapter-video-form";

const ChapterEditPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/");
  }

  const chapter = await prismadb.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.muxData];
  const completedFields = requiredFields.filter(Boolean).length;

  return (
    <div className="flex flex-col space-y-5 ">
      <div className="flex flex-col ml-3 mt-7">
        <div className="text-3xl font-medium">Chapter Setup</div>
        <div className="text-sm text-slate-500 mt-1 ml-1">
          Complete all fields ({requiredFields.length}/{completedFields})
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-10">
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-3  px-7 mx-auto w-full ">
          {/*** Column (1) ***/}
          <div className="flex flex-col gap-5">
            {/** Chapter Title, Description */}
            <div className="flex flex-col gap-7">
              <div className="flex items-center gap-2  ">
                <div className="bg-green-50 rounded-full">
                  <IconBadge
                    icon={MdOutlineDashboardCustomize}
                    size={"lg"}
                    variant={"ghost"}
                  />
                </div>
                <h1 className="font-medium text-2xl">Customize Your course</h1>
              </div>
              <ChapterTitleForm
                courseId={params.courseId}
                chapterId={params.chapterId}
                title={chapter.title}
              />

              <ChapterDescriptionForm
                courseId={params.courseId}
                chapterId={params.chapterId}
                description={chapter.description as string}
              />
            </div>

            {/** Access Settings */}
            <div className="flex items-center  mt-7 ">
              <div className="bg-green-50 rounded-full">
                <IconBadge
                  icon={IoVideocamOutline}
                  size={"lg"}
                  variant={"ghost"}
                />
              </div>
              <h1 className="font-medium text-2xl">Access Settings</h1>
            </div>
            <ChapterAccessSettingForm
              courseId={params.courseId}
              chapterId={params.chapterId}
              isFree={chapter.isFree}
            />
          </div>

          {/*** Column (2) ***/}
          <div className="flex flex-col gap-7 lg:ml-7">
            {/** Adding Mux Video */}
            <div className="flex items-center gap-2  ">
              <div className="bg-green-50 rounded-full">
                <IconBadge
                  icon={IoVideocamOutline}
                  size={"lg"}
                  variant={"ghost"}
                />
              </div>
              <h1 className="font-medium text-2xl">Add a Video</h1>
            </div>

            <ChapterVideoForm
              courseId={chapter.courseId}
              chapterId={chapter.id}
              chapter={chapter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditPage;
