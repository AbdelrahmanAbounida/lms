import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="w-full  flex items-center justify-center space-x-2">
      <Image src={"/logo.png"} width={40} height={40} alt="logo" />

      <span className="text-2xl text-green-500 font-bold">LMS</span>
    </div>
  );
};

export default Logo;
