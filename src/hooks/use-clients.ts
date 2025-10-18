import { useState, useEffect } from 'react';
import { Client } from '@/lib/schemas';

const GET_CLIENTS_URL = process.env.NEXT_PUBLIC_GET_CLIENTS_URL;

if (!GET_CLIENTS_URL) {
  throw new Error("Missing NEXT_PUBLIC_GET_CLIENTS_URL environment variable");
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch(GET_CLIENTS_URL!);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // The function returns { data: clients[] }, so we access the data property
        setClients(result.data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []); // Empty dependency array means this effect runs once on mount

  return { clients, loading, error };
}