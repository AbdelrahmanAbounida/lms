import { createUpload, handleVideoProcessing } from "@/actions/teacher/mux";
import LibMuxUploader from "@mux/mux-uploader-react";
import { Chapter, MuxData } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MuxCustomUploader = ({
  chapter,
  setediting,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
  setediting: any;
}) => {
  const [upload, setupload] = useState<any>();

  // 1- upload video to mux
  const updateUpload = async () => {
    const res = await createUpload({ chapter });
    setupload(res);
  };

  useEffect(() => {
    updateUpload();
  }, []);

  return upload?.url ? (
    <LibMuxUploader
      style={{
        width: "full",
        // minHeight: "300px",
      }}
      endpoint={upload?.url}
      onSuccess={async () => {
        const resp = await handleVideoProcessing(chapter, upload.id);

        if (resp.success) {
          toast.success(resp.success);
        }
        if (resp.error) {
          toast.error(resp.error);
        }
        setediting(false);
      }}
    />
  ) : (
    <div className="">Loading..</div>
  );
};

export default MuxCustomUploader;
