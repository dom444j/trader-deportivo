import { NextResponse } from 'next/server';
import { getActiveSignals } from '@/lib/user-dashboard-data';

export async function GET() {
  const items = await getActiveSignals();
  return NextResponse.json({ data: items });
}