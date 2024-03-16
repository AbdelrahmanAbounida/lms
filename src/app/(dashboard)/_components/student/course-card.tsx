import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Category, Chapter, Course } from "@prisma/client";
import { IconBadge } from "@/components/ui/icon-badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number | null;
  progress?: number | undefined;
  category: string;
}) => {
  return (
    <Link href={`/course/${id}`} className=" hover:shadow-sm ">
      <Card className="w-full hover:bg-slate-100/50 transition-all  rounded-lg p-3 h-full relative">
        <CardContent className="w-full relative aspect-video rounded-md overflow-hidden">
          <Image
            src={imageUrl!}
            alt="course image"
            fill
            className="rounded-md object-cover w-full"
          />
        </CardContent>
        <CardFooter className="flex flex-col p-0 justify-start w-full  mt-3">
          <p className="font-medium text-xl justify-start flex  w-full">
            {title}
          </p>
          <p className="text-sm text-muted-foreground justify-start flex  w-full mt-1">
            {category}
          </p>

          <div className="mt-6 flex items-center text-sm md:text-xs w-full ">
            <div className="flex items-center gap-x-1 text-slate-500 w-full justify-start ">
              {/* <IconBadge size={"md"} icon={BookOpen} /> */}
              <FaBookmark className="w-4 h-4 font-medium  text-green-600" />

              <span className="text-md">
                {chaptersLength} {chaptersLength == 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex w-full">
            <div className="w-24 font-medium text-zinc-700 p-1 text-md  ">
              {price ? `${price} $` : "Free"}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <Progress
              className="mt-3 text-emerald-600 rounded-sm"
              color="green"
              value={progress || 0}
            />

            <div
              className={cn(
                "text-muted-foreground text-sm font-medium",
                progress === 100 && "text-emerald-700"
              )}
            >{`${progress || 0}% Complete`}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
