'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export function initializeFirebase() {
  const isConfigAvailable =
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

  if (!getApps().length) {
    if (isConfigAvailable) {
      const app = initializeApp(firebaseConfig);
      // In a real development environment, you might want to connect to emulators.
      // NOTE: This is commented out as it might not be applicable to all setups.
      // if (process.env.NODE_ENV === 'development') {
      //   const auth = getAuth(app);
      //   connectAuthEmulator(auth, "http://localhost:9099");
      //   const firestore = getFirestore(app);
      //   connectFirestoreEmulator(firestore, 'localhost', 8080);
      // }
      return getSdks(app);
    } else {
      // This is a fallback for environments where config might not be directly available,
      // such as some server-side rendering scenarios or specific hosting environments.
      // It relies on Firebase's automatic initialization if available.
      try {
        const app = initializeApp();
        return getSdks(app);
      } catch (e) {
        console.error("Firebase initialization failed. Ensure your environment variables are set up correctly.", e);
        // Return a dummy object to prevent the app from crashing.
        return { firebaseApp: null, auth: null, firestore: null };
      }
    }
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp | null) {
  if (!firebaseApp) {
    return { firebaseApp: null, auth: null, firestore: null };
  }
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
