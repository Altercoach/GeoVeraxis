
"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from "@/hooks/use-admin";
import { FirebaseClientProvider } from "@/firebase";
import { useFirebase } from "@/firebase/provider";
import { Loader2 } from "lucide-react";

function AppContent({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useFirebase();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}


export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AdminProvider>
              <AppContent>{children}</AppContent>
            </AdminProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
    )
}
