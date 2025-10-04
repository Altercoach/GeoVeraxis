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
    console.log('[AuthProvider] useEffect for getRedirectResult started.');
    if (!auth || !firestore) {
        console.log('[AuthProvider] Auth or Firestore not ready, skipping getRedirectResult.');
        return;
    };

    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          console.log('[AuthProvider] getRedirectResult SUCCESS. User:', result.user.uid);
          const user = result.user;
          const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
          const lastName = lastNameParts.join(' ');
          
          console.log(`[AuthProvider] Creating/merging user document for ${user.uid}`);
          await setDoc(doc(firestore, "users", user.uid), {
              id: user.uid,
              firstName: firstName || 'User',
              lastName: lastName || '',
              email: user.email,
              role: "Client"
          }, { merge: true });
          console.log(`[AuthProvider] User document for ${user.uid} processed.`);
        } else {
            console.log('[AuthProvider] getRedirectResult: No user in result.');
        }
      })
      .catch((error) => {
         if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
            console.error("[AuthProvider] Error processing redirect result:", error);
         } else {
            console.log("[AuthProvider] Redirect popup closed by user.");
         }
      });
  }, [auth, firestore]);

  const signInWithGoogle = async () => {
    console.log('[useAuth] signInWithGoogle initiated.');
    if (!auth) throw new Error("Auth service not initialized");
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    console.log(`[useAuth] signUpWithEmail for ${email} initiated.`);
    if (!firestore || !auth) {
        throw new Error("Firebase not initialized");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`[useAuth] User created with UID: ${user.uid}. Updating profile.`);
    await updateProfile(user, { displayName });
    
    const [firstName, ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ');

    console.log(`[useAuth] Creating user document for ${user.uid}`);
    await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: user.email,
        role: "Client"
    }, { merge: true });
    console.log(`[useAuth] signUpWithEmail for ${email} completed.`);
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log(`[useAuth] signInWithEmail for ${email} initiated.`);
    if (!auth) throw new Error("Auth service not initialized");
    await signInWithEmailAndPassword(auth, email, password);
    console.log(`[useAuth] signInWithEmail for ${email} successful.`);
  };

  const signOut = async () => {
    console.log(`[useAuth] signOut initiated.`);
    if (!auth) throw new Error("Auth service not initialized");
    await firebaseSignOut(auth);
    console.log(`[useAuth] signOut successful.`);
  };

  const value = { 
    user, 
    loading, 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    signOut 
  };
  
  console.log('[AuthProvider] Rendering with value:', { user: user?.uid, loading });

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
