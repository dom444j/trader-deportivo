import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    
    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}