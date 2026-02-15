import { UserKpis } from '@/types/user-dashboard';

// Mock estable para la demo alineada al diseño
const MOCK_USER_KPIS: UserKpis = {
  bankroll: 1240,
  pnlMonth: 245,
  roiMonth: 0.245,
  drawdown: 0.08,
  discipline: 86,
  // === Nuevos campos alineación 1:1 ===
  planName: 'Pro',
  planStatus: 'por_vencer',
  planActivationRemainingDays: 12,
  planActivationTotalDays: 30,
  nextPaymentDue: true,

  rankName: 'R3',

  binaryBankA: 30000,
  binaryBankB: 27000,

  weeklyPoolEstimate: 57000,

  creditsAvailable: 12,
  alertsCount: 2,
  directsCount: 3,
};

export async function getUserKpis(userId?: string): Promise<UserKpis> {
  // Aquí podrías usar Prisma o servicios reales; por ahora devolvemos mock
  await new Promise((r) => setTimeout(r, 80));
  return { ...MOCK_USER_KPIS };
}