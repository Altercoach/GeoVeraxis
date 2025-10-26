'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseServices: FirebaseServices | null = null;

/**
 * Initializes Firebase services if they haven't been initialized yet.
 * This function is designed to be called safely from a client-side component.
 * It checks if the necessary configuration is available before attempting to initialize.
 * @returns An object containing the initialized Firebase services, or null if initialization fails.
 */
export function initializeFirebase(): FirebaseServices | null {
  if (firebaseServices) {
    return firebaseServices;
  }

  // Check if we have a full config
  const isConfigAvailable =
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;
  
  if (!getApps().length && isConfigAvailable) {
    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        firebaseServices = { firebaseApp: app, auth, firestore };
        return firebaseServices;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return null;
    }
  } else if (getApps().length > 0 && isConfigAvailable) {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    firebaseServices = { firebaseApp: app, auth, firestore };
    return firebaseServices;
  }
  
  // This will be logged if config is not available.
  console.error(
    'Firebase initialization failed. Ensure your environment variables are set up correctly.'
  );

  return null;
}
