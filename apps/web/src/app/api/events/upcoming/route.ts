import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/user-dashboard-data';

export async function GET() {
  const items = await getUpcomingEvents();
  return NextResponse.json({ data: items });
}