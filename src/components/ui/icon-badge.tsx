import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";

const backgroundVariants = cva(
  "rounded-full flex items-center justify-center m-1 font-bold m-1 p-1",
  {
    variants: {
      variant: {
        default: "text-white bg-green-600",
        ghost: "text-green-600 ",
        secondary: "text-white bg-slate-300",
        error: "text-white bg-red-500",
      },
      size: {
        default: "h-7 w-7",
        sm: "h-6 w-6",
        md: "h-7 w-7",
        lg: "h-8 w-8",
        xl: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconBadgeProps
  extends VariantProps<typeof backgroundVariants> {
  icon: IconType | LucideIcon;
}

export const IconBadge = ({ variant, size, icon: Icon }: IconBadgeProps) => {
  return <Icon className={cn(backgroundVariants({ variant, size }))} />;
};
