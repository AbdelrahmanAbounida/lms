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
import { Input } from "@/components/ui/input";

const CoursePriceForm = ({
  price,
  courseId,
}: {
  price: number;
  courseId: any;
}) => {
  const [pending, startTransition] = useTransition();
  const [editing, setediting] = useState(false);
  const router = useRouter();

  const coursepriceSchema = z.object({
    price: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof coursepriceSchema>>({
    resolver: zodResolver(coursepriceSchema),
    defaultValues: {
      price,
    },
  });

  const onSubmit = async (data: z.infer<typeof coursepriceSchema>) => {
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
        <h3 className="font-medium text-lg">Course price</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <MdEdit className="h-4 w-4 mr-2" />
              Edit price
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          <div className="text-slate-500">{`$${price}` || "No price"}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-white"
                        placeholder="Set your course price"
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

export default CoursePriceForm;
