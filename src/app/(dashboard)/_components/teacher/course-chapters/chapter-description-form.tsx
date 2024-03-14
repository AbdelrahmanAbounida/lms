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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Preview from "./preview";
import Editor from "./editor";
import { editChapter } from "@/actions/teacher/chapters";

const ChapterDescriptionForm = ({
  description,
  courseId,
  chapterId,
}: {
  description?: string;
  courseId: string;
  chapterId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [editing, setediting] = useState(false);
  const router = useRouter();

  const chapterTitleSchema = z.object({
    description: z.string().min(1, { message: "title is required" }),
  });

  const form = useForm<z.infer<typeof chapterTitleSchema>>({
    resolver: zodResolver(chapterTitleSchema),
    defaultValues: {
      description,
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
        <h3 className="font-medium text-lg">Chapter Description</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <MdEdit className="h-4 w-4 mr-2" />
              Edit Description
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          description ? (
            <Preview value={description} />
          ) : (
            <div className="text-slate-500 text-sm">No Description</div>
          )
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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

export default ChapterDescriptionForm;
