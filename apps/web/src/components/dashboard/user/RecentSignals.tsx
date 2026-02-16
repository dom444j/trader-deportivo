"use client";
import React from "react";
import base from "../../../app/(dashboard)/user/UserDashboard.module.css";
import styles from "./RecentSignals.module.css";

export type RecentSignal = {
  id: string;
  agent: string;
  market: string;
  odds: number;
  ev: string; // formatted e.g. +5.2%
  stake: string; // formatted e.g. $25.00
  status: string; // ACTIVA | PENDIENTE | CERRADA
  result?: string; // e.g. +$29.00 or –
};

export default function RecentSignals({ signals }: { signals: RecentSignal[] }) {
  return (
    <section className={`${base.card} ${styles.section}`}>
      <div className={base.cardHeader}>
        <h2>Señales Recientes</h2>
        <a href="/signals" className={base.cardLink}>Ver todas →</a>
      </div>
      <div className={base.cardBody}>
        <div className={styles.thead}>
          <div>Agente</div>
          <div>Mercado</div>
          <div>Cuota</div>
          <div>EV</div>
          <div>Stake</div>
          <div>Estado</div>
          <div>Resultado</div>
        </div>
        {signals.map((s) => (
          <div className={styles.row} key={s.id}>
            <div className={styles.agent}>{s.agent}</div>
            <div className={styles.market}>{s.market}</div>
            <div className={styles.odds}>{s.odds.toFixed(2)}</div>
            <div className={styles.ev}>{s.ev}</div>
            <div className={styles.stake}>{s.stake}</div>
            <div className={styles.status}>{s.status}</div>
            <div className={styles.result}>{s.result ?? "–"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}