import { NextRequest, NextResponse } from 'next/server';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'TIPSTER';
  avatar?: string;
}

export interface Session {
  user: User;
  expiresAt: number;
}

// Credenciales demo según CREDENCIALES-DEMO.md
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@traderdeportivo.co': {
    password: 'AdminTD!2024',
    user: {
      id: '1',
      email: 'admin@traderdeportivo.co',
      name: 'Administrador',
      role: 'ADMIN'
    }
  },
  'usuario.demo@traderdeportivo.co': {
    password: 'UserTD!2024',
    user: {
      id: '2',
      email: 'usuario.demo@traderdeportivo.co',
      name: 'Usuario Demo',
      role: 'USER'
    }
  },
  'tipster.pro@traderdeportivo.co': {
    password: 'TipsterTD!2024',
    user: {
      id: '3',
      email: 'tipster.pro@traderdeportivo.co',
      name: 'Tipster Pro',
      role: 'TIPSTER'
    }
  },
  'tipster.ai@traderdeportivo.co': {
    password: 'TipsterAI!2024',
    user: {
      id: '4',
      email: 'tipster.ai@traderdeportivo.co',
      name: 'Tipster AI',
      role: 'TIPSTER'
    }
  }
};

export async function login(email: string, password: string): Promise<User | null> {
  const userData = DEMO_USERS[email.toLowerCase()];
  
  if (!userData || userData.password !== password) {
    return null;
  }
  
  return userData.user;
}

export function createSession(user: User): Session {
  return {
    user,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  };
}

export function validateSession(session: Session): boolean {
  return session && session.expiresAt > Date.now();
}

export function getSession(request: NextRequest): Session | null {
  try {
    // Verificar que request.cookies existe y es una función
    if (!request?.cookies?.get) {
      return null;
    }
    
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return null;
    }
    
    const session = JSON.parse(sessionCookie.value);
    return validateSession(session) ? session : null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}

export async function getServerSession(): Promise<Session | null> {
  // Esta función se ejecuta en el servidor
  // Importar cookies de next/headers para acceder a las cookies del servidor
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    return validateSession(session) ? session : null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}

export function setSessionCookie(response: NextResponse, session: Session): void {
  response.cookies.set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 horas
    path: '/'
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}