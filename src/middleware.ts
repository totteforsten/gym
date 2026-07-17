import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "atlas_session";
const AUTH_ROUTES = ["/login", "/signup"];

// Lightweight cookie-presence gate for redirect UX. The signature is verified
// server-side in getSessionUserId() — a forged cookie is treated as logged out
// there, so this only decides where to send the browser.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(COOKIE)?.value);
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (!hasSession && !isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Protect everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
