import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import styles from './UserDashboard.module.css';
import ExecutiveHeader from '@/components/dashboard/user/ExecutiveHeader';
import TopStatsGrid from '@/components/dashboard/user/TopStatsGrid';

export const metadata: Metadata = {
  title: 'Dashboard Usuario · Trader Deportivo',
  description: 'Panel de usuario - Gestiona tu perfil, sigue tipsters y accede a señales de trading deportivo.',
};

async function getKpis() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/user/dashboard/kpis`, { cache: 'no-store' });
  const json = await res.json();
  return json.data;
}

async function getActiveSignals() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/signals/active`, { cache: 'no-store' });
  const json = await res.json();
  return json.data as Array<{ id: string; sport: string; icon: string; league: string; pick: string; odds: number }>;
}

async function getUpcomingEvents() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/events/upcoming`, { cache: 'no-store' });
  const json = await res.json();
  return json.data as Array<{ id: string; timeLabel: string; match: string; sport: string; icon: string }>;
}

export default async function UserDashboard() {
  const [kpis, signals, events] = await Promise.all([
    getKpis(),
    getActiveSignals(),
    getUpcomingEvents(),
  ]);
  return (
    <div className={`app-role--user ${styles.page}`}>
      <main className="main-content">
        <header className={styles.header}>
          <h1 className={styles.title}>Mi Dashboard</h1>
          <p className={styles.subtitle}>Bienvenido a tu panel de control personal</p>
        </header>

        <ExecutiveHeader kpis={kpis} />
        <TopStatsGrid kpis={kpis} />

        <section>
          <div className={styles.contentGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Señales Activas</h2>
                <a href="/signals" className={styles.cardLink}>Ver todas</a>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.signalList}>
                  {signals.map(sig => (
                    <div key={sig.id} className={styles.signalItem}>
                      <div className={styles.signalInfo}>
                        <span className={styles.signalSport}>{sig.icon} {sig.sport}</span>
                        <span className={styles.signalLeague}>{sig.league}</span>
                      </div>
                      <div className={styles.signalPick}>
                        {sig.pick} <span className={styles.chip}>Activa</span>
                      </div>
                      <div className={styles.signalOdds}>@ {sig.odds.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Mis Tipsters Favoritos</h2>
                <a href="/tipsters" className={styles.cardLink}>Explorar</a>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.tipsterList}>
                  <div className={styles.tipsterItem}>
                    <div className={styles.tipsterAvatar}>👤</div>
                    <div className={styles.tipsterInfo}>
                      <h4>Carlos Trading</h4>
                      <p>ROI: +35.2% | 156 señales</p>
                    </div>
                    <button className={`${styles.followBtn} ${styles.following}`}>Siguiendo</button>
                  </div>
                  <div className={styles.tipsterItem}>
                    <div className={styles.tipsterAvatar}>👤</div>
                    <div className={styles.tipsterInfo}>
                      <h4>Ana Deportes</h4>
                      <p>ROI: +28.7% | 89 señales</p>
                    </div>
                    <button className={`${styles.followBtn} ${styles.following}`}>Siguiendo</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Análisis de Rendimiento</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.performanceChart}>
                  <div>
                    <p>Gráfico de rendimiento mensual</p>
                  </div>
                </div>
                <div className={styles.performanceSummary}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Este Mes:</span>
                    <span className={`${styles.summaryValue} ${styles.positive}`}>+€245</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total:</span>
                    <span className={`${styles.summaryValue} ${styles.positive}`}>+€1,240</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Progreso del Usuario</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Entradas diarias</span>
                  <span className={styles.summaryValue}>3/5</span>
                </div>
                <div className={styles.progressBar} aria-label="Progreso diario">
                  <div className={styles.progressFill} style={{ width: '60%' }} />
                </div>

                <div className={styles.summaryItem} style={{ marginTop: 12 }}>
                  <span className={styles.summaryLabel}>Entradas semanales</span>
                  <span className={styles.summaryValue}>12/20</span>
                </div>
                <div className={styles.progressBar} aria-label="Progreso semanal">
                  <div className={styles.progressFill} style={{ width: '60%' }} />
                </div>

                <div className={styles.summaryItem} style={{ marginTop: 12 }}>
                  <span className={styles.summaryLabel}>Disciplina</span>
                  <span className={`${styles.summaryValue} ${styles.chip}`}>{kpis.discipline}</span>
                </div>
                <div className={styles.progressBar} aria-label="Disciplina">
                  <div className={styles.progressFill} style={{ width: `${kpis.discipline}%` }} />
                </div>

                <div className={styles.summaryItem} style={{ marginTop: 12 }}>
                  <span className={styles.summaryLabel}>Configurar bankroll</span>
                  <span className={`${styles.summaryValue} ${styles.chip}`}>Pendiente</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Seguir 1 agente</span>
                  <span className={`${styles.summaryValue} ${styles.chip}`}>En curso</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Primera operación</span>
                  <span className={`${styles.summaryValue} ${styles.chipPositive}`}>Hecho</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Primera semana completa</span>
                  <span className={`${styles.summaryValue} ${styles.chip}`}>Pendiente</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Próximos Eventos</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.eventList}>
                  {events.map(evt => (
                    <div key={evt.id} className={styles.eventItem}>
                      <div className={styles.eventTime}>{evt.timeLabel}</div>
                      <div className={styles.eventMatch}>{evt.match}</div>
                      <div className={styles.eventSport}>{evt.icon} {evt.sport}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}