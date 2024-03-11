"use client";
import { Chapter, MuxData } from "@prisma/client";
import MuxCustomUploader from "../mux/MuxUploader";

export const UploadVideoForm = ({
  chapter,
  setediting,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
  setediting: any;
}) => {
  // submit video

  return (
    <section className="container">
      <MuxCustomUploader chapter={chapter} setediting={setediting} />
    </section>
  );
};

export default UploadVideoForm;
