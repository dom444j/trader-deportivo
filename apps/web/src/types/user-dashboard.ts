export interface UserKpis {
  bankroll: number; // Saldo actual de la banca
  pnlMonth: number; // Beneficio/Pérdida del mes (EUR)
  roiMonth: number; // ROI mensual en porcentaje (ej: 0.245 => 24.5%)
  drawdown: number; // Máximo drawdown reciente en porcentaje positivo (ej: 0.12 => 12%)
  discipline: number; // Índice 0-100
  // === Alineación Top Stats (dashboard_profesional_checklist.md) ===
  planName: string; // "Pro", "Elite", etc.
  planStatus: 'activo' | 'por_vencer' | 'expirado';
  planActivationRemainingDays: number; // Días restantes de activación
  planActivationTotalDays: number; // Total del ciclo, ej: 30
  nextPaymentDue: boolean; // Próximo pago: Sí/No

  rankName: string; // Rango actual (R1..R15, etc.)

  binaryBankA: number; // Bank A
  binaryBankB: number; // Bank B

  weeklyPoolEstimate: number; // Pool Semanal Estimado (€)

  creditsAvailable: number; // Créditos de señales disponibles
  alertsCount: number; // Alertas de señales activas
  directsCount: number; // Directos totales
}

export type KpiKey = keyof UserKpis;