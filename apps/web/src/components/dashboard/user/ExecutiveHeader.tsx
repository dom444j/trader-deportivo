"use client";
import React from "react";
import type { UserKpis } from "@/types/user-dashboard";
import styles from "@/app/(dashboard)/user/UserDashboard.module.css";

export default function ExecutiveHeader({ kpis }: { kpis?: UserKpis }) {
  return (
    <section className={`${styles.card} ${styles.executiveHeaderCard}`}>
      <div className={styles.cardHeader}>
        <h2>Resumen Ejecutivo</h2>
        <div className={styles.modeBadge}>MODO: Pro</div>
      </div>

      <div className={styles.executiveHeader}>
        <div className={styles.kpiRow}>
          <div className={styles.kpiItem}>
            <div className={styles.kpiLabel}>Ganancias (30d)</div>
            <div className={`${styles.kpiValue} ${styles.kpiPositive}`}>+ $1,250</div>
          </div>
          <div className={styles.kpiItem}>
            <div className={styles.kpiLabel}>Win Rate</div>
            <div className={styles.kpiValue}>58.3%</div>
          </div>
          <div className={styles.kpiItem}>
            <div className={styles.kpiLabel}>Yield</div>
            <div className={styles.kpiValue}>+ 12.4%</div>
          </div>
          <div className={styles.kpiItem}>
            <div className={styles.kpiLabel}>Rachas</div>
            <div className={`${styles.kpiValue} ${styles.kpiNegative}`}>- 3</div>
          </div>
        </div>

        <div className={styles.overviewRow}>
          <div className={styles.overviewGroup}>
            <span className={`${styles.chip} ${styles.chipPositive}`}>+8 EV</span>
            <span className={styles.chip}>47 Señales</span>
            <span className={styles.chip}>5 Ligas</span>
          </div>
          <div className={styles.overviewActions}>
            <a className={styles.cardLink} href="/reports">Ver reportes</a>
            <a className={styles.cardLink} href="/settings">Ajustes</a>
          </div>
        </div>
      </div>
    </section>
  );
}