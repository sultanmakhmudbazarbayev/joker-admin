import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const LOGIN_PATHNAME = "/login";
const HOME_PATHNAME = "/";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req?.nextUrl?.pathname.includes(LOGIN_PATHNAME)) {
    if (token) {
      const url = new URL(HOME_PATHNAME, req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL(LOGIN_PATHNAME, req.url);
    const { pathname } = new URL(req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.svg|assets).*)",
};
