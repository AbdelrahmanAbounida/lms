"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const NotAllwed = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col space-y-5 h-screen w-full items-center justify-center">
      <div className="flex p-11 gap-4 text-lg rounded-lg border flex-col justify-center items-center ">
        <span className="font-bold">404 </span>
        <div className="">You are not Allowed to see teacher Mode</div>
        <Button
          onClick={() => router.push("/")}
          className="bg-green-600 px-10 text-md hover:opacity-95 hover:bg-green-600"
          size={"lg"}
          variant={"default"}
        >
          go back
        </Button>
      </div>
    </div>
  );
};

export default NotAllwed;
