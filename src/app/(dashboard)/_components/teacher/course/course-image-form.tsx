"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { UploadImageForm } from "../s3/upload-image";
import Image from "next/image";
import { ImageIcon } from "@radix-ui/react-icons";
import { CiCirclePlus } from "react-icons/ci";

const CourseImageForm = ({
  image,
  courseId,
}: {
  image: string;
  courseId: any;
}) => {
  const [editing, setediting] = useState(false);

  return (
    <div className="p-6 flex flex-col bg-slate-100 rounded-md  w-full">
      <div className="w-full flex items-center justify-between">
        <h3 className="font-medium text-lg">Course image</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <CiCirclePlus className="h-5 w-5 mr-2" />
              Edit image
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          <div className="flex w-full items-center  justify-center">
            {image ? (
              <div className="relative aspect-video mt-2 border h-52 w-full">
                <Image
                  className="rounded-md object-fill " // flex w-full lg:w-[500px] h-[200px] // w-[80%] max-h-44 mx-auto w-full
                  src={image}
                  alt="course image"
                  // width={100}
                  // height={100}
                  fill
                />
              </div>
            ) : (
              <div className="flex items-center h-60 w-full rounded-md justify-center bg-slate-200">
                <ImageIcon className="h-10 w-10 text-slate-500" />
              </div>
            )}
          </div>
        ) : (
          <UploadImageForm courseId={courseId} />
        )}
      </div>
    </div>
  );
};

export default CourseImageForm;
