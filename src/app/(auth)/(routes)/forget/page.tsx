"use client";
import React, { useState, useTransition } from "react";
import AuthForm from "../../_components/auth-form";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema } from "@/schemas/auth-schemas";
import * as z from "zod";
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
import Spinner from "../../_components/spinner";
import { sendResetPasswordEmail } from "@/actions/auth/reset-password";
import AuthMessage from "../../_components/auth-message";

const Forget = () => {
  type resetpasswordType = z.infer<typeof forgetPasswordSchema>;
  const form = useForm<resetpasswordType>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const [pending, startTransition] = useTransition();
  const [successMessage, setsuccessMessage] = useState<string>("");
  const [errorMessage, seterrorMessage] = useState<string>("");

  const onSubmit = async (data: resetpasswordType) => {
    startTransition(() => {
      // reset messages
      seterrorMessage("");
      setsuccessMessage("");
      // send reset email
      sendResetPasswordEmail(data).then((resp) => {
        seterrorMessage(resp?.error as string);
        setsuccessMessage(resp?.success as string);
      });
    });
  };

  return (
    <div className="w-full items-center flex justify-center">
      <AuthForm
        callbackurl={""}
        title="Forget Your Password?"
        backButtonHref="/login"
        backButtonLabel="Back to login"
        login={false}
        showSocial={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      type="text"
                      className="hover:border-1  hover:border-gray-400"
                      placeholder="ex@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <AuthMessage message={errorMessage} type="error" />
            )}
            {successMessage && (
              <AuthMessage message={successMessage} type="success" />
            )}
            <Button disabled={pending} className="w-full mt-10" type="submit">
              {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send Email
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default Forget;
