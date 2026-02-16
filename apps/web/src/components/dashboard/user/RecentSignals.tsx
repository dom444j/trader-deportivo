"use client";
import React from "react";
import styles from "@/app/(dashboard)/user/UserDashboard.module.css";
import rsStyles from "./RecentSignals.module.css";

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
    <section className={`${styles.card} ${rsStyles.section}`}>
      <div className={styles.cardHeader}>
        <h2>Señales Recientes</h2>
        <a href="/signals" className={styles.cardLink}>Ver todas →</a>
      </div>
      <div className={styles.cardBody}>
        <div className={rsStyles.thead}>
          <div>Agente</div>
          <div>Mercado</div>
          <div>Cuota</div>
          <div>EV</div>
          <div>Stake</div>
          <div>Estado</div>
          <div>Resultado</div>
        </div>
        {signals.map((s) => (
          <div className={rsStyles.row} key={s.id}>
            <div className={rsStyles.agent}>{s.agent}</div>
            <div className={rsStyles.market}>{s.market}</div>
            <div className={rsStyles.odds}>{s.odds.toFixed(2)}</div>
            <div className={rsStyles.ev}>{s.ev}</div>
            <div className={rsStyles.stake}>{s.stake}</div>
            <div className={rsStyles.status}>{s.status}</div>
            <div className={rsStyles.result}>{s.result ?? "–"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}