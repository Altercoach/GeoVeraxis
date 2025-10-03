import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This token is used to identify authenticated users.
// It is stored in the browser's cookies.
const AUTH_COOKIE_NAME = '__session'; // A more generic name is better

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of routes that do not require authentication.
  const publicPaths = ['/login', '/register', '/pricing', '/payment'];

  // Get the authentication token from cookies.
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isRootPath = pathname === '/';

  // If the user is authenticated and tries to access a public path like login/register/pricing/payment,
  // redirect them to the dashboard.
  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to the landing page without authentication
  if (isRootPath) {
    return NextResponse.next();
  }

  // Allow access to public routes if there is no token
  if (isPublicPath && !authToken) {
    return NextResponse.next();
  }

  // If the user tries to access a protected route (any route that is not public or root)
  // and there is no token, redirect them to the login page.
  if (!authToken && !isPublicPath && !isRootPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // Optional: to redirect the user back after login.
    return NextResponse.redirect(loginUrl);
  }

  // For all other routes, allow access.
  return NextResponse.next();
}

// Middleware configuration to specify which routes it should watch.
export const config = {
  matcher: [
    // Apply to all routes except those for static files,
    // images, or Next.js internal routes.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
