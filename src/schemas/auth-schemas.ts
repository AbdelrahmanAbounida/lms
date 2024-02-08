import * as z from "zod";

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .trim()
    .email({ message: "Email is not valid" }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(4, { message: "Password should be at least 4 characters" }),
    confirmNewPassword: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => data.newPassword == data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is requierd" })
    .trim()
    .email({ message: "Email is not valid" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .trim()
      .email({ message: "Email is not valid" }),
    password: z
      .string()
      .min(4, { message: "Password should be at least 4 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password shouldn't be none" }),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
