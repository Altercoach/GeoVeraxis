
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este token se utiliza para identificar a los usuarios autenticados.
// Se almacena en las cookies del navegador.
const AUTH_COOKIE_NAME = 'firebase-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lista de rutas que no requieren autenticación.
  const publicPaths = ['/login', '/register', '/pricing', '/'];

  // Si la ruta es pública, permitir el acceso sin verificar la autenticación.
  if (publicPaths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path)))) {
    return NextResponse.next();
  }

  // Obtener el token de autenticación de las cookies.
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);

  // Si el usuario intenta acceder a una ruta protegida (como /dashboard)
  // y no hay token, redirigirlo a la página de login.
  if (pathname.startsWith('/dashboard') && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // Opcional: para redirigir al usuario de vuelta después del login.
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está autenticado y trata de acceder a login/register,
  // redirigirlo al dashboard.
  if ((pathname === '/login' || pathname === '/register') && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Para todas las demás rutas, permitir el acceso.
  return NextResponse.next();
}

// Configuración del middleware para especificar qué rutas debe vigilar.
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto las que son para archivos estáticos,
    // imágenes o rutas internas de Next.js.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
