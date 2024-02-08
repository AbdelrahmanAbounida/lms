"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECTED } from "@/routes";
import { signIn } from "next-auth/react";

const Social = ({ callbackurl }: { callbackurl: string | null }) => {
  const registerSocial = async (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackurl || DEFAULT_LOGIN_REDIRECTED,
    });
  };
  return (
    <div className="w-full h-full flex gap-3">
      <Button
        onClick={() => registerSocial("google")}
        variant="outline"
        className="w-full"
      >
        <FcGoogle size={23} />
      </Button>

      <Button
        onClick={() => registerSocial("github")}
        variant={"outline"}
        className="w-full"
      >
        <FaGithub size={23} />
      </Button>
    </div>
  );
};

export default Social;
