'use client'
import React from 'react';
import styles from '@/app/(dashboard)/user/UserDashboard.module.css';
import type { UserKpis } from '@/types/user-dashboard';
import type { AlertItem } from '@/types/user-dashboard-extra';
import { MetricCard } from '@/components/ui-kit/MetricCard';

interface Props {
  kpis: UserKpis;
}

const TopStatsGrid: React.FC<Props> = ({ kpis }) => {
  // Helpers de formato
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const formatMoneyCompact = (val: number) => {
    if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `€${(val / 1_000).toFixed(0)}k`;
    return formatMoney(val);
  };

  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  // Textos formateados
  const roiPct = formatPercent(kpis.roiMonth);
  const ddPct = formatPercent(kpis.drawdown);
  const money = (n: number) => formatMoney(n);

  // Plan Status
  const planStatusLabel = 
    kpis.planStatus === 'activo' ? 'Activo' : 
    kpis.planStatus === 'por_vencer' ? 'Por vencer' : 
    'Expirado';

  // Equipo Binario
  const bankAText = formatMoney(kpis.binaryBankA);

  // ===== Alertas (estado local para última alerta y contador live) =====
  const [alertsCountLive, setAlertsCountLive] = React.useState<number | null>(null);
  const [lastAlert, setLastAlert] = React.useState<AlertItem | null>(null);

  const formatTimeAgo = React.useCallback((iso: string) => {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 1) return 'hace segundos';
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `hace ${hrs} h`;
    const days = Math.round(hrs / 24);
    return `hace ${days} d`;
  }, []);

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/user/alerts')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (!mounted) return;
        const list: AlertItem[] = Array.isArray(data) ? data : (data?.items ?? []);
        setAlertsCountLive(list.length);
        setLastAlert(list[0] ?? null);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const bankBText = formatMoney(kpis.binaryBankB);
  const bankATextCompact = formatMoneyCompact(kpis.binaryBankA);
  const bankBTextCompact = formatMoneyCompact(kpis.binaryBankB);
  const bankTotal = kpis.binaryBankA + kpis.binaryBankB;
  const bankTotalText = formatMoney(bankTotal);
  
  const balanceRatio = (() => {
    const max = Math.max(kpis.binaryBankA, kpis.binaryBankB);
    const min = Math.min(kpis.binaryBankA, kpis.binaryBankB);
    return max > 0 ? (min / max) : 0;
  })();

  // ===== Referidos: enlace y feedback de copia =====
  const [copied, setCopied] = React.useState(false);
  const referralLink = React.useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const code = kpis.referralCode ?? '';
    return `${origin}/signup?ref=${encodeURIComponent(code)}`;
  }, [kpis.referralCode]);

  const copyReferral = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
    }
  }, [referralLink]);

  // Datos de equipos (hardcodeados si no están en kpis)
  const directsA = kpis.binaryDirectsA ?? 2;
  const indirectsA = kpis.binaryIndirectsA ?? 8;
  const directsB = kpis.binaryDirectsB ?? 1;
  const indirectsB = kpis.binaryIndirectsB ?? 12;
  const progressPct = (kpis.progressToNextRankPct ?? 0.016) * 100;

  return (
    <section>
      <div className={styles.statsGrid}>
        {/* Plan actual */}
        <MetricCard title="Plan actual" icon="💎" className={styles.areaPlan}>
          <div className={styles.statCardValue}>{kpis.planName}</div>
          {planStatusLabel === 'Expirado' && (
            <div className={styles.statMeta}>Suscripción expirada</div>
          )}
          <div className={styles.statMeta}>
            Activación: <span className={styles.metaPositive}>{kpis.planActivationRemainingDays} días restantes</span> de {kpis.planActivationTotalDays}
          </div>
          <div className={styles.statMeta}>
            Estado: <span className={planStatusLabel === 'Activo' ? styles.metaPositive : (planStatusLabel === 'Por vencer' ? styles.metaWarning : styles.metaDanger)}>{planStatusLabel}</span> · Próximo pago: <span className={kpis.nextPaymentDue ? styles.metaPositive : styles.metaDanger}>{kpis.nextPaymentDue ? 'Sí' : 'No'}</span>
          </div>
          <button className={`${styles.goldBtn} ${styles.goldBtnLarge}`}>Renovar</button>
        </MetricCard>


        {/* Rango */}
        <MetricCard title="Rango" icon="🏅" className={styles.areaRango}>
          {/* Línea principal: R4 -> R3 */}
          <div className={styles.rankRow}>
            <div className={styles.rankCol}>
              <div className={`${styles.rankBig} ${styles.rankBase}`}>{kpis.rankBase ?? 'R4'}</div>
              <div className={styles.rankSub}>BASE</div>
            </div>
            <div className={styles.rankArrow}>→</div>
            <div className={styles.rankCol}>
              <div className={`${styles.rankBig} ${styles.rankPay}`}>{kpis.rankPayable ?? 'R3'}</div>
              <div className={styles.rankSub}>PAGABLE</div>
            </div>
          </div>

          {/* Plan requerido: Pro */}
          <div className={styles.rankInfo} style={{ marginTop: 10 }}>
            Plan requerido: <strong style={{ color: 'var(--secondary-gold)' }}>Pro</strong> para cobrar R4+
          </div>

          {/* Sugerencia */}
          <div className={styles.suggestCard}>
            <span style={{ fontSize: 14 }}>💡</span>
            <span className={styles.suggestText}>
              <strong>Sugerencia:</strong> Actualiza a <strong>Pro</strong> para desbloquear R4–R7
            </span>
          </div>

          {/* Próximo requisito + CTA */}
          <div className={styles.statMeta} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
            <div><strong>Próximo:</strong> R4 requiere €25,000 en equipo</div>
            <button className={styles.goldBtn}>Sube a Pro</button>
          </div>
        </MetricCard>

        {/* Equipo Binario (A/B) - CORREGIDO */}
        <MetricCard title="Equipo Binario" icon="🏦" className={styles.areaEquipo}>
            {/* Línea 1: Banks A y B */}
            <div className={styles.bankRow}>
              <div className={styles.bankItem}>
                <div className={styles.bankLabel}>Bank A</div>
                <div className={`${styles.bankValue} ${styles.bankValueA}`}><AutoShrinkText>{bankAText}</AutoShrinkText></div>
              </div>
              <div className={styles.bankItem}>
                <div className={styles.bankLabel}>Bank B</div>
                <div className={`${styles.bankValue} ${styles.bankValueB}`}><AutoShrinkText>{bankBText}</AutoShrinkText></div>
              </div>
            </div>

            {/* Línea 2: Total + Progreso */}
            <div className={`${styles.statMeta} ${styles.totalProgressRow}`}>
              <div className={styles.totalProgressLeft}>
                <AutoShrinkText max={13} min={10}>
                  Bank Total: <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>{bankTotalText}</span>
                </AutoShrinkText>
              </div>
              <div className={styles.totalProgressRight}>
                <AutoShrinkText max={13} min={10}>
                  Progreso a R5: {progressPct.toFixed(1)}%
                </AutoShrinkText>
              </div>
            </div>

            {/* Línea 3: Resumen ELIMINADA por redundancia */}

            {/* Línea 4: Mejorando */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--primary-green)',
              fontWeight: 600
            }}>
              <span style={{ fontSize: '16px' }}>↗</span>
              <span>Mejorando desde máximo</span>
            </div>

            {/* Línea 5: Equipos */}
            <div className={styles.statMeta} style={{ marginTop: '6px', fontSize: '12px', lineHeight: 1.2 }}>
              <AutoShrinkText max={11} min={8}>
                <strong>Eq. A:</strong> <span style={{ color: 'var(--primary-cyan)' }}>{directsA}D</span>/{indirectsA}I <span style={{ opacity: 0.4 }}>|</span> <strong>Eq. B:</strong> <span style={{ color: 'var(--primary-cyan)' }}>{directsB}D</span>/{indirectsB}I
              </AutoShrinkText>
            </div>

            {/* Barra de progreso */}
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPct.toFixed(1)}%` }} />
            </div>
        </MetricCard>

        {/* Pool semanal estimado */}
        <div className={`${styles.statCard} ${styles.areaPool}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className={styles.statLabel}>Pool semanal estimado</div>
                <span className={styles.infoDot}>i</span>
              </div>
            </div>
            <div className={styles.statIcon}>💰</div>
          </div>
          <div className={styles.statContent}>
            {/* Valor principal (~€85) en formato "pill" sin desbordes */}
            <div className={styles.statCardValuePill}>
              <AutoShrinkText max={20} min={14}>{`~${money(kpis.weeklyPoolEstimate)}`}</AutoShrinkText>
            </div>

            {/* Meta: basado en beneficio semanal global y bolsa por rango */}
            <div className={styles.statMeta}>
              {(() => {
                const poolShareByRank: Record<string, number> = { R1: 0.03, R2: 0.05, R3: 0.07, R4: 0.08, R5: 0.1 };
                const share = poolShareByRank[kpis.rankName] ?? 0.07;
                const baseWeeklyProfit = kpis.baseWeeklyProfit ?? 10000;
                return (
                  <>
                    Basado en beneficio semanal de {formatMoney(baseWeeklyProfit)} · Bolsa {kpis.rankName}: {(share * 100).toFixed(0)}%
                  </>
                );
              })()}
            </div>

            {/* Meta positiva: ROI mensual */}
            <div className={styles.statMeta} style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px', lineHeight: 1, color: 'var(--primary-green)' }}>↑</span>
              <span className={styles.metaPositive}>+{roiPct} ROI mensual</span>
            </div>

            {/* Meta: compartido con ~N usuarios del mismo rango */}
            <div className={styles.statMeta} style={{ marginTop: '4px' }}>
              {(() => {
                const approxParticipants = Math.max(2, (kpis.directsCount ?? 0) * 2 + 2);
                return <>Compartido con: ~{approxParticipants} usuarios {kpis.rankName}</>;
              })()}
            </div>

            {/* CTA */}
            <button className={styles.cyanBtnLarge}>Ver desglose</button>
          </div>
        </div>

        {/* Saldo disponible */}
        <div className={`${styles.statCard} ${styles.areaSaldo}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div className={styles.statLabel}>Saldo disponible</div>
            </div>
            <div className={styles.statIcon}>💼</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statCardValue}>
              <AutoShrinkText max={30} min={18}>{`€ ${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(kpis.bankroll)}`}</AutoShrinkText>
            </div>
            <div className={styles.statCardMeta}>Wallet balance</div>
            <div className={`${styles.statCardMeta} ${kpis.bankrollChangeMoMPct >= 0 ? styles.metaPositive : styles.metaDanger}`}>
              {kpis.bankrollChangeMoMPct >= 0 ? '↑' : '↓'} {(kpis.bankrollChangeMoMPct * 100).toFixed(1)}% vs mes anterior
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className={`${styles.statCard} ${styles.areaCreditos}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div className={styles.statLabel}>Créditos</div>
            </div>
            <div className={styles.statIcon}>🪙</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statCardValue}>
              <AutoShrinkText max={28} min={16}>{`€ ${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(kpis.creditsAvailable)}`}</AutoShrinkText>
            </div>
            <div className={styles.statCardMeta}>Disponibles esta semana</div>
            {kpis.creditsAvailable < 10 && (
              <a href="/user/premium/credits" className={styles.actionBtn}>Comprar créditos</a>
            )}
          </div>
        </div>

        {/* Próximo pago */}
        <div className={`${styles.statCard} ${styles.areaProximo}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div className={styles.statLabel}>Próximo pago</div>
            </div>
            <div className={styles.statIcon}>🗓️</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statCardValue}>
            Semana <span className={styles.weekPill}>#{kpis.nextPaymentWeek}</span>
            </div>
            <div className={styles.statCardMeta} title="Indica si cumples requisitos para cobrar en el próximo corte.">
            Elegible: <span className={kpis.nextPaymentEligible ? styles.metaPositive : styles.metaDanger}>{kpis.nextPaymentEligible ? 'Sí' : 'No'}</span>
            </div>
            <div className={styles.statCardMeta} title="Hora límite de elegibilidad para este pago (zona horaria de la UI).">
            Corte: <span className={styles.metaWarning}>{kpis.nextPaymentCutoff}</span>
            </div>
            <a href="/user/referrals#payments" className={styles.actionBtn}>Historial</a>
          </div>
        </div>

        {/* Alertas de Señales */}
        <div className={`${styles.statCard} ${styles.areaAlertas}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div className={styles.statLabel}>Alertas de señales</div>
            </div>
            <div className={styles.statIcon}>🔔</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statCardValue}>
              <span>{alertsCountLive ?? kpis.alertsCount}</span>
              <span className={styles.valueLabel}>Activas</span>
            </div>
            <div className={styles.statCardMeta}>
              {lastAlert ? (
                <>
                  Última: <a className={styles.linkInline} href="/user/signals">{lastAlert.title}</a> {formatTimeAgo(lastAlert.createdAt)}
                </>
              ) : (
                'Sin novedades recientes'
              )}
            </div>
            <a href="/user/signals" className={styles.actionBtn}>Ver alertas</a>
          </div>
        </div>

        {/* Directos */}
        <div className={`${styles.statCard} ${styles.areaDirectos}`}>
          <div className={styles.statHeader}>
            <div style={{ flex: 1 }}>
              <div className={styles.statLabel}>Directos</div>
            </div>
            <div className={styles.statIcon}>👤</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statCardValue}>{kpis.directsCount}</div>
            <div className={styles.statCardMeta}>
              <span className={styles.inlineMeta}>
                Comisiones: <span className={styles.metaPositive}>+{money(kpis.directsCommissionsAvailable ?? 0)}</span> disponibles · <span className={styles.metaPending}>€{(kpis.directsCommissionsPending ?? 0).toFixed(0)}</span> pendientes
              </span>
            </div>

            {/* Bloque: KPIs + botón Copiar enlace alineado a la derecha (bajo el icono) */}
            <div className={styles.directsFooter}>
              <div className={styles.directsKpiRow}>
                <div className={styles.directsKpi} title="Nuevos directos en los últimos 7 días">
                  <span className={styles.directsKpiLabel}>Nuevos 7d</span>
                  <span className={`${styles.directsKpiValue} ${styles.directsKpiValuePositive}`}>+{kpis.directsNew7d ?? 0}</span>
                </div>
                <div className={styles.directsKpi} title="Crecimiento vs periodo anterior">
                  <span className={styles.directsKpiLabel}>Crecimiento</span>
                  <span className={`${styles.directsKpiValue} ${(kpis.directsGrowthPct ?? 0) >= 0 ? styles.directsKpiValuePositive : styles.metaDanger}`}>{(kpis.directsGrowthPct ?? 0) >= 0 ? '+' : ''}{Math.round((kpis.directsGrowthPct ?? 0) * 100)}%</span>
                </div>
              </div>

              <button className={`${styles.actionBtnGhostSmall} ${styles.copyLinkBtn}`} onClick={copyReferral} aria-label="Copiar enlace de invitación">
                {copied ? 'Copiado ✓' : 'Copiar enlace'}
              </button>
            </div>
          </div>
        </div>

        {/* Próximo pago semanal (banner) */}
        {(() => {
          const weekNum = Math.max(1, Math.min(53, Number(kpis.nextPaymentWeek ?? 5)));
          const weekLabel = `W${String(weekNum).padStart(2, '0')}`;
          const yearIso = new Date().getUTCFullYear();
          const isoComposite = `${yearIso}-${weekLabel}`;
          const badges = Array.from({ length: 4 }, (_, i) => {
            const w = ((weekNum - 1 + i) % 53) + 1;
            return `W${String(w).padStart(2, '0')}`;
          });
          return (
            <div className={styles.areaPayout}>
              <div className={styles.payoutBanner}>
                <div className={styles.payoutLeft}>
                  <div className={styles.payoutIcon}>📆</div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.payoutTitle}>
                      Próximo pago semanal · <span style={{ color: 'var(--secondary-gold)' }}>{isoComposite}</span>
                    </div>
                    <div className={styles.payoutMeta}>
                      Pago: Miércoles · Fuente de verdad UTC (UI en America/Bogota). Cutoff: {kpis.nextPaymentCutoff}
                    </div>
                    <div className={styles.eligibleWeeksGrid}>
                      {badges.map((b, idx) => (
                        <div key={b} className={`${styles.weekBadge} ${idx === 0 ? styles.current : ''}`}>{b}{idx === 0 ? ' ✓' : ''}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.payoutTags}>
                  <span className={styles.tagEligible}>Elegible: <span className={`${styles.tagPill} ${styles.tagPillOk}`}>{kpis.nextPaymentEligible ? 'Sí' : 'No'}</span></span>
                  <span className={styles.tagRank}>Rango pagable: <span className={`${styles.tagPill} ${styles.tagPillRank}`}>{kpis.rankPayable ?? 'R3'}</span></span>
                  <button className={styles.payoutBtn} onClick={() => setShowHistory(true)}>Ver historial</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default TopStatsGrid;

// Auto-ajuste de texto para evitar desbordes (reduce hasta ~20%)
function AutoShrinkText({ children, max = 18, min = 14.4 }: { children: React.ReactNode; max?: number; min?: number }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  const adjust = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    let font = max;
    el.style.fontSize = `${font}px`;
    el.style.whiteSpace = 'nowrap';
    // Reducir en pasos finos hasta que quepa
    const fits = () => el.scrollWidth <= parent.clientWidth - 2;
    while (font > min && !fits()) {
      font -= 0.5;
      el.style.fontSize = `${font}px`;
    }
  }, [max, min]);

  React.useEffect(() => {
    adjust();
    const parent = ref.current?.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => adjust());
    ro.observe(parent);
    return () => ro.disconnect();
  }, [adjust, children]);

  return <span ref={ref} style={{ display: 'inline-block' }}>{children}</span>;
}