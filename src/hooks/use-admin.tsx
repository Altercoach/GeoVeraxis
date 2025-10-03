"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Shield, User, Briefcase, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Role = {
    id: string;
    name: string;
    icon: LucideIcon;
};

const roles: Role[] = [
    { id: 'Superadmin', name: 'Superadmin', icon: Shield },
    { id: 'Client', name: 'Client', icon: User },
    { id: 'Notary', name: 'Notary', icon: Briefcase },
    { id: 'PublicRegistrar', name: 'Public Registrar', icon: UserCheck },
];

type AdminContextType = {
  viewAs: string;
  setViewAs: (role: string) => void;
  roles: Role[];
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  // NOTE: This will be replaced with the actual user role from Firestore.
  const [viewAs, setViewAs] = useState('Superadmin'); 

  const contextValue = useMemo(() => ({
    viewAs,
    setViewAs,
    roles,
  }), [viewAs]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
