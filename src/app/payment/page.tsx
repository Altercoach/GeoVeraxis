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
import { CreditCard, Lock } from "lucide-react";
import Link from "next/link";

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

export default function PaymentPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
               <span className="text-2xl font-bold font-jakarta text-foreground">GeoVeraxis</span>
            </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-jakarta">Realizar Pago</CardTitle>
            <CardDescription>
              Completa tu suscripción de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre en la tarjeta</Label>
                <Input id="name" placeholder="Juan Pérez" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-number">Número de tarjeta</Label>
              <div className="relative">
                <Input id="card-number" placeholder="**** **** **** 1234" />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiración</Label>
                <Input id="expiry" placeholder="MM/AA" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">
                <Lock className="mr-2 h-4 w-4" /> Pagar de forma segura
            </Button>
            <p className="text-xs text-muted-foreground text-center">
                Transacción segura y encriptada. Al continuar, aceptas nuestros Términos de Servicio.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
