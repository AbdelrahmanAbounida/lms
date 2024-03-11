"use server";
// upload a vide to mux

import { prismadb } from "@/lib/db";
import { Chapter, MuxData } from "@prisma/client";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_SECRET_KEY as string,
});

// **********************************
// upload a video to mux
// **********************************
export const createUpload = async ({
  chapter,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
}) => {
  // 1- delete video if exists
  const del_resp = await deleteMux({ chapter });

  // 2- reupload the video
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
      encoding_tier: "baseline",
    },
    cors_origin: "*",
  });

  return upload;
};

// **********************************
// retrieve a created upload
// **********************************

export const retrieveAsset = async ({ assetId }: { assetId: string }) => {
  // return an upload with its id >> note: it could have assetid but not playback
  // but mux.video.assets >> will return an object if the video is ready and has playbackid
  try {
    const asset = await mux.video.assets.retrieve(assetId); // .assets
    return asset;
  } catch (error) {
    console.log({ uploadError: error });
    return;
  }
};

export const updateMuxStatusInPrisma = async ({
  assetId,
  chapterId,
  muxId,
}: {
  assetId: string;
  chapterId: string;
  muxId: string;
}) => {
  const asset = await retrieveAsset({ assetId });

  if (asset) {
    await prismadb.muxData.update({
      where: {
        id: muxId,
        chapterId: chapterId,
      },
      data: {
        playbackId: asset.playback_ids?.[0].id,
      },
    });
    return asset;
  }
  return;
};

// **********************************
// wait till video is ready
// **********************************
export const waitTillAssetIsReady = async ({
  assetId,
}: {
  assetId: string;
}) => {
  // wait until the asset is get processed and gets a playback
  const maxAttempts = 5;
  let attempts = 0;
  const asset = await mux.video.assets.retrieve(assetId);
  while (attempts < maxAttempts) {
    if (asset && asset.status === "ready") {
      break;
    }
    attempts++;
    await waitForThreeSeconds();
  }
};

// **********************************
// Delete video
// **********************************

export const deleteMux = async ({
  chapter,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
}) => {
  try {
    // delete a video from both mux and prisma

    const existingMux = await prismadb.muxData.findUnique({
      where: {
        chapterId: chapter.id,
      },
    });

    if (existingMux) {
      await prismadb.muxData.delete({
        where: {
          id: existingMux.id,
        },
      });

      // delete it from both mux and prisma
      const asset = await mux.video.assets.retrieve(existingMux.assetId);
      if (asset) {
        await mux.video.assets.delete(existingMux.assetId);
      }
    }
  } catch (error) {
    console.log({ del_error: error });
  }
};

// **********************************
// Main Video Processing
// **********************************

export const processMuxVideo = async ({
  chapter,
  assetId,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
  assetId: string;
}) => {
  try {
    // this function should be called once u sure that the asset has a playbackid

    const asset = await mux.video.assets.retrieve(assetId);
    // Check if asset status is "ready"
    if (asset && asset.status === "ready") {
      // 3- Update database with asset details

      await prismadb.muxData.create({
        data: {
          chapterId: chapter.id,
          assetId: assetId,
          playbackId: asset.playback_ids?.[0].id,
        },
      });

      return { success: "Video processed successfully" };
    } else {
      // create it with assetid only
      await prismadb.muxData.create({
        data: {
          chapterId: chapter.id,
          assetId: assetId,
          // playbackId: asset.playback_ids?.[0].id,
        },
      });
      return {
        success: "Please wait some time till the video is being processed",
      };
    }
  } catch (error) {
    console.error({ error });
    return { error: "Failed to process the video." };
  }
};

export const handleVideoProcessing = async (
  chapter: Chapter & { muxData?: MuxData | null },
  uploadId: string
) => {
  let attempts = 0;
  while (attempts <= 10) {
    const upload = await mux.video.uploads.retrieve(uploadId);
    if (upload?.asset_id) {
      const resp = await processMuxVideo({
        chapter,
        assetId: upload.asset_id,
      });
      return resp;
    } else {
      await waitForThreeSeconds();
      attempts++;
    }
  }
  return { error: "No asset_id found for upload" };
};

const waitForThreeSeconds = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));
