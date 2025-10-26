'use client';

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
import { useFirebase } from '@/firebase/provider';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from './use-toast';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useAuthHook = () => {
  const { auth, firestore, user, loading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);

  const setSessionCookie = async (user: User) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) throw new Error('Failed to set session cookie');
    } catch (error) {
      console.error('Session cookie error:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Sesión',
        description: 'No se pudo iniciar la sesión del servidor. Por favor, inténtalo de nuevo.',
      });
      if (auth) await firebaseSignOut(auth);
      throw error;
    }
  };

  const clearSessionCookie = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to clear session cookie:', error);
    }
  };

  const processRedirect = useCallback(async () => {
    if (!auth || !firestore) {
        setIsProcessingRedirect(false);
        return;
    }

    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const user = result.user;
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const nameParts = user.displayName?.split(' ') || [];
          const firstName = nameParts[0] || 'User';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          await setDoc(userRef, {
            id: user.uid,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            role: "Client"
          }, { merge: true });
        }
        await setSessionCookie(user);
        toast({ title: "¡Bienvenido de nuevo!", description: "Has iniciado sesión correctamente." });
        
        // The main useEffect will handle the redirect now that the user state is updated.
      }
    } catch (error: any) {
      console.error("Google Sign-In Redirect Error:", error);
      toast({
          variant: "destructive",
          title: "Error de inicio de sesión con Google",
          description: error.message || "No se pudo completar el inicio de sesión. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsProcessingRedirect(false);
    }
  }, [auth, firestore, toast]);

  useEffect(() => {
    if(auth && firestore) {
      processRedirect();
    } else if (!loading) {
      // If auth/firestore are null and we are not loading, it means firebase failed to initialize
      setIsProcessingRedirect(false);
    }
  }, [auth, firestore, processRedirect, loading]);

  const signInWithGoogle = async () => {
    if (!auth) {
      toast({ variant: "destructive", title: "Error de configuración", description: "El servicio de autenticación no está disponible." });
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!firestore || !auth) {
       toast({ variant: "destructive", title: "Error de configuración", description: "Los servicios de Firebase no están disponibles." });
      return;
    }
    
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

        await setSessionCookie(createdUser);
        // The main useEffect will redirect.
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
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
        toast({ variant: "destructive", title: "Error de configuración", description: "El servicio de autenticación no está disponible." });
        return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await setSessionCookie(userCredential.user);
       // The main useEffect will redirect.
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
        });
    }
  };

  const signOut = async () => {
    if (!auth) {
       toast({ variant: "destructive", title: "Error de configuración", description: "El servicio de autenticación no está disponible." });
      return;
    }
    await clearSessionCookie();
    await firebaseSignOut(auth);
    router.push('/login');
  };

  return { 
    user, 
    loading: loading || isProcessingRedirect,
    isProcessingRedirect,
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    signOut 
  };
};
