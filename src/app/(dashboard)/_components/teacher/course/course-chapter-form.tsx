"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MdEdit } from "react-icons/md";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editCourse, reorderChapters } from "@/actions/teacher/courses";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Chapter } from "@prisma/client";
import { ChapterList } from "../course-chapters/chapter-list";
import { Loader2 } from "lucide-react";
import { createCourseChapter } from "@/actions/teacher/chapters";

const CourseChapterForm = ({
  chapters,
  courseId,
}: {
  chapters: Chapter[];
  courseId: any;
}) => {
  const [pending, startTransition] = useTransition();
  const [creating, setcreating] = useState(false);
  const [ordering, setordering] = useState(false);
  const router = useRouter();

  const courseTitleSchema = z.object({
    title: z.string().min(1, { message: "title is required" }),
  });

  const form = useForm<z.infer<typeof courseTitleSchema>>({
    resolver: zodResolver(courseTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof courseTitleSchema>) => {
    startTransition(() => {
      createCourseChapter({ title: data.title, courseId }).then((resp: any) => {
        if (resp?.error) {
          toast.error(resp.error);
        } else {
          toast.success(resp?.success);
          router.refresh();
          setcreating(false);
        }
      });
    });
  };

  const onEdit = async (chapterId: string) => {
    setordering(true);
    router.push(`/teacher/course/${courseId}/chapters/${chapterId}`);
  };
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setordering(true);
      const resp = await reorderChapters({
        orderedChapters: updateData,
        courseId,
      });

      if (resp.error) {
        toast.error(resp.error);
        return;
      }
      if (resp.success) {
        toast.success("Chapters Reordered successfully");
        return;
      }
      toast.error("Something went wrong");
    } catch (error) {
      console.log({ error });
    } finally {
      setordering(false);
    }
  };
  return (
    <div className="p-4 flex flex-col bg-slate-100 rounded-md  w-full relative">
      {ordering && (
        <div className="absolute top-0 right-0 w-full h-full bg-slate-500/20 flex rounded-md items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-green-600 " />
        </div>
      )}
      <div className="w-full flex items-center justify-between">
        <h3 className="font-medium text-lg">Course Chapters</h3>
        <Button
          variant={"secondary"}
          onClick={() => setcreating((prev) => !prev)}
        >
          {creating ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <IoIosAddCircleOutline className="h-4 w-4 mr-2" />
              Add a chapter
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!creating ? (
          <div className="text-slate-500">
            {chapters.length == 0 ? (
              "No Chapters"
            ) : (
              <ChapterList
                items={chapters}
                onEdit={onEdit}
                onReorder={onReorder}
              />
            )}{" "}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Course Title"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-5" type="submit">
                Create
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CourseChapterForm;
