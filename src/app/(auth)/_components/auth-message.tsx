import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { cn } from "@/lib/utils";

interface authMessageProps {
  message: String;
  type: "success" | "error" | "warning";
}

const AuthMessage = ({ message, type }: authMessageProps) => {
  return (
    <div
      className={cn(
        " flex space-x-2 items-center p-5 mx-auto h-16 rounded-md text-[16px] font-normal",
        `${
          type == "error"
            ? "bg-destructive/10 text-red-600/70"
            : type == "success"
            ? "bg-emerald-500/10 text-emerald-500/85"
            : "bg-orange-500/10 text-orange-500/85"
        }`
      )}
    >
      <div className="flex gap-2 items-center h-full justify-center ">
        {type == "error" || type == "warning" ? (
          <FaExclamationTriangle size={25} />
        ) : (
          <CiCircleCheck size={19} />
        )}
        {message}
      </div>
    </div>
  );
};

export default AuthMessage;
