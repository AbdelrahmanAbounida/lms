"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGIONN!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEYY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEYY!,
  },
});

const generateRandomKey = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const uploadS3Image = async ({
  courseId,
  checksum,
}: {
  courseId: any;
  checksum: string;
}) => {
  const session = await auth();

  try {
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return { error: "Course doesn't exist" };
    }

    const generatedKey =
      course.imageUrl?.split("/").pop() || generateRandomKey();

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAMEE!,
      Key: generatedKey,
      Metadata: {
        courseId,
      },
      ChecksumSHA256: checksum,
    });
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60 seconds
    );

    await prismadb.course.update({
      where: {
        id: courseId,
      },
      data: {
        imageUrl: url.split("?")[0],
      },
    });

    return { url };
  } catch (error) {
    console.log({ error });
    return { error: "Failed to upload the image" };
  }
};

export const deletePdfAttachment = async ({
  courseId,
  attachmentKey,
  attachmentId,
}: {
  courseId: any;
  attachmentKey: string;
  attachmentId: string;
}) => {
  try {
    const attachment = await prismadb.attachment.findFirst({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    if (!attachment) {
      return { error: "attachment doesn't exist" };
    }

    const url = attachment.url;
    const key = url?.split("/").slice(-1)[0];

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Metadata: {
        courseId,
      },
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await prismadb.attachment.delete({
      where: {
        id: attachment.id,
      },
    });

    return { success: "attachment deleted" };
  } catch (error) {
    console.log({ error });
    return { error: "Something went wrong" };
  }
};

export const uploadAttachments = async ({
  courseId,
  checksum,
  attachmentName,
}: {
  courseId: any;
  checksum: string;
  attachmentName: string;
}) => {
  const session = await auth();

  try {
    if (!session || !session.user || !session.user.id) {
      return { error: "unauthorized" };
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!course) {
      return { error: "Course doesn't exist" };
    }

    if (course.attachments.length >= 5) {
      return { error: "Course can't have more than 5 attachments" };
    }

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: generateRandomKey(),
      Metadata: {
        courseId,
      },
      ChecksumSHA256: checksum,
    });
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60 seconds
    );

    await prismadb.attachment.create({
      data: {
        courseId: courseId,
        name: attachmentName,
        url: url.split("?")[0],
      },
    });

    return { url };
  } catch (error) {
    console.log({ error });
    return { error: "Failed to upload the image" };
  }
};
