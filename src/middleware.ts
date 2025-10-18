import { type NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';


export async function middleware(request: NextRequest) {
  // 1. Get the session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  // If no cookie, redirect to login
  if (!sessionCookie) {
    // For API routes, return 401
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // For UI routes, redirect to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 2. Verify the session cookie
    // The `true` checks for revocation
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);

    // 3. Allow the request to proceed
    // You can add the user's ID to the request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', decodedToken.uid);
    requestHeaders.set('X-User-Email', decodedToken.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('Middleware Auth Error:', error);

    // If verification fails, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    
    // For API routes, just return 401 after clearing the cookie
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const apiResponse = new NextResponse('Unauthorized', { status: 401 });
      apiResponse.cookies.delete('session');
      return apiResponse;
    }

    return response;
  }
}

// 4. Middleware Matcher
// This configures the middleware to run ONLY on specified paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root page, if you want it to be public)
     * - /login (the login page itself)
     * - /register (the register page)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|register|api/auth/session).*)',
  ],
};