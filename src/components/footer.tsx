'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-bold font-jakarta">GeoVeraxis</p>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} GeoVeraxis. Todos los derechos reservados.</p>
        </div>
        <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
}
