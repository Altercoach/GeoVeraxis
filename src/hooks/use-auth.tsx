'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, auth, firestore } = useFirebase();

  useEffect(() => {
    // Only run if auth and firestore are available and not in the initial loading state.
    if (!auth || !firestore || loading) {
      return;
    };

    // This effect handles the user creation in Firestore after a Google sign-in redirect.
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
          const lastName = lastNameParts.join(' ');
          
          await setDoc(doc(firestore, "users", user.uid), {
              id: user.uid,
              firstName: firstName || 'User',
              lastName: lastName || '',
              email: user.email,
              role: "Client"
          }, { merge: true });
        }
      })
      .catch((error) => {
         // Avoid logging errors for benign actions like closing the popup.
         if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
            console.error("[AuthProvider] Error processing redirect result:", error);
         }
      });
  }, [auth, firestore, loading]); // Dependencies ensure this runs when services are ready.

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Auth service not initialized");
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!firestore || !auth) {
        throw new Error("Firebase not initialized");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    
    const [firstName, ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ');

    // Create user document in Firestore.
    await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: user.email,
        role: "Client"
    }, { merge: true });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth service not initialized");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) throw new Error("Auth service not initialized");
    await firebaseSignOut(auth);
  };

  const value = { 
    user, 
    loading, 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    signOut 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthHook = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthHook must be used within an AuthProvider');
  }
  return context;
};
