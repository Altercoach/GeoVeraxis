'use client';

import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from './use-toast';
import { useState } from 'react';

// This hook no longer uses a context provider.
// It directly uses the central `useFirebase` hook.
export const useAuthHook = () => {
  const { auth, firestore, user, loading } = useFirebase();
  const { toast } = useToast();
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);


  const signInWithGoogle = async () => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Los servicios de Firebase no están disponibles.",
      });
      return;
    }
    setIsGoogleSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
        const lastName = lastNameParts.join(' ');
        
        await setDoc(userRef, {
          id: user.uid,
          firstName: firstName || 'User',
          lastName: lastName || '',
          email: user.email,
          role: "Client"
        }, { merge: true });
      }
      // Redirection is handled by the page's useEffect
    } catch (error: any) {
       if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error("Google Sign-In Error:", error);
         toast({
          variant: "destructive",
          title: "Error de inicio de sesión con Google",
          description: "No se pudo iniciar sesión. Por favor, inténtalo de nuevo.",
        });
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!firestore || !auth) {
       toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Los servicios de Firebase no están disponibles.",
      });
      return;
    }
    setIsEmailSubmitting(true);
    try {
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
        // Redirection is handled by the page's useEffect
    } catch (error: any) {
        let description = "No se pudo crear la cuenta. Inténtalo de nuevo.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Este correo electrónico ya está en uso. Por favor, inicia sesión o utiliza otro correo.";
        }
         toast({
            variant: "destructive",
            title: "Error de registro",
            description: description,
        });
    } finally {
        setIsEmailSubmitting(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error de configuración",
            description: "El servicio de autenticación no está disponible.",
        });
        return;
    }
    setIsEmailSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
       // Redirection is handled by the page's useEffect
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
        });
    } finally {
        setIsEmailSubmitting(false);
    }
  };

  const signOut = async () => {
    if (!auth) {
       toast({
            variant: "destructive",
            title: "Error de configuración",
            description: "El servicio de autenticación no está disponible.",
        });
      return;
    }
    await firebaseSignOut(auth);
  };

  return { 
    user, 
    loading, 
    isEmailSubmitting,
    isGoogleSubmitting,
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    signOut 
  };
};