'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './init';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
    
  const [services, setServices] = useState<{
    firebaseApp: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  }>({
    firebaseApp: null,
    auth: null,
    firestore: null,
  });

  // useEffect ensures this code runs only on the client, after hydration.
  useEffect(() => {
    // The initializeFirebase function is now called here.
    const firebaseServices = initializeFirebase();
    if (firebaseServices) {
      setServices(firebaseServices);
    }
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
