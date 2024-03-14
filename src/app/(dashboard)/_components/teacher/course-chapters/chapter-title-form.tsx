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
import { editChapter } from "@/actions/teacher/chapters";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ChapterTitleForm = ({
  title,
  courseId,
  chapterId,
}: {
  title: string;
  courseId: string;
  chapterId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [editing, setediting] = useState(false);
  const router = useRouter();

  const chapterTitleSchema = z.object({
    title: z.string().min(1, { message: "title is required" }),
  });

  const form = useForm<z.infer<typeof chapterTitleSchema>>({
    resolver: zodResolver(chapterTitleSchema),
    defaultValues: {
      title,
    },
  });

  const onSubmit = async (data: z.infer<typeof chapterTitleSchema>) => {
    startTransition(() => {
      editChapter({ data, courseId, chapterId }).then((resp: any) => {
        if (resp?.error) {
          toast.error(resp.error);
        } else {
          toast.success(resp?.success);
          router.refresh();
          setediting(false);
        }
      });
    });
  };

  return (
    <div className="p-4 flex flex-col bg-slate-100 rounded-md  w-full">
      <div className="w-full flex items-center justify-between">
        <h3 className="font-medium text-lg">Course Title</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <MdEdit className="h-4 w-4 mr-2" />
              Edit Title
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          <div className="text-slate-500">{title} </div>
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
                Update
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ChapterTitleForm;
