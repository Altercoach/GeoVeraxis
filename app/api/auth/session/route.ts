import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/firebase/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    return response;

  } catch (error) {
    console.error('API /api/auth/session POST: Unhandled error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set({
      name: 'session',
      value: '',
      maxAge: -1,
    });
    return response;

  } catch (error) {
    console.error('API /api/auth/session DELETE: Unhandled error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}