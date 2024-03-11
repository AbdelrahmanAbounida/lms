import MuxPlayer from "@mux/mux-player-react";

export const runtime = "edge";

const MuxViewer = ({ playbackId }: { playbackId: string }) => {
  return (
    <div className="bg-black aspect-video w-full h-full flex">
      <MuxPlayer
        className="w-full"
        playbackId={playbackId}
        metadata={{ player_name: "with-mux-video" }}
        accentColor="rgb(220 38 38)"
      />
    </div>
  );
};

export default MuxViewer;
