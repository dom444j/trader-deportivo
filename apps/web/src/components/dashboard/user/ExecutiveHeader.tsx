import React from 'react';
import styles from '../../../app/(dashboard)/user/UserDashboard.module.css';
import type { UserKpis } from '@/types/user-dashboard';

export default function ExecutiveHeader({ kpis: _kpis }: { kpis: UserKpis }) {
  return (
    <header className={styles.executiveHeader}>
      <div className={styles.kpiRow}>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Bankroll</span>
          <span className={styles.kpiValue}>€ 12,450</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>P&L (Mes)</span>
          <span className={`${styles.kpiValue} ${styles.kpiPositive}`}>+€ 1,280</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>ROI (Mes)</span>
          <span className={styles.kpiValue}>8.6%</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Drawdown</span>
          <span className={styles.kpiValue}>-4.2%</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Disciplina</span>
          <span className={styles.kpiValue}>92%</span>
        </div>
      </div>

      {/* Trading Overview (secundario, sin lógica) */}
      <div className={styles.overviewRow}>
        <div className={styles.overviewGroup}>
          <span className={`${styles.chip} ${styles.chipPositive}`}>PnL Semanal: +€ 320</span>
          <span className={styles.chip}>Exposición: 6 picks | 3 ligas</span>
          <span className={styles.chip}>Riesgo Diario OK</span>
        </div>

        <div className={styles.overviewActions}>
          <span className={styles.modeBadge}>Modo: Profesional</span>
          <button className={styles.cardLink} aria-label="Ver reportes">Ver reportes</button>
        </div>
      </div>
    </header>
  );
}