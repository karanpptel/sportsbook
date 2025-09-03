import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (pathname.startsWith("/owner") && role !== "OWNER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/player") && !(role === "PLAYER" || role === "USER")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only allow signed-in users
    },
  }
);

export const config = {
  matcher: ["/owner/:path*", "/player/:path*", "/admin/:path*"],
};


// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const url = new URL(req.url);

//   // No token → send to login
//   if (!token) {
//     if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/owner") || url.pathname.startsWith("/user")) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Role-based protection
//   if (url.pathname.startsWith("/admin") && token.role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }
//   if (url.pathname.startsWith("/owner") && token.role !== "OWNER") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }
//   if (url.pathname.startsWith("/user") && token.role !== "USER") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// // Run middleware on these routes
// export const config = {
//   matcher: ["/admin/:path*", "/owner/:path*", "/user/:path*"],
// };
