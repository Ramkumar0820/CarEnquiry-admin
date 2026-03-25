import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('chendanvasu');

export async function middleware(request) {
  const authToken = request.cookies.get('auth_token')?.value;
  console.log("Auth Token:", authToken);

  const url = request.nextUrl.clone();

  if (authToken) {
    try {
      const { payload } = await jwtVerify(authToken, SECRET_KEY);
      console.log("Decoded Token:", payload);

      // If the user is trying to access the login page while authenticated, redirect to home
      if (url.pathname === '/login') {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();

    } catch (err) {
      console.error("Token verification failed:", err);

      // If token is invalid, redirect to login page
      // url.pathname = '/login';
      // return NextResponse.redirect(url);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set("auth_token", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
  } else {
    console.log("No auth token found");

    // If no token, redirect to login page
    if (url.pathname !== '/login') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Allow access to the login page if no auth token is present
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '//:path*'],
};
