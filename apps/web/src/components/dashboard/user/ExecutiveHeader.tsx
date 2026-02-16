"use client";
import React from "react";
import type { UserKpis } from "@/types/user-dashboard";
import base from "../../../app/(dashboard)/user/UserDashboard.module.css";

export default function ExecutiveHeader({ kpis }: { kpis?: UserKpis }) {
  return (
    <section className={`${base.card} ${base.executiveHeaderCard}`}>
      <div className={base.cardHeader}>
        <h2>Resumen Ejecutivo</h2>
        <div className={base.modeBadge}>MODO: Pro</div>
      </div>

      <div className={base.executiveHeader}>
        <div className={base.kpiRow}>
          <div className={base.kpiItem}>
            <div className={base.kpiLabel}>Ganancias (30d)</div>
            <div className={`${base.kpiValue} ${base.kpiPositive}`}>+ $1,250</div>
          </div>
          <div className={base.kpiItem}>
            <div className={base.kpiLabel}>Win Rate</div>
            <div className={base.kpiValue}>58.3%</div>
          </div>
          <div className={base.kpiItem}>
            <div className={base.kpiLabel}>Yield</div>
            <div className={base.kpiValue}>+ 12.4%</div>
          </div>
          <div className={base.kpiItem}>
            <div className={base.kpiLabel}>Rachas</div>
            <div className={`${base.kpiValue} ${base.kpiNegative}`}>- 3</div>
          </div>
        </div>

        <div className={base.overviewRow}>
          <div className={base.overviewGroup}>
            <span className={`${base.chip} ${base.chipPositive}`}>+8 EV</span>
            <span className={base.chip}>47 Señales</span>
            <span className={base.chip}>5 Ligas</span>
          </div>
          <div className={base.overviewActions}>
            <a className={base.cardLink} href="/reports">Ver reportes</a>
            <a className={base.cardLink} href="/settings">Ajustes</a>
          </div>
        </div>
      </div>
    </section>
  );
}