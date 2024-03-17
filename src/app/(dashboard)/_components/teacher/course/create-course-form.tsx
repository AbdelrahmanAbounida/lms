"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { createCourse } from "@/actions/teacher/courses";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

const CreateCourseForm = () => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(() => {
      createCourse({ courseTitle: data.title })
        .then((resp: any) => {
          if (resp?.error) {
            toast.error(resp.error);
            return;
          }
          const course = resp.course;
          if (course) {
            toast.success("course created successfully");
            router.push(`/teacher/course/${course.id}`);
          } else {
            toast.success("something went wrong");
          }
        })
        .catch((error) => {
          toast.error("something went wrong");
        });
    });
  };

  return (
    <div className="w-full flex h-full md:h-screen md:justify-center md:items-center flex-col ">
      <div className="flex flex-col justify-start border rounded-md p-10 shadow-md">
        <div className="text-xl font-medium text-start">Name Your Course</div>
        <div className="text-sm text-slate-500">
          {`what would you like to name your course? Don't worry, you can change
          this later.`}
        </div>
        <Form {...form}>
          <form className="mt-7" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      className="max-w-[850px]"
                      {...field}
                      placeholder="Course title"
                    />
                  </FormControl>
                  <FormDescription>
                    What you will teach in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3 mt-7">
              <Link href={"/"}>
                <Button disabled={pending} variant={"secondary"}>
                  Cancel
                </Button>
              </Link>

              {pending ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading ...
                </Button>
              ) : (
                <Button disabled={pending} type="submit">
                  Continue
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
