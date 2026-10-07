import { NextResponse, type NextRequest } from "next/server";

/*
 * Server-side route protection (arch §9.3, barch §17). With the real API (http mode) the session
 * lives in the HTTP-only `nivora_session` cookie, so guests are redirected to Login before a
 * protected page renders. Only the cookie's presence is checked here (no API call); an expired
 * session still reaches the page, where `RequireAuth` redirects in the browser.
 * In mock mode the session is in localStorage, so the server can't tell — nothing to do.
 */
export function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE !== "http") return NextResponse.next();
  if (request.cookies.has("nivora_session")) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  const login = new URL("/login", request.url);
  // `from` is the protected path itself, so it is always internal (no open redirect).
  login.searchParams.set("from", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/account", "/account/:path*", "/checkout", "/wishlist", "/order-confirmation/:path*"],
};
