"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Attachment } from "@prisma/client";
import { UploadPDFForm } from "../s3/upload-pdf";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { deletePdfAttachment } from "@/actions/teacher/s3";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { IoMdDownload } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";

export const downloadAttachment = async ({
  attachment,
}: {
  attachment: Attachment;
}) => {
  try {
    const response = await fetch(attachment.url);
    if (!response.ok) {
      toast.error(`Failed to download attachment: ${response.statusText}`);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log({ error });
    toast.error("Something went wrong");
  }
};

const CourseAttachmentForm = ({
  attachments,
  courseId,
}: {
  attachments: Attachment[];
  courseId: any;
}) => {
  const [editing, setediting] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAttachment = async ({
    attachment,
  }: {
    attachment: Attachment;
  }) => {
    try {
      setdeleteLoading(true);
      const attachmentKey = attachment.url?.split("/").pop();
      const res = await deletePdfAttachment({
        courseId,
        attachmentId: attachment.id,
        attachmentKey: attachmentKey as string,
      });

      if (res?.success) {
        toast.success(res.success);
        return;
      }
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.error("Something went wrong");
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setdeleteLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col bg-slate-100 rounded-md  w-full">
      <div className="w-full flex items-center justify-between">
        <h3 className="font-medium text-lg">Course Attachments</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <CiCirclePlus className="h-5 w-5 mr-2" />
              upload attachment
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3">
        {!editing ? (
          <div className="flex w-full items-center  justify-center">
            {attachments &&
              attachments.map((attachment, index) => (
                <div
                  className="w-full flex bg-green-50 items-center justify-between px-5 mx-2 p-2 rounded-md  gap-3 "
                  key={index}
                >
                  {attachment.name}
                  {deleteLoading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <div className="flex gap-1 items-center justify-center">
                      <MdDelete
                        onClick={() => handleDeleteAttachment({ attachment })}
                        size={22}
                        color="red"
                        className="text-red-500 cursor-pointer"
                      />
                      <IoMdDownload
                        onClick={() => downloadAttachment({ attachment })}
                        size={22}
                        className="text-gray-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <UploadPDFForm courseId={courseId} />
        )}
      </div>
    </div>
  );
};

export default CourseAttachmentForm;
