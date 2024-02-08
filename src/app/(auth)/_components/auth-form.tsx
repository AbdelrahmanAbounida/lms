import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import React, { Children } from "react";
import Social from "./social";

interface AuthFormProps {
  title: string;
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial: boolean;
  login: boolean;
  callbackurl: string | null;
}

const AuthForm = ({
  title,
  children,
  backButtonHref,
  backButtonLabel,
  showSocial,
  login,
  callbackurl,
}: AuthFormProps) => {
  return (
    <div className="space-y-5 w-[450px]">
      <Card>
        {/* logo */}
        <div className="w-full flex justify-center items-center text-center h-16">
          {/* <Logo /> */}
        </div>
        {/* Header */}
        <CardHeader className="text-center font-semibold">{title}</CardHeader>

        {/* Content */}
        <CardContent>{children}</CardContent>

        {showSocial && (
          <CardFooter>
            <Social callbackurl={callbackurl} />
          </CardFooter>
        )}

        {/* Backdrop - Footer */}
        <CardFooter className=" w-full text-center justify-center ">
          <Button className="underline " variant={"link"}>
            <Link
              className="hover:text-muted-foreground text-normal  text-sm"
              href={backButtonHref}
            >
              {backButtonLabel}
            </Link>
          </Button>
          {login && (
            <Button className="underline " variant={"link"}>
              <Link href="/forget" className="hover:text-muted-foreground">
                Forget Password?
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
