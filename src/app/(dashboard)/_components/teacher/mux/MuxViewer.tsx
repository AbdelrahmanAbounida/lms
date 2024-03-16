import MuxPlayer from "@mux/mux-player-react";

export const runtime = "edge";

const MuxViewer = ({ playbackId }: { playbackId: string }) => {
  return (
    <div className="bg-black aspect-video w-full flex rounded-lg relative ">
      <MuxPlayer
        className="w-full rounded-lg"
        playbackId={playbackId}
        metadata={{ player_name: "with-mux-video" }}
        accentColor="rgb(220 38 38)"
      />
    </div>
  );
};

export default MuxViewer;
