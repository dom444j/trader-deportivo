"use client";
import React, { useEffect, useMemo, useState } from "react";
import base from "../../../app/(dashboard)/user/UserDashboard.module.css";
import { getProgressSummary } from "@/lib/user-dashboard-data";

// Pequeño gráfico SVG sin dependencias
function MiniLineChart({ values }: { values: number[] }) {
  const path = useMemo(() => {
    if (!values || values.length === 0) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    });
    return points.join(" ");
  }, [values]);

  const area = useMemo(() => {
    if (!values || values.length === 0) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const top = values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * 100;
        const y = 100 - ((v - min) / range) * 100;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
    return `${top} L 100 100 L 0 100 Z`;
  }, [values]);

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Evolución del rendimiento">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary-cyan)" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,245,255,0.35)" />
          <stop offset="100%" stopColor="rgba(0,245,255,0)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      {area && <path d={area} fill="url(#fillGrad)" opacity={0.18} />}
      {path && (
        <path
          d={path}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={1.6}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function PerformanceOverview() {
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    getProgressSummary().then((res) => {
      if (!cancelled) {
        setValues(res.monthly.map((m) => m.pnl));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={`${base.card} ${base.performanceCard}`}>
      <div className={base.cardHeader}>
        <h2>Rendimiento</h2>
        <div className={base.rangeTabs}>
          <button className={base.rangeBtn}>7D</button>
          <button className={`${base.rangeBtn} ${base.rangeActive}`}>30D</button>
          <button className={base.rangeBtn}>90D</button>
        </div>
      </div>

      <div className={base.cardBody}>
        <div className={base.performanceChart}>
          {values.length > 0 ? <MiniLineChart values={values} /> : "[Gráfico]"}
        </div>

        <div className={base.performanceSummary}>
          <div className={base.summaryItem}>
            <span className={base.summaryLabel}>ROI</span>
            <span className={`${base.summaryValue} ${base.positive}`}>+12.4%</span>
          </div>
          <div className={base.summaryItem}>
            <span className={base.summaryLabel}>Win Rate</span>
            <span className={base.summaryValue}>58.3%</span>
          </div>
          <div className={base.summaryItem}>
            <span className={base.summaryLabel}>Señales</span>
            <span className={base.summaryValue}>47</span>
          </div>
        </div>
      </div>
    </section>
  );
}