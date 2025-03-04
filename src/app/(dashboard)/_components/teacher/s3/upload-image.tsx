"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ReloadIcon } from "@radix-ui/react-icons";
import { uploadS3Image } from "@/actions/teacher/s3";
import { useRouter } from "next/navigation";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const UploadImageForm = ({ courseId }: { courseId: any }) => {
  const handleRejection = (e: any) => {
    setuploadImage(false);
    if (e.length > 0) {
      if (e[0].errors?.length > 0) {
        const error = e[0].errors[0].message;
        if (error) {
          toast.error(error);
        }
      }
    }
  };

  const handleAccepted = async () => {
    try {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);

        // get signed url
        const checksum = await computeSHA256(file);
        const signedURLResult = await uploadS3Image({ courseId, checksum });
        console.log({ signedURLResult });

        if (signedURLResult?.error) {
          toast.error(signedURLResult.error);
          setuploadImage(false);
          return;
        }

        if (signedURLResult?.url) {
          console.log(signedURLResult?.url);
          // get image
          await fetch(signedURLResult?.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });
          setuploadImage(false);
          toast.success("File uploaded successfully");
          router.refresh();
        } else {
          setuploadImage(false);
          toast.error("Something went wrong");
          return;
        }
      } else {
        setuploadImage(false);
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
    fileRejections,
  } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 20000000,
    onDropRejected: handleRejection,
    onDropAccepted: handleAccepted,
    onFileDialogOpen: () => setuploadImage(true),
    onFileDialogCancel: () => setuploadImage(false),
  });

  const [uploadImage, setuploadImage] = useState(false);
  const router = useRouter();

  const files = acceptedFiles?.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      {uploadImage ? (
        <div className="flex flex-col items-center w-full justify-center gap-3">
          <ReloadIcon className="mr-2 h-7 w-7 text-green-500 animate-spin" />
          Uploading image...
        </div>
      ) : (
        <div
          {...getRootProps({ className: "dropzone" })}
          className="p-9 cursor-pointer items-center justify-center text-center flex flex-col border-dashed border-2 border-slate-400 rounded-lg border-spacing-x-5 "
        >
          <input disabled={uploadImage} {...getInputProps()} />

          <FaCloudUploadAlt size={55} color="green" />
          <p className="text-slate-500 text-md  font-normal flex flex-col gap-1">
            Choose files or drag and drop here. Max Image size is 20 MB <br />
            <span className="text-md text-slate-600 font-normal">
              Aspect ratio 16:1 is recommended
            </span>
          </p>
        </div>
      )}

      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
