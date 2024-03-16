import { Progress } from "@radix-ui/react-progress";
import React from "react";

const CourseProgress = ({ userprogress }: { userprogress: number }) => {
  return (
    <div className="flex flex-col w-full p-6 gap-1">
      <Progress value={userprogress || 0} className="mt-2" />
      <div className="text-emerald-600 text-sm font-medium">
        {userprogress}% Complete
      </div>
    </div>
  );
};

export default CourseProgress;
