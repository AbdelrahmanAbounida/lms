"use client";
import React, { useState, useTransition } from "react";
import AuthForm from "../../_components/auth-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/auth-schemas";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { resetPassword } from "@/actions/reset-password";
import AuthMessage from "../../_components/auth-message";
import { Button } from "@/components/ui/button";
import Spinner from "../../_components/spinner";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  type resetPasswordType = z.infer<typeof resetPasswordSchema>;
  const form = useForm<resetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const params = useSearchParams();
  const token = params.get("token");
  const callbackurl = params.get("callbackurl");

  const [pending, startTransition] = useTransition();
  const [showPassword, setshowPassword] = useState(false);
  const [errorMessage, seterrorMessage] = useState<string>("");
  const [successMessage, setsuccessMessage] = useState<string>("");

  const router = useRouter();

  const onSubmit = async (data: resetPasswordType) => {
    seterrorMessage("");
    setsuccessMessage("");

    startTransition(() => {
      resetPassword({ ...data, token }).then((resp) => {
        seterrorMessage(resp.error as string);
        setsuccessMessage(resp.success as string);

        if (resp.success) {
          router.push("/login");
        }
      });
    });
  };

  return (
    <div className="w-full items-center flex justify-center">
      <AuthForm
        title="Reset Your Password?"
        backButtonHref="/login"
        backButtonLabel="Back to login"
        login={false}
        showSocial={false}
        callbackurl={callbackurl}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="gap-0 space-y-1">
                  <FormLabel className="font-normal text-small pl-1">
                    New Password
                  </FormLabel>

                  <div className="flex relative">
                    <FormControl className="">
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
              name="confirmNewPassword"
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

            {successMessage && (
              <AuthMessage message={successMessage as string} type="success" />
            )}

            {errorMessage && (
              <AuthMessage message={errorMessage as string} type="error" />
            )}

            <Button disabled={pending} className="w-full mt-10" type="submit">
              {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default ResetPassword;
