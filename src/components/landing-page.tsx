'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function LandingPage() {
    const features = [
        {
            title: "Verificación de Documentos con IA",
            description: "Analiza y valida documentos catastrales y legales con nuestra IA de vanguardia, garantizando la autenticidad y precisión.",
            icon: "/icons/ai-icon.svg"
        },
        {
            title: "Transacciones Seguras con Blockchain",
            description: "Registra cada transacción en un libro mayor inmutable, proporcionando una capa de seguridad y transparencia sin precedentes.",
            icon: "/icons/blockchain-icon.svg"
        },
        {
            title: "Sistema de Mapeo Geoespacial",
            description: "Visualiza propiedades con datos geoespaciales precisos, integrando capas de información para una visión completa.",
            icon: "/icons/map-icon.svg"
        },
        {
            title: "Almacenamiento Descentralizado de Datos",
            description: "Protege la información vital en una red de almacenamiento descentralizada, asegurando la soberanía y resistencia de los datos.",
            icon: "/icons/storage-icon.svg"
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
       {
        name: "Luis Jiménez",
        role: "Notario Público",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "La plataforma ha simplificado la validación de títulos de propiedad, agilizando los cierres de manera significativa."
      },
      {
        name: "Sofía Gomez",
        role: "Inversionista Inmobiliaria",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Saber que cada paso está registrado en blockchain me da la tranquilidad que necesito para mis inversiones."
      }
     ];

    const faqs = [
      {
        question: "¿Cómo garantiza GeoVeraxis la seguridad de mis datos?",
        answer: "Utilizamos encriptación de extremo a extremo y almacenamiento descentralizado en blockchain. Esto significa que tus datos están protegidos contra manipulaciones y accesos no autorizados, garantizando la máxima seguridad e integridad."
      },
      {
        question: "¿Qué tipo de documentos puede analizar la IA de la plataforma?",
        answer: "Nuestra IA está entrenada para analizar una amplia gama de documentos inmobiliarios, incluyendo títulos de propiedad, planos catastrales, certificados de libertad de gravamen, contratos de compraventa y más. Continuamente expandimos sus capacidades."
      },
      {
        question: "¿Es complicada la integración de GeoVeraxis con mis sistemas actuales?",
        answer: "No. Hemos diseñado GeoVeraxis con la interoperabilidad en mente. Ofrecemos APIs robustas y un equipo de soporte dedicado para asegurar una integración fluida y sin complicaciones con tus flujos de trabajo existentes."
      },
      {
        question: "¿Qué es blockchain y por qué es importante para el sector inmobiliario?",
        answer: "Blockchain es un libro de contabilidad digital, inmutable y descentralizado. Para el sector inmobiliario, esto se traduce en transacciones transparentes, seguras y a prueba de fraudes, eliminando intermediarios y reduciendo costos."
      },
    ];

    return (
    <main>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center">
               <video 
                    src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
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
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Comienza tu prueba gratuita
                  </a>
                  <a href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-gray-400 bg-black bg-opacity-50 px-8 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                    Descubre más
                  </a>
                </div>
              </div>
            </section>


            {/* Features Section */}
            <section id="features" className="py-12 md:py-24 bg-gray-900">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Características Principales</h2>
                        <p className="mt-2 text-lg text-gray-400">Todo lo que necesitas para una gestión inmobiliaria segura y eficiente.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center transform transition duration-500 hover:scale-105">
                                <img src={feature.icon} alt={`${feature.title} icon`} className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                <p className="mt-2 text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 md:py-24 bg-gray-950">
              <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Lo que dicen nuestros clientes</h2>
                  <p className="mt-2 text-lg text-gray-400">Resultados reales de profesionales que confían en GeoVeraxis.</p>
                </div>
                <Carousel 
                    opts={{ align: "start", loop: true }}
                    className="w-full max-w-4xl mx-auto"
                >
                  <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem key={index} className="md:basis-1/2">
                        <div className="p-4">
                        <Card className="bg-gray-900 border-gray-700">
                            <CardContent className="flex flex-col items-center text-center p-6">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4" />
                                <p className="text-gray-300 italic">\"{testimonial.text}\"</p>
                                <p className="mt-4 font-bold text-white">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </CardContent>
                        </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 md:-left-8" />
                  <CarouselNext className="-right-4 md:-right-8" />
                </Carousel>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 md:py-24 bg-gray-900">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Preguntas Frecuentes</h2>
                        <p className="mt-2 text-lg text-gray-400">Respuestas a las dudas más comunes sobre nuestra plataforma.</p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div key={index} className="mb-4">
                                <details className="bg-gray-800 p-4 rounded-lg cursor-pointer">
                                    <summary className="font-bold text-lg text-white">{faq.question}</summary>
                                    <p className="mt-2 text-gray-400">{faq.answer}</p>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
