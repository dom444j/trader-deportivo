export interface UserKpis {
  bankroll: number; // Saldo actual de la banca
  pnlMonth: number; // Beneficio/Pérdida del mes (EUR)
  roiMonth: number; // ROI mensual en porcentaje (ej: 0.245 => 24.5%)
  /** Variación del bankroll vs mes anterior (p.ej. 0.125 => +12.5%) */
  bankrollChangeMoMPct: number;
  drawdown: number; // Máximo drawdown reciente en porcentaje positivo (ej: 0.12 => 12%)
  discipline: number; // Índice 0-100
  // === Alineación Top Stats (dashboard_profesional_checklist.md) ===
  planName: string; // "Pro", "Elite", etc.
  planStatus: 'activo' | 'por_vencer' | 'expirado';
  planActivationRemainingDays: number; // Días restantes de activación
  planActivationTotalDays: number; // Total del ciclo, ej: 30
  nextPaymentDue: boolean; // Próximo pago: Sí/No
  /** Semana ISO del próximo pago (p.ej. 48) */
  nextPaymentWeek: number;
  /** Si el usuario es elegible para cobrar en el próximo pago */
  nextPaymentEligible: boolean;
  /** Etiqueta de cutoff para validación (p.ej. 'Jue 23:59') */
  nextPaymentCutoff: string;

  rankName: string; // Rango actual (R1..R15, etc.)
  // Campos opcionales usados en TopStatsGrid para mostrar base y pagable
  rankBase?: string;
  rankPayable?: string;

  binaryBankA: number; // Bank A
  binaryBankB: number; // Bank B

  // Detalle Equipo Binario (A/B)
  binaryDirectsA: number;    // Directos en lado A
  binaryIndirectsA: number;  // Indirectos en lado A
  binaryDirectsB: number;    // Directos en lado B
  binaryIndirectsB: number;  // Indirectos en lado B

  // Progreso hacia siguiente rango
  nextRankName: string;          // p.ej. 'R5'
  progressToNextRankPct: number; // 0.016 => 1.6%

  weeklyPoolEstimate: number; // Pool Semanal Estimado (€)
  baseWeeklyProfit: number; // Beneficio semanal base para cálculo del pool

  creditsAvailable: number; // Créditos de señales disponibles
  alertsCount: number; // Alertas de señales activas
  directsCount: number; // Directos totales

  // === Referidos: métricas compactas para el card de Directos ===
  directsCommissionsAvailable: number; // Comisiones disponibles a retirar (EUR)
  directsCommissionsPending: number;   // Comisiones pendientes/por confirmar (EUR)
  referralCode: string; // Código de referido del usuario para generar enlace de invitación

  // Mini KPIs dentro de Directos
  directsNew7d: number;      // Nuevos directos en últimos 7 días
  directsGrowthPct: number;  // Crecimiento vs periodo anterior (0.12 => +12%)
}

export type KpiKey = keyof UserKpis;