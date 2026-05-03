import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const path = request.nextUrl.pathname;
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/profile") && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => Boolean(token) } },
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
