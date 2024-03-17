"use client";
import React, { useCallback, useEffect, useState } from "react";
import AuthForm from "../../_components/auth-form";
import Spinner from "../../_components/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import AuthMessage from "../../_components/auth-message";
import { verifyEmail } from "@/actions/auth/new-verification";

const TokenVerification = () => {
  const [errorMessage, seterrorMessage] = useState<string>("");
  const [successMessage, setsuccessMessage] = useState<string>("");
  const [userVerified, setuserVerified] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // const isForgetPassword = searchParams.has("forget") // if not then it is a new

  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (!token) seterrorMessage("Token doesn't exist");
    if (userVerified) return;
    seterrorMessage("");
    setsuccessMessage("");

    verifyEmail(token as string).then((resp) => {
      seterrorMessage(resp?.error as string);
      setsuccessMessage(resp?.success as string);
      if (resp?.success) setuserVerified(true);
    });
    router.push("/login");
  }, [token, userVerified]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);
  return (
    <div className="w-full justify-center items-center flex">
      <AuthForm
        callbackurl={"/login"}
        title="Verifying Your Account"
        backButtonHref="/login"
        backButtonLabel="Back to login"
        showSocial={false}
        login={false}
      >
        {!errorMessage && !successMessage && (
          <div className="text-sm w-full items-center justify-center flex text-center ">
            <Spinner className="w-9 h-9 animate-spin" />
          </div>
        )}

        {errorMessage && <AuthMessage message={errorMessage} type="error" />}
      </AuthForm>
    </div>
  );
};

export default TokenVerification;
