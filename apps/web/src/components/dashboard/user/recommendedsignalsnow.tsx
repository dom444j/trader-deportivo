"use client";
import React, { useMemo, useState } from "react";
import styles from "./RecommendedSignalsNow.module.css";

export interface RecommendedSignal {
  id: string;
  sport: string;
  icon: string;
  league: string;
  pick: string;
  odds: number;
  ev: number; // porcentaje
  status: "LIVE" | "PRE" | "EV+";
  match: string;
}

function Tabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ["Todas", "PRE", "LIVE", "Mis Ligas"];
  return (
    <div className={styles.tabs}>
      {tabs.map((t) => (
        <button
          key={t}
          className={`${styles.tab} ${value === t ? styles.active : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function RecommendedSignalsNow({ signals }: { signals: RecommendedSignal[] }) {
  const [tab, setTab] = useState("Todas");

  const filtered = useMemo(() => {
    if (tab === "Todas") return signals;
    if (tab === "Mis Ligas") return signals.filter((s) => /LaLiga|Premier|Bundes/i.test(s.league));
    return signals.filter((s) => (tab === "PRE" ? s.status === "PRE" : s.status === "LIVE"));
  }, [signals, tab]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Señales Recomendadas Ahora</h2>
        <a className={styles.viewAll} href="/signals">Ver todos →</a>
      </div>

      <Tabs value={tab} onChange={setTab} />

      <div className={styles.body}>
        <div className={styles.grid}>
          {filtered.map((s) => (
            <article key={s.id} className={styles.card} aria-label={`${s.match} ${s.pick}`}>
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${s.status === "LIVE" ? styles.badgeLive : s.status === "PRE" ? styles.badgePre : styles.badgeEv}`}>{s.status}</span>
                <span className={`${styles.badge} ${styles.badgeEv}`}>{Math.round(s.ev)}% EV+</span>
              </div>

              <div className={styles.titleMatch}>{s.match}</div>
              <div className={styles.subtitle}>{s.pick}</div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>Min. Odds</div>
                  <div className={styles.metricValue}>{(s.odds * 0.88).toFixed(2)}</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>Actual</div>
                  <div className={styles.metricValue}>{s.odds.toFixed(2)}</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>EV</div>
                  <div className={`${styles.metricValue} ${styles.metricEv}`}>{s.ev.toFixed(1)}%</div>
                </div>
              </div>

              <button className={styles.cta}>{s.status === "LIVE" ? "ACTUAR AHORA" : s.status === "PRE" ? "VER DETALLES" : "ANALIZAR"}</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}