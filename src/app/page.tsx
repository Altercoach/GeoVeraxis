import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, ShieldCheck, Zap, Bot, Database, GitBranch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Verificación Potenciada por IA",
    description: "Analice documentos, valide datos y detecte fraudes con nuestra IA de vanguardia.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
    title: "Seguridad con Blockchain",
    description: "Garantice la inmutabilidad de cada transacción con tecnología blockchain.",
  },
  {
    icon: <GitBranch className="w-8 h-8 text-accent" />,
    title: "Flujos de Trabajo Automatizados",
    description: "Automatice procesos complejos para una eficiencia sin precedentes.",
  },
];

const testimonials = [
  {
    name: "Carlos Rodriguez",
    role: "Agente Inmobiliario, RE/MAX",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "GeoVeraxis ha transformado nuestra forma de trabajar. La verificación de documentos con IA nos ahorra días de trabajo.",
  },
  {
    name: "Ana Fernández",
    role: "Oficial de Crédito, BBVA",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "La seguridad que aporta la blockchain es inigualable. Ahora tenemos total confianza en la integridad de nuestros datos.",
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

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold font-jakarta">GeoVeraxis</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Características
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Precios
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Testimonios
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/login">Acceder</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center">
           <video 
                src="https://cdn.pixabay.com/video/2024/05/27/211592_large.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10 brightness-[.3]"
            />
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white drop-shadow-md font-jakarta">
              La Intersección de Precisión Geoespacial y Certeza Legal
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300 drop-shadow-sm">
              Nuestra plataforma con IA y Blockchain redefine la gestión catastral, la validación de documentos y las transacciones inmobiliarias, creando un ecosistema de confianza y eficiencia.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Empieza Ahora</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Solicitar una Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-28 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-jakarta">Una Plataforma, Infinitas Soluciones</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Integramos las tecnologías más avanzadas para ofrecer una solución completa para el sector inmobiliario y legal.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                    <div className="mx-auto bg-muted p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-bold font-jakarta">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-28 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-jakarta">Con la Confianza de Líderes de la Industria</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Vea lo que nuestros clientes dicen sobre GeoVeraxis.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="pt-6">
                    <blockquote className="text-lg italic text-foreground">"{testimonial.text}"</blockquote>
                  </CardContent>
                  <div className="p-6 flex items-center gap-4 border-t border-border mt-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-card border-t border-border">
        <div className="container mx-auto py-8 px-4 md:px-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} GeoVeraxis. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center gap-4">
             <Link href="#" className="hover:text-primary">Política de Privacidad</Link>
             <Link href="#" className="hover:text-primary">Términos de Servicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
