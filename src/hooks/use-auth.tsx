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

export const useAuthHook = () => {
  const { auth, firestore, user, loading } = useFirebase();
  const { toast } = useToast();

  // This function is deprecated for the login page but kept for potential other uses.
  const signInWithGoogle = async () => {
    // The logic is now handled directly in login-page.tsx to solve popup issues.
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
        
        const idToken = await createdUser.getIdToken();
        try {
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (sessionError) {
            console.error("Session API Error (Sign Up):", sessionError);
            await firebaseSignOut(auth); // Clean up client session if server session fails
            throw sessionError; // Re-throw to be caught by the outer catch block
        }

        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        await setDoc(doc(firestore, "users", createdUser.uid), {
            id: createdUser.uid,
            firstName: firstName || 'User',
            lastName: lastName || '',
            email: createdUser.email,
            role: "Client"
        }, { merge: true });

    } catch (error: any) {
        let description = "No se pudo crear la cuenta. Inténtalo de nuevo.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Este correo electrónico ya está en uso. Por favor, inicia sesión o utiliza otro correo.";
        }
        console.error("Sign Up Error:", error);
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
      const idToken = await userCredential.user.getIdToken();
      
      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
      } catch (sessionError) {
        console.error("Session API Error (Sign In):", sessionError);
        await firebaseSignOut(auth); // Clean up client session if server session fails
        throw sessionError; // Re-throw to be caught by the outer catch block
      }

    } catch (error: any) {
        console.error("Sign In Error:", error);
        toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Credenciales inválidas o error al crear la sesión en el servidor.",
        });
    }
  };

  const signOut = async () => {
    if (!auth) {
       toast({ variant: "destructive", title: "Error de configuración", description: "El servicio de autenticación no está disponible." });
      return;
    }
    try {
        await firebaseSignOut(auth);
        const response = await fetch('/api/auth/session', {
          method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
    } catch (error) {
        console.error("Sign Out Error:", error);
        toast({
            variant: "destructive",
            title: "Error al cerrar sesión",
            description: "No se pudo cerrar la sesión correctamente en el servidor.",
        });
    }
  };

  return { 
    user, 
    loading, 
    signInWithGoogle, // Deprecated but kept for now
    signUpWithEmail, 
    signInWithEmail, 
    signOut 
  };
};
