import { Resend } from "resend";
import VerifyEmailTemplate from "@/components/emails/verify-email-template";
import { ResetEmailTemplate } from "@/components/emails/reset-password-template";

export const sendResendEmail = async (
  emailTemplate: "verifyEmail" | "forgetPassword",
  ToAddress: string,
  token: string
  // Subject: string
) => {
  try {
    const template =
      emailTemplate == "verifyEmail" ? (
        <VerifyEmailTemplate
          userFirstname={ToAddress}
          resetLink={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/new-verification?token=${token}`}
        />
      ) : (
        <ResetEmailTemplate
          userFirstname={ToAddress}
          resetLink={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/reset-password?token=${token}`}
        />
      );

    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ToAddress,
      subject:
        emailTemplate == "verifyEmail" ? "Verify Email" : "Reset Password",
      react: template,
    });
  } catch (error) {
    console.log({ error });
  }
};
