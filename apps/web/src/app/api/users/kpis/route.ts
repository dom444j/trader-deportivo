import { NextResponse } from 'next/server';
import { getUserKpis } from '@/lib/user-kpis';

export async function GET() {
  try {
    const data = await getUserKpis('current');
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('Error fetching user KPIs', e);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}