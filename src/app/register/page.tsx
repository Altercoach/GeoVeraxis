'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuthHook } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);
  
const Logo = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      className="text-primary"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 0L100 25V75L50 100L0 75V25L50 0Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M50 15L84 32.5V67.5L50 85L16 67.5V32.5L50 15Z"
        className="fill-background"
      />
      <path
        d="M50 25L75 37.5V62.5L50 75L25 62.5V37.5L50 25Z"
        fill="url(#logo-gradient)"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))"/>
            <stop offset="1" stopColor="hsl(var(--secondary))"/>
        </linearGradient>
      </defs>
    </svg>
);

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle, user, loading } = useAuthHook();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);


  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Contraseña insegura",
            description: "La contraseña debe tener al menos 6 caracteres.",
        });
        return;
    }
    setIsEmailSubmitting(true);
    try {
      await signUpWithEmail(email, password, `${firstName} ${lastName}`);
      // onAuthStateChanged will detect the user and the useEffect will redirect
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
      console.error(error);
      setIsEmailSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      // After this, the page will redirect to Google, and the auth provider
      // will handle the user creation and state change.
    } catch (error: any) {
       if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
        });
        console.error(error);
      }
      setIsGoogleSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  const isSubmitting = isEmailSubmitting || isGoogleSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
               <span className="text-2xl font-bold font-jakarta text-foreground">GeoVeraxis</span>
            </Link>
        </div>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-jakarta">Crea una Cuenta</CardTitle>
            <CardDescription>
              Únete a GeoVeraxis para empezar a transformar tus procesos.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailSignUp}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nombre</Label>
                  <Input id="first-name" placeholder="Max" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isSubmitting} autoComplete="given-name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Apellidos</Label>
                  <Input id="last-name" placeholder="Robinson" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isSubmitting} autoComplete="family-name"/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} autoComplete="email"/>
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isSubmitting} autoComplete="new-password"/>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isEmailSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Cuenta
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    O
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                {isGoogleSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Registrarse con Google
              </Button>
            </CardContent>
          </form>
          <CardFooter className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline ml-1 text-primary">
              Iniciar Sesión
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
