import { UserKpis } from '@/types/user-dashboard';

// Mock estable para la demo alineada al diseño
const MOCK_USER_KPIS: UserKpis = {
  bankroll: 1240,
  pnlMonth: 245,
  roiMonth: 0.245,
  bankrollChangeMoMPct: 0.125, // +12.5% vs mes anterior
  drawdown: 0.08,
  discipline: 86,
  // === Nuevos campos alineación 1:1 ===
  planName: 'Pro',
  planStatus: 'por_vencer',
  planActivationRemainingDays: 12,
  planActivationTotalDays: 30,
  nextPaymentDue: true,
  nextPaymentWeek: 48,
  nextPaymentEligible: true,
  nextPaymentCutoff: 'Jue 23:59',

  rankName: 'R3',

  binaryBankA: 30000,
  binaryBankB: 27000,
  binaryDirectsA: 2,
  binaryIndirectsA: 8,
  binaryDirectsB: 1,
  binaryIndirectsB: 12,
  nextRankName: 'R5',
  progressToNextRankPct: 0.016,

  weeklyPoolEstimate: 85,
  baseWeeklyProfit: 10000,
 
  creditsAvailable: 12,
  alertsCount: 2,
  directsCount: 3,

  // === Referidos ===
  directsCommissionsAvailable: 127,
  directsCommissionsPending: 45,
  referralCode: 'dom123',

  // Mini KPIs Directos
  directsNew7d: 2,
  directsGrowthPct: 0.18,
};

export async function getUserKpis(userId?: string): Promise<UserKpis> {
  // Aquí podrías usar Prisma o servicios reales; por ahora devolvemos mock
  await new Promise((r) => setTimeout(r, 80));
  return { ...MOCK_USER_KPIS };
}