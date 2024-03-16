"use client";
import MuxViewer from "@/app/(dashboard)/_components/teacher/mux/MuxViewer";
import { Lock } from "lucide-react";
import React from "react";

const ChapterViedoViewer = ({ playbackId }: { playbackId: string }) => {
  return (
    <div className="flex flex-col w-full  pb-20 px-5 xl:px-14 rounded-lg pt-6 relative">
      <div className=" relative aspect-video rounded-lg ">
        {playbackId ? (
          <MuxViewer playbackId={playbackId} />
        ) : (
          <div className="text-secondary gap-2 mb-0 xl:mb-16 rounded-md bg-slate-800 flex items-center justify-center flex-col absolute top-0 inset-0 w-full">
            <Lock className="h-8 w-8 text-white" />
            This chapter is locked
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterViedoViewer;
