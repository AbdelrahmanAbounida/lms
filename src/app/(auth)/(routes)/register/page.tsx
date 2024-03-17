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
import { registerSchema } from "@/schemas/auth-schemas";
import { registerUser } from "@/actions/auth/register";
import Spinner from "../../_components/spinner";
import AuthMessage from "../../_components/auth-message";
import { useSearchParams } from "next/navigation";

const RegisterPage = () => {
  const [pending, startTransition] = useTransition();
  const [showPassword, setshowPassword] = useState(false);
  const [errorMessage, seterrorMessage] = useState<String | undefined>("");
  const [successMessage, setsuccessMessage] = useState<String | undefined>("");

  const searchParams = useSearchParams();
  const callbackurl = searchParams.get("callbackurl");

  type registerType = z.infer<typeof registerSchema>;
  const form = useForm<registerType>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = (data: registerType) => {
    seterrorMessage("");
    setsuccessMessage("");
    startTransition(() => {
      registerUser({ ...data }).then((res) => {
        setsuccessMessage(res?.success);
        seterrorMessage(res?.error);
      });
    });
  };

  return (
    <div className="flex text-white text-lg">
      <AuthForm
        title="Create an account"
        backButtonHref="/login"
        backButtonLabel="already have an account"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="gap-0 space-y-1">
                    <FormLabel className="font-normal text-small pl-1">
                      Confirm Password
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
            {errorMessage && (
              <AuthMessage message={errorMessage as string} type="error" />
            )}

            <Button disabled={pending} className="w-full mt-10" type="submit">
              {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default RegisterPage;
