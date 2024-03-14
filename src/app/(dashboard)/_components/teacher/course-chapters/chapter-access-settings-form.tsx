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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { editChapter } from "@/actions/teacher/chapters";

const ChapterAccessSettingForm = ({
  isFree,
  courseId,
  chapterId,
}: {
  isFree: boolean;
  courseId: string;
  chapterId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [editing, setediting] = useState(false);
  const router = useRouter();

  const chapterAccessSchema = z.object({
    isFree: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof chapterAccessSchema>>({
    resolver: zodResolver(chapterAccessSchema),
    defaultValues: {
      isFree: Boolean(isFree),
    },
  });

  const onSubmit = async (data: z.infer<typeof chapterAccessSchema>) => {
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
        <h3 className="font-medium text-lg">Chapter access</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <MdEdit className="h-4 w-4 mr-2" />
              Edit Access
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          <div className="text-slate-500">
            {isFree ? "This chapter is free" : "This chapter is not free"}{" "}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="isFree"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        color="green"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to make this chapter free for
                        preview
                      </FormDescription>
                    </div>
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

export default ChapterAccessSettingForm;
