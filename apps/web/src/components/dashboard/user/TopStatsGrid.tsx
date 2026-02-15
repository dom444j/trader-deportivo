import React from 'react';
import styles from '@/app/(dashboard)/user/UserDashboard.module.css';
import type { UserKpis } from '@/types/user-dashboard';

interface Props {
  kpis: UserKpis;
}

const TopStatsGrid: React.FC<Props> = ({ kpis }) => {
  const roiPct = `${(kpis.roiMonth * 100).toFixed(1)}%`;
  const ddPct = `${(kpis.drawdown * 100).toFixed(1)}%`;
  const money = (n: number) => `€${n.toLocaleString('es-ES')}`;

  const planStatusLabel = (
    kpis.planStatus === 'activo' ? 'Activo' : kpis.planStatus === 'por_vencer' ? 'Por vencer' : 'Expirado'
  );

  const bankAText = money(kpis.binaryBankA);
  const bankBText = money(kpis.binaryBankB);
  const bankTotal = kpis.binaryBankA + kpis.binaryBankB;
  const bankTotalText = money(bankTotal);
  const balanceRatio = (() => {
    const max = Math.max(kpis.binaryBankA, kpis.binaryBankB);
    const min = Math.min(kpis.binaryBankA, kpis.binaryBankB);
    return max > 0 ? (min / max) : 0;
  })();

  return (
    <section>
      <div className={styles.statsGrid}>
        {/* Plan actual */}
        <div className={`${styles.statCard} ${styles.areaPlan}`}>
          <div className={styles.statIcon}>💎</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Plan actual</span>
              <span className={styles.kpiBadge}>{planStatusLabel}</span>
            </div>
            <div className={styles.statCardValue}>{kpis.planName}</div>
            <div className={styles.statCardMeta}>
              Activación: {kpis.planActivationRemainingDays} días restantes de {kpis.planActivationTotalDays}
            </div>
            <div className={styles.statMeta}>
              Estado: {planStatusLabel} · Próximo pago: {kpis.nextPaymentDue ? 'Sí' : 'No'}
            </div>
            <button className={styles.actionBtn} aria-label="Renovar plan">Renovar</button>
          </div>
        </div>

        {/* Rango */}
        <div className={`${styles.statCard} ${styles.areaRango}`}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Rango</span>
              <span className={styles.kpiBadge}>XP</span>
            </div>
            <div className={styles.statCardValue}>{kpis.rankName}</div>
            <div className={styles.statCardMeta}>Disciplina {kpis.discipline}/100</div>
          </div>
        </div>

        {/* Equipo Binario (A/B) */}
        <div className={`${styles.statCard} ${styles.areaEquipo}`}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Equipo Binario (A/B)</span>
              <span className={styles.kpiBadge}>Banca</span>
            </div>
            <div className={styles.statCardMeta}><strong>Bank A:</strong> {bankAText} · <strong>Bank B:</strong> {bankBText}</div>
            <div className={styles.statCardValue}>{bankTotalText}</div>
            <div className={styles.statCardMeta}>Balance A/B</div>
            <div className={styles.progressBar} aria-label="Progreso equilibrio A/B">
              <div className={styles.progressFill} style={{ width: `${(balanceRatio * 100).toFixed(0)}%` }} />
            </div>
          </div>
        </div>

        {/* Pool semanal estimado */}
        <div className={`${styles.statCard} ${styles.areaPool}`}>
          <div className={styles.statIcon}>🏦</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Pool semanal estimado</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Estimado</span>
            </div>
            <div className={styles.statCardValue}>{money(kpis.weeklyPoolEstimate)}</div>
            <div className={styles.statCardMeta}>ROI Mes {roiPct} · DD {ddPct}</div>
          </div>
        </div>

        {/* Saldo disponible */}
        <div className={`${styles.statCard} ${styles.areaSaldo}`}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Saldo disponible</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Bankroll</span>
            </div>
            <div className={styles.statCardValue}>{money(kpis.bankroll)}</div>
            <div className={styles.statCardMeta}>PnL Mes {kpis.pnlMonth >= 0 ? '+' : ''}{money(Math.abs(kpis.pnlMonth))}</div>
          </div>
        </div>

        {/* Créditos (señales) */}
        <div className={`${styles.statCard} ${styles.areaCreditos}`}>
          <div className={styles.statIcon}>🎟️</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Créditos</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Señales</span>
            </div>
            <div className={styles.statCardValue}>{kpis.creditsAvailable}</div>
            <div className={styles.statCardMeta}>Disponibles esta semana</div>
          </div>
        </div>

        {/* Próximo pago */}
        <div className={`${styles.statCard} ${styles.areaProximo}`}>
          <div className={styles.statIcon}>🗓️</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Próximo pago</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Suscripción</span>
            </div>
            <div className={styles.statCardValue}>{kpis.nextPaymentDue ? 'Sí' : 'No'}</div>
            <div className={styles.statCardMeta}>En {kpis.planActivationRemainingDays} días</div>
            <button className={styles.actionBtn} aria-label="Renovar ahora">Renovar</button>
          </div>
        </div>

        {/* Alertas de Señales */}
        <div className={`${styles.statCard} ${styles.areaAlertas}`}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Alertas de Señales</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Info</span>
            </div>
            <div className={styles.statCardValue}>{kpis.alertsCount}</div>
            <div className={styles.statCardMeta}>Activas</div>
          </div>
        </div>

        {/* Directos (referidos 10%) */}
        <div className={`${styles.statCard} ${styles.areaDirectos}`}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statContent}>
            <div className={styles.statHeader}>
              <span className={styles.statCardTitle}>Directos</span>
              <span className={`${styles.kpiBadge} ${styles.chip}`}>Referidos 10%</span>
            </div>
            <div className={styles.statCardValue}>{kpis.directsCount}</div>
            <div className={styles.statCardMeta}>Activos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopStatsGrid;