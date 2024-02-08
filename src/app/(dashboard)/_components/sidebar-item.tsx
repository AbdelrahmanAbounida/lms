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
  const isActive =
    itemprops.href == currentPath ||
    (currentPath.startsWith(itemprops.href) && itemprops.href !== "/");

  return (
    <Link
      href={itemprops.href}
      className={cn(
        "flex text-md text-[16px] items-center w-full px-3 py-3 rounded-md text-slate-900 hover:bg-slate-100 ",
        isActive && "hover:bg-green-50/70 bg-green-50/70 text-green-700"
      )}
    >
      {<itemprops.icon className={cn(isActive && "text-green-700")} />}
      <span className="ml-3 flex-1  whitespace-nowrap">{itemprops.title}</span>
    </Link>
  );
};

export default SidebarItem;
