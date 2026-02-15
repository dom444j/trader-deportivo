import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

// Rutas protegidas por rol
const protectedRoutes = {
  admin: ['/admin', '/dashboard'],
  tipster: ['/tipster'],
  user: ['/user']
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Rutas de autenticación que deben ser públicas
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/admin/login', '/signup'];
  
  // Verificar si la ruta es de autenticación (pública)
  const isAuthRoute = authRoutes.some(route => path === route);
  
  // Verificar si la ruta requiere autenticación
  const requiresAuth = Object.values(protectedRoutes).flat().some(route => 
    path.startsWith(route)
  );

  // Si es una ruta de autenticación, permitir acceso sin verificar sesión
  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (requiresAuth) {
    // Obtener la sesión actual pasando el request
    const session = getSession(request);
    
    // Si no hay sesión, redirigir al login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar permisos según el rol (convertir a minúsculas para comparación)
    const userRole = session.user.role.toLowerCase();
    
    // Verificar acceso a rutas de admin
    if (protectedRoutes.admin.some(route => path.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // Verificar acceso a rutas de tipster
    if (protectedRoutes.tipster.some(route => path.startsWith(route))) {
      if (userRole !== 'tipster' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // Verificar acceso a rutas de usuario
    if (protectedRoutes.user.some(route => path.startsWith(route))) {
      if (userRole !== 'user' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/tipster/:path*',
    '/user/:path*'
  ]
};