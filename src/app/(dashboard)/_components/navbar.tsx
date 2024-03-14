"use client";
import React, { useState } from "react";
import { CgMenu } from "react-icons/cg";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SideBar from "./sidebar";
import PropfileSettings from "./profile-avatar";
import { usePathname, useRouter } from "next/navigation";
import { RxExit } from "react-icons/rx";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ReloadIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const pathname = usePathname();
  const isStudentPage = pathname.startsWith("/student");
  const isTeacherPage = pathname.startsWith("/teacher");
  const router = useRouter();
  const user = useCurrentUser();

  const [routeLoading, setrouteLoading] = useState(false);

  return (
    <div className="px-3 w-full text-md py-3 shadow-sm flex items-center justify-between border-b  ">
      <Sheet>
        <SheetTrigger asChild className="md:hidden  ">
          <Button variant={"ghost"}>
            <CgMenu size={25} />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 w-[300px]">
          <SideBar />
        </SheetContent>
      </Sheet>

      <div className="  md:ml-auto md:mr-3 space-x-3 flex items-center ">
        {isTeacherPage ? (
          !routeLoading ? (
            <Button
              onClick={() => {
                setrouteLoading(true);
                router.push("/student/courses");
                setrouteLoading(false);
              }}
              variant={"secondary"}
              size={"sm"}
              className="px-7 py-0 space-x-2 justify-between flex items-center "
            >
              <RxExit size={17} />
              <span>Student Mode</span>
            </Button>
          ) : (
            <Button variant={"secondary"} disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          )
        ) : !routeLoading ? (
          <Button
            onClick={() => {
              setrouteLoading(true);
              router.push("/teacher/all");
              setrouteLoading(false);
            }}
            variant={"secondary"}
            size={"sm"}
            className="px-7 py-0"
          >
            Teacher Mode
          </Button>
        ) : (
          <Button variant={"secondary"} disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        )}

        <PropfileSettings
          image={user?.image as string}
          name={user?.name as string}
          email={user?.email as string}
        />
      </div>
    </div>
  );
};

export default Navbar;
