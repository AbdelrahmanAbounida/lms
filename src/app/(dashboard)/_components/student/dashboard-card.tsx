import { cn } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";
import React from "react";

const DashboardCard = ({
  variant,
  numOfCourses,
}: {
  variant: "inprogress" | "completed";
  numOfCourses: number;
}) => {
  const Icon = variant === "completed" ? CheckCircle : Clock;
  return (
    <div className="flex border rounded-md p-4 items-center justify-start w-full shadow-sm">
      <div className="flex gap-3 ">
        <Icon
          className={cn(
            "w-11 h-11 p-2 rounded-full",
            variant === "inprogress"
              ? " bg-slate-100 text-slate-700"
              : " bg-green-100 text-green-700"
          )}
        />

        <div className="flex flex-col ">
          <p className="text-lg font-medium">
            {variant === "completed" ? "Completed" : "In Progress"}
          </p>
          <p className="text-sm text-slate-400">
            {numOfCourses} {numOfCourses <= 1 ? "Course" : "Courses"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
