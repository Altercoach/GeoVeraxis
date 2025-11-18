'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { useFirebase, useFirebaseApp, useFirestore } from '@/firebase/provider';
import { useToast } from './use-toast';
import { doc, setDoc } from 'firebase/firestore';

async function setSessionCookie(idToken: string) {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to set session cookie: ${response.statusText}`, errorBody);
      throw new Error(`Failed to set session cookie: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error setting session cookie:', error);
  }
}

async function clearSessionCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (error) {
    console.error('Error clearing session cookie:', error);
  }
}

export const useAuthHook = () => {
  const { auth, user, loading } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);

  const setSession = useCallback(async (user: User | null) => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        await setSessionCookie(idToken);
      } catch (error) {
         console.error('Error getting ID token or setting session:', error);
      }
    } else {
      await clearSessionCookie();
    }
  }, []);

  useEffect(() => {
    // This effect handles setting/clearing the session cookie when auth state changes.
    // It runs for both client-side navigation and redirects.
    setSession(user);
  }, [user, setSession]);


  const signInWithGoogle = async () => {
    if (!auth) return;
    setIsProcessingRedirect(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user document in Firestore if it's a new user
      if (firestore) {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || 'New',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || 'User',
            role: 'Client',
            status: 'Active',
            plan: 'Basic'
        }, { merge: true });
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
      setIsProcessingRedirect(false);
    }
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth || !firestore) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      const userRef = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        id: userCredential.user.uid,
        email: email,
        firstName: displayName.split(' ')[0] || 'New',
        lastName: displayName.split(' ').slice(1).join(' ') || 'User',
        role: 'Client',
        status: 'Active',
        plan: 'Basic'
      });
      
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Sign-Up Failed',
        description: error.message,
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-In Failed',
        description: 'Invalid email or password. Please try again.',
      });
    }
  };


  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      // The useEffect will handle clearing the cookie
    }
  };

  return {
    user,
    loading,
    isProcessingRedirect,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
  };
};
