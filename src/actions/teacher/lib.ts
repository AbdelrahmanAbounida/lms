"use server";

export const isTeacher = ({ userId }: { userId: string }) => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
