
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este token se utiliza para identificar a los usuarios autenticados.
// Se almacena en las cookies del navegador.
const AUTH_COOKIE_NAME = 'firebase-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lista de rutas que no requieren autenticación.
  const publicPaths = ['/login', '/register', '/pricing', '/payment'];

  // Obtener el token de autenticación de las cookies.
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isRootPath = pathname === '/';

  // Si el usuario está autenticado y trata de acceder a una ruta pública como login/register,
  // redirigirlo al dashboard.
  if (authToken && (isPublicPath || isRootPath)) {
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Permitir el acceso a la página de inicio (landing page) sin autenticación
  if (isRootPath) {
    return NextResponse.next();
  }

  // Permitir el acceso a las rutas públicas si no hay token
  if (isPublicPath && !authToken) {
    return NextResponse.next();
  }

  // Si el usuario intenta acceder a una ruta protegida (cualquiera que no sea pública o raíz)
  // y no hay token, redirigirlo a la página de login.
  if (!authToken && !isPublicPath && !isRootPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // Opcional: para redirigir al usuario de vuelta después del login.
    return NextResponse.redirect(loginUrl);
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
