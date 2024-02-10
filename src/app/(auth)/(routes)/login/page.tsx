"use client";
import React, { useState, useTransition } from "react";
import AuthForm from "../../_components/auth-form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import AuthMessage from "../../_components/auth-message";
import { loginSchema } from "@/schemas/auth-schemas";
import { loginUser } from "@/actions/login";
import Spinner from "../../_components/spinner";
import { useSearchParams } from "next/navigation";

const loginPage = () => {
  type loginType = z.infer<typeof loginSchema>;

  // check error in the url

  const searchParams = useSearchParams();
  const urlError: string =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with anthor provider. Please use the other provider"
      : "";

  // callback url
  const callbackurl = searchParams.get("callbackurl");

  const [pending, startTransition] = useTransition();

  const [successMessage, setsuccessMessage] = useState<String>("");
  const [errorMessage, seterrorMessage] = useState<String>("");
  const [warningMessage, setwarningMessage] = useState<String>("");

  const [showPassword, setshowPassword] = useState(false);

  const form = useForm<loginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: loginType) => {
    seterrorMessage("");
    setsuccessMessage("");
    startTransition(() => {
      loginUser({ ...data, callbackurl }).then((res) => {
        seterrorMessage(res.error as string);
        setsuccessMessage(res.success as string);
        setwarningMessage(res.warning as string);
      });
    });
  };
  return (
    <div className="flex text-white text-lg">
      (
      <AuthForm
        title="Sign in to your account"
        backButtonHref="/register"
        backButtonLabel="don't have an account"
        showSocial
        login
        callbackurl={callbackurl}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="gap-0 space-y-1">
                    <FormLabel className="font-normal text-small pl-1">
                      Email
                    </FormLabel>
                    <FormControl className="">
                      <Input
                        disabled={pending}
                        id="email"
                        type="email"
                        className="hover:border-1  hover:border-gray-400"
                        placeholder="ex@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="gap-0 space-y-1">
                    <FormLabel className="font-normal text-small pl-1">
                      Password
                    </FormLabel>
                    <div className="flex relative">
                      <FormControl>
                        <Input
                          disabled={pending}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="hover:border-1  hover:border-gray-400"
                          placeholder="***********"
                          {...field}
                        />
                      </FormControl>
                      <div
                        onClick={() => setshowPassword((prev) => !prev)}
                        className="flex justify-center items-center h-full absolute right-2 cursor-pointer"
                      >
                        {showPassword ? (
                          <FaRegEye className="  " />
                        ) : (
                          <FaRegEyeSlash className="  " />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {successMessage && (
              <AuthMessage message={successMessage as string} type="success" />
            )}
            {warningMessage && (
              <AuthMessage message={warningMessage as string} type="warning" />
            )}

            {errorMessage && (
              <AuthMessage message={errorMessage as string} type="error" />
            )}

            {urlError && <AuthMessage message={urlError} type="error" />}

            <Button disabled={pending} className="w-full mt-10" type="submit">
              {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </AuthForm>
      )
    </div>
  );
};

export default loginPage;
