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
import { editCourse } from "@/actions/teacher/courses";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const CourseDescriptionForm = ({
  description,
  courseId,
}: {
  description: any;
  courseId: any;
}) => {
  const [pending, startTransition] = useTransition();
  const [editing, setediting] = useState(false);
  const router = useRouter();

  const coursedescriptionSchema = z.object({
    description: z
      .string()
      .min(1, { message: "Description shouldn't be null" }),
  });

  const form = useForm<z.infer<typeof coursedescriptionSchema>>({
    resolver: zodResolver(coursedescriptionSchema),
    defaultValues: {
      description,
    },
  });

  const onSubmit = async (data: z.infer<typeof coursedescriptionSchema>) => {
    startTransition(() => {
      editCourse({ data, courseId }).then((resp: any) => {
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
        <h3 className="font-medium text-lg">Course Description</h3>
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
          <div className="text-slate-500">
            {description?.length > 0 ? description : "No Description"}{" "}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="bg-white"
                        placeholder="Course description"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Update
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CourseDescriptionForm;
