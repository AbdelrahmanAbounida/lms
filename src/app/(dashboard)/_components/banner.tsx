import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border w-full  p-4 text-md text-center flex items-center ",
  {
    variants: {
      variant: {
        warning:
          "bg-yellow-200/80 text-yellow-800 border-yellow-30 text-primary",
        success: "bg-emerald-700 text-emerald-800  text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BanerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const Banner = ({ label, variant }: BanerProps) => {
  const Icon = variant == "warning" ? AlertTriangle : CheckCircleIcon;

  return (
    <div className={cn(bannerVariants({ variant }), "")}>
      <Icon className="h-5 w-5 mr-2 flex items-center " />
      {label}
    </div>
  );
};

export default Banner;
