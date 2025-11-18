
import { initializeApp, getApps, App } from 'firebase-admin/app';
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
 * This ensures that initialization happens only once. In a Google Cloud environment
 * like App Hosting, the SDK automatically finds the necessary credentials.
 * 
 * @returns {AdminServices} The initialized Firebase Admin services.
 * @throws {Error} If initialization fails.
 */
function initializeAdmin(): AdminServices {
  if (adminServices) {
    return adminServices;
  }

  // getApps() checks if an app is already initialized.
  if (getApps().length > 0) {
    const defaultApp = getApps()[0];
    adminServices = {
      app: defaultApp,
      auth: getAuth(defaultApp),
      firestore: getFirestore(defaultApp),
    };
    return adminServices;
  }

  // In a managed Google Cloud environment, initializeApp() requires no arguments.
  // It automatically detects the project's service account credentials.
  try {
    const app = initializeApp();
    
    adminServices = {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
    
    return adminServices;

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    throw new Error('Could not initialize Firebase Admin SDK.');
  }
}

// Export individual services through getters.
// This ensures that any call to these services will trigger initialization if it hasn't happened yet.
export const adminAuth = initializeAdmin().auth;
export const adminFirestore = initializeAdmin().firestore;
