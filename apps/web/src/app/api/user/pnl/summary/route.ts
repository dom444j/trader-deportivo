import { NextResponse } from 'next/server';
import { getUserKpis } from '@/lib/user-kpis';

export async function GET() {
  const kpis = await getUserKpis();
  return NextResponse.json({ data: { pnlMonth: kpis.pnlMonth, roiMonth: kpis.roiMonth } });
}