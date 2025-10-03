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
  const { auth, firestore, user, isUserLoading } = useFirebase();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        await setDoc(doc(firestore, "users", user.uid), {
            id: user.uid,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            role: "Client"
        }, { merge: true });
    } catch (error) {
        console.error("Error signing up with email:", error);
        throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = { user, loading: isUserLoading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut };

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
