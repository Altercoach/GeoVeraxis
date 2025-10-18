import { NextResponse, type NextRequest } from 'next/server';
import admin from '@/lib/firebase/admin-config';

export async function POST(request: NextRequest) {
  console.log('API /api/auth/session POST: Received request.');
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      console.error('API /api/auth/session POST: Error - ID token is required.');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }
    console.log('API /api/auth/session POST: ID token received.');

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Verify the ID token and create a session cookie.
    console.log('API /api/auth/session POST: Verifying ID token...');
    await admin.auth().verifyIdToken(idToken);
    console.log('API /api/auth/session POST: ID token verified. Creating session cookie...');
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    console.log('API /api/auth/session POST: Session cookie created.');

    // Set cookie policy for session cookie.
    const options = {
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    console.log('API /api/auth/session POST: Session cookie set in response. Request successful.');

    return response;

  } catch (error) {
    console.error('API /api/auth/session POST: Unhandled error during session login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  console.log('API /api/auth/session DELETE: Received request.');
  try {
    const options = {
      name: '__session',
      value: '',
      maxAge: -1, // Expire the cookie immediately
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    console.log('API /api/auth/session DELETE: Session cookie cleared. Request successful.');

    return response;
  } catch (error) {
    console.error('API /api/auth/session DELETE: Unhandled error during session logout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}