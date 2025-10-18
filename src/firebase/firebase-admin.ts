import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// This function ensures the admin app is initialized, but only once.
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Otherwise, initialize a new one.
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

// Get the initialized app
const adminApp = getAdminApp();

// Export the initialized services
export const adminAuth = getAuth(adminApp);
export const adminFirestore = getFirestore(adminApp);

// We no longer need to export initAdmin as it's handled internally.