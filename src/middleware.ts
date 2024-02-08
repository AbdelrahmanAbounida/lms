import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECTED,
  PROTECTED_ROUTES,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // req.auth
  const { nextUrl } = req;

  const isLogedIn = !!req.auth;
  const isProtectedRoute = PROTECTED_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);

  // if it is api route
  if (isApiAuthRoute) {
    return null;
  }
  // check if it is auth routes
  // console.log({ isLogedIn, isProtectedRoute });
  if (isAuthRoute) {
    if (isLogedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECTED, nextUrl));
    }
    return null;
  }
  // if it is protected route
  if (isProtectedRoute && !isLogedIn) {
    let callbackurl = nextUrl.pathname;
    if (nextUrl.search) callbackurl += nextUrl.search;
    const encodedCallbackUrl = encodeURIComponent(callbackurl);
    return NextResponse.redirect(
      new URL(`/login?callbackurl=${encodedCallbackUrl}`, nextUrl)
    );
  }
  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
