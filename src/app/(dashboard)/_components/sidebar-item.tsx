"use client";
import { SidebarItemProps } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface itemProps extends SidebarItemProps {
  active: boolean;
}

const SidebarItem = (itemprops: itemProps) => {
  const currentPath = usePathname();
  const urlPart = itemprops.href.split("/").splice(0, 3).join("/");
  const isActive =
    itemprops.href == currentPath ||
    (currentPath.startsWith(urlPart) && urlPart !== "/");

  return (
    <Link
      href={itemprops.href}
      className={cn(
        "flex text-md text-[16px] items-center w-full px-3 py-3 rounded-md text-slate-900 hover:bg-slate-100 ",
        isActive && "hover:bg-green-50/70 bg-green-50/70 text-green-700"
      )}
    >
      {
        <itemprops.icon
          className={cn(
            "bg-green-600 h-6 w-6 p-1 rounded-full text-white",
            isActive && ""
          )}
        />
      }
      <span className="ml-3 flex-1  whitespace-nowrap">{itemprops.title}</span>
    </Link>
  );
};

export default SidebarItem;
