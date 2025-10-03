'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthHook } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthHook();

  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-jakarta">
          GeoVeraxis
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#features" className="hover:text-primary transition-colors">Características</Link>
          <Link href="/#testimonials" className="hover:text-primary transition-colors">Testimonios</Link>
          <Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Button onClick={signOut} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Cerrar Sesión</Button>
            </>
          ) : (
            <Link href="/login">
                <Button className="bg-primary hover:bg-primary-dark text-white">Iniciar Sesión</Button>
            </Link>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-4 items-center">
            <Link href="/#features" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Características</Link>
            <Link href="/#testimonials" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonios</Link>
            <Link href="/#faq" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Button onClick={() => { signOut(); setIsMenuOpen(false); }} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Cerrar Sesión</Button>
              </>
            ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-primary hover:bg-primary-dark text-white">Iniciar Sesión</Button>
                </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
