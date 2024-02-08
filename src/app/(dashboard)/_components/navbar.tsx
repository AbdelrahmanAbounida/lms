import React from "react";
import { CgMenu } from "react-icons/cg";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SideBar from "./sidebar";
import PropfileSettings from "./profile-avatar";
const Navbar = () => {
  return (
    <div className="px-3 w-full text-md py-3 shadow-sm flex items-center justify-between border-b  mb-3">
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

      <div className="test md:justify-end md:ml-auto md:mr-3">
        <PropfileSettings image="" name="Abdel" email={"abdel@gmail.com"} />
      </div>
    </div>
  );
};

export default Navbar;
