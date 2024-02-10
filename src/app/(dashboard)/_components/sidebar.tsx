"use client";
import React from "react";
import Logo from "./logo";
import {
  sidebarStudentItems,
  sidebarTeacherItems,
} from "@/constants/dashboard";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const path = usePathname();
  const isStudent = path.startsWith("/student") || path == "/";

  const sidebarRoutes = isStudent ? sidebarStudentItems : sidebarTeacherItems;

  return (
    <div className="flex h-full flex-col overflow-y-auto w-full px-3 py-4">
      <div className="mb-10 flex items-center rounded-lg px-3 py-2">
        <Logo />
      </div>

      <ul className="space-y-2 text-sm font-medium h-full">
        {sidebarRoutes.map((item, index) => (
          <div key={index} className="w-full  flex items-center">
            <SidebarItem active={index == 0} key={index} {...item} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
