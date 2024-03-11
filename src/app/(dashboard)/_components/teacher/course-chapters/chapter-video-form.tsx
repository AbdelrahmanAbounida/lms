"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { UploadImageForm } from "../s3/upload-image";
import { VideoIcon } from "@radix-ui/react-icons";
import { CiCirclePlus } from "react-icons/ci";
import { Chapter, MuxData } from "@prisma/client";
import { FaVideo } from "react-icons/fa";
import UploadVideoForm from "./upload-video-form";
import MuxViewer from "../mux/MuxViewer";
import { retrieveAsset, updateMuxStatusInPrisma } from "@/actions/teacher/mux";
import { prismadb } from "@/lib/db";
import { Loader2 } from "lucide-react";

const ChapterVideoForm = ({
  chapter,
  courseId,
  chapterId,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}) => {
  const [editing, setediting] = useState(false);

  const [playbackId, setplaybackId] = useState(chapter.muxData?.playbackId);

  const updateChapterPlaybackIfNotExist = async () => {
    // check if the chapter has a playback use it > else refetch it with assetid and update chapter
    const asset = await updateMuxStatusInPrisma({
      assetId: chapter.muxData?.assetId!,
      chapterId: chapter.id,
      muxId: chapter.muxData?.id!,
    });
    setplaybackId(asset?.playback_ids?.[0].id);
  };

  useEffect(() => {
    if (!playbackId) {
      updateChapterPlaybackIfNotExist();
    }
  }, [playbackId]);

  return (
    <div className="p-6 flex flex-col bg-slate-100 rounded-md  w-full">
      <div className="w-full flex items-center justify-between">
        <h3 className="font-medium text-lg">Chapter Video</h3>
        <Button
          variant={"secondary"}
          onClick={() => setediting((prev) => !prev)}
        >
          {editing ? (
            <div>Cancel</div>
          ) : (
            <div className="flex gap-1 items-center">
              <CiCirclePlus className="h-5 w-5 mr-2" />
              Add Video
            </div>
          )}
        </Button>
      </div>

      <div className="mt-3 relative p-2">
        {!editing ? (
          <div className="flex w-full items-center  justify-center">
            {chapter?.muxData?.assetId ? (
              playbackId ? (
                <div className="relative aspect-video mt-2 border h-72 w-full">
                  <MuxViewer playbackId={playbackId} />
                </div>
              ) : (
                <div className="w-full items-center flex-col flex text-sm text-center justify-center text-slate-700  border p-5 h-52 rounded-md">
                  Video can take a few minutes to process. reload the page if
                  the video doesn't appear
                  <Loader2 className="animate-spin mt-3 text-green-700" />
                </div>
              )
            ) : (
              <div className="flex items-center h-60 w-full rounded-md justify-center bg-slate-200">
                <FaVideo className="h-10 w-10 text-slate-500" />
              </div>
            )}
          </div>
        ) : (
          <UploadVideoForm setediting={setediting} chapter={chapter} />
        )}

        {/* {chapter.muxData?.playbackId && !editing && (
          <p className="text-slate-500 text-sm  p-4  ">
            {" "}
            Video can take a few minutes to process. reload the page if the
            video doesn't appear
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ChapterVideoForm;
