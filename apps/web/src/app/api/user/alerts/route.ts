import { NextResponse } from 'next/server';
import { getUserAlerts } from '@/lib/user-dashboard-data';

export async function GET() {
  const items = await getUserAlerts();
  return NextResponse.json({ data: items });
}