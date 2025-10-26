'use client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'session'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/pricing', '/payment', '/'];
  const isPublicPath = publicPaths.some(path => pathname === path);
  const isApiAuthPath = pathname.startsWith('/api/auth');

  const authToken = request.cookies.get(AUTH_COOKIE_NAME);

  if (pathname.startsWith('/dashboard') && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authToken && isPublicPath && !isApiAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
