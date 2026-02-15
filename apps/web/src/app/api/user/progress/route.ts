import { NextResponse } from 'next/server';
import { getProgressSummary } from '@/lib/user-dashboard-data';

export async function GET() {
  const summary = await getProgressSummary();
  return NextResponse.json({ data: summary });
}