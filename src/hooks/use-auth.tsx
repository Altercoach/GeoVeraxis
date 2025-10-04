'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
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
  loading: boolean; // Renamed from isUserLoading for clarity
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, user, loading } = useFirebase();

  useEffect(() => {
    // This effect handles user creation in Firestore after a Google sign-in redirect.
    if (!loading && auth && firestore) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result && result.user) {
            const firestoreUser = result.user;
            const [firstName, ...lastNameParts] = firestoreUser.displayName?.split(' ') || ['', ''];
            const lastName = lastNameParts.join(' ');
            
            await setDoc(doc(firestore, "users", firestoreUser.uid), {
                id: firestoreUser.uid,
                firstName: firstName || 'User',
                lastName: lastName || '',
                email: firestoreUser.email,
                role: "Client"
            }, { merge: true });
          }
        })
        .catch((error) => {
           if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
              console.error("[AuthProvider] Error processing redirect result:", error);
           }
        });
    }
  }, [auth, firestore, loading]);

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
    const createdUser = userCredential.user;
    await updateProfile(createdUser, { displayName });
    
    const [firstName, ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ');

    await setDoc(doc(firestore, "users", createdUser.uid), {
        id: createdUser.uid,
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: createdUser.email,
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
