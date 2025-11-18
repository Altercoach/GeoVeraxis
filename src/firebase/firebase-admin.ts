
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface AdminServices {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

let adminServices: AdminServices | null = null;

/**
 * Initializes the Firebase Admin SDK using a robust singleton pattern.
 * This ensures that initialization happens only once and is lazy-loaded
 * when the services are first requested.
 * 
 * @returns {AdminServices} The initialized Firebase Admin services.
 * @throws {Error} If the service account credentials are not set or are invalid.
 */
function initializeAdmin(): AdminServices {
  if (adminServices) {
    return adminServices;
  }

  // Check if an app is already initialized
  if (getApps().length > 0) {
    const defaultApp = getApps()[0];
    adminServices = {
      app: defaultApp,
      auth: getAuth(defaultApp),
      firestore: getFirestore(defaultApp),
    };
    return adminServices;
  }

  // If no app is initialized, proceed with new initialization.
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountString) {
    throw new Error(
      'The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Firebase Admin SDK initialization failed.'
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    
    adminServices = {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
    
    return adminServices;

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    throw new Error(
      'Could not initialize Firebase Admin SDK. The service account credentials might be missing or malformed.'
    );
  }
}

// Export individual services through getters.
// This ensures that any call to these services will trigger initialization if it hasn't happened yet.
export const adminAuth = initializeAdmin().auth;
export const adminFirestore = initializeAdmin().firestore;

