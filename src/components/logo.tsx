import Image from "next/image";
import React from "react";

const logo = () => {
  return <Image src={"/logo.png"} width={140} height={140} alt="logo" />;
};

export default logo;
