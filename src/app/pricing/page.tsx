import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        title: "Usuario Individual",
        price: "$49",
        frequency: "/mes",
        description: "Ideal para profesionales independientes y pequeñas gestiones.",
        features: [
            "Verificación de hasta 50 documentos/mes",
            "Soporte por Chatbot IA",
            "Acceso a la plataforma Blockchain",
            "Dashboard personal",
        ],
        cta: "Empezar ahora",
        ctaLink: "/payment?plan=individual",
    },
    {
        title: "Notarías y Despachos",
        price: "$199",
        frequency: "/mes",
        description: "Perfecto para notarías, despachos de abogados y agentes inmobiliarios.",
        features: [
            "Verificación de hasta 300 documentos/mes",
            "Gestión de hasta 5 usuarios",
            "Flujos de trabajo automatizados",
            "Soporte prioritario",
        ],
        cta: "Elegir Plan Notaría",
        ctaLink: "/payment?plan=notary",
        recommended: true,
    },
    {
        title: "Institucional",
        price: "Contacto",
        frequency: "",
        description: "Solución a medida para instituciones gubernamentales y grandes corporaciones.",
        features: [
            "Volumen de documentos ilimitado",
            "Usuarios ilimitados y roles personalizados",
            "Integración API completa",
            "Soporte dedicado y SLA",
        ],
        cta: "Contactar a Ventas",
        ctaLink: "#contact",
    },
];

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


export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
       <div className="flex flex-col items-center justify-center mb-10">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
               <span className="text-2xl font-bold font-jakarta text-foreground">GeoVeraxis</span>
            </Link>
        </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta">Planes para cada necesidad</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Desde profesionales individuales hasta grandes instituciones, tenemos un plan que se adapta a ti.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.title} className={`flex flex-col ${plan.recommended ? 'border-primary border-2 shadow-primary/20 shadow-lg' : ''}`}>
            <CardHeader className="items-start">
              <CardTitle className="text-2xl font-jakarta">{plan.title}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.frequency && <span className="text-muted-foreground">{plan.frequency}</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.recommended ? 'default' : 'outline'}>
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
