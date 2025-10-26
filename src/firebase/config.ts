<<<<<<< HEAD

=======
>>>>>>> e0c7b32bacf06714db868d6bad48141109326d98
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
<<<<<<< HEAD
  // Conditionally add measurementId only if it exists
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }),
};

export { firebaseConfig };

=======
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export { firebaseConfig };
>>>>>>> e0c7b32bacf06714db868d6bad48141109326d98
