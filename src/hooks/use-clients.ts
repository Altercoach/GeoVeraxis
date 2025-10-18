import { useState, useEffect } from 'react';
import { Client, clientSchema } from '@/lib/schemas';
import { useFirebase } from '@/firebase/provider';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      // Firestore might not be initialized yet
      return;
    }

    const clientsCollection = collection(firestore, 'users');

    const unsubscribe = onSnapshot(clientsCollection, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const clientsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            // Construct name and provide default values for missing fields
            const clientData = {
              id: doc.id,
              name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
              email: data.email || 'N/A',
              role: data.role || 'Client',
              status: data.status || 'Active', // Default to 'Active' if not present
              plan: data.plan || 'Basic',       // Default to 'Basic' if not present
            };

            // Validate data with Zod schema before setting state
            return clientSchema.parse(clientData);
          });
          setClients(clientsData);
        } catch (e) {
          console.error("Data validation or mapping error:", e);
          setError(e as Error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, [firestore]); // Rerun effect if firestore instance changes

  return { clients, loading, error };
}
