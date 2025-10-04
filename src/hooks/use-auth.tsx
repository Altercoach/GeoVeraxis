'use client';

import { createContext, useContext, ReactNode } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithRedirect,
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
  const { user, isUserLoading, auth, firestore } = useFirebase();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // It's important to set persistence if you want the user to stay logged in.
    // However, the default is 'local', so we don't need to explicitly set it
    // unless we want 'session' or 'none'.
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

    // Create a user document in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: user.email,
        role: "Client" // Default role
    }, { merge: true });
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = { 
    user, 
    loading: isUserLoading, 
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
