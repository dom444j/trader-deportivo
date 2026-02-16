import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import styles from './UserDashboard.module.css';
import ExecutiveHeader from '@/components/dashboard/user/ExecutiveHeader';
import TopStatsGrid from '@/components/dashboard/user/TopStatsGrid';
import BankPlanContributions from '@/components/dashboard/user/BankPlanContributions';
import PerformanceOverview from '@/components/dashboard/user/PerformanceOverview';
import RecommendedSignalsNow from '@/components/dashboard/user/RecommendedSignalsNow';
import RecentSignals from '@/components/dashboard/user/RecentSignals';
import { SectionCard } from '@/components/ui-kit/SectionCard';

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

// Eliminar fetch de señales si ya no se usa
async function getActiveSignals() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/signals/active`, { cache: 'no-store' });
  const json = await res.json();
  return json.data as Array<{ 
    id: string; 
    sport: string; 
    icon: string; 
    league: string; 
    pick: string; 
    odds: number;
    ev: number;
    status: 'LIVE' | 'PRE' | 'EV+';
  }>;
}

async function getUpcomingEvents() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/events/upcoming`, { cache: 'no-store' });
  const json = await res.json();
  return json.data as Array<{ 
    id: string; 
    timeLabel: string; 
    match: string; 
    sport: string; 
    icon: string;
  }>;
}

export default async function UserDashboard() {
  const [kpis, /* signals */, events] = await Promise.all([
    getKpis(),
    getActiveSignals(),
    getUpcomingEvents(),
  ]);

  return (
    <div className={`app-role--user ${styles.page}`}>
      <main className="main-content">
        {/* Header con título */}
        <header className={styles.header}>
          <h1 className={styles.title}>Mi Dashboard</h1>
          <p className={styles.subtitle}>Bienvenido a tu panel de control personal</p>
        </header>

        {/* Executive Header - KPIs Principales */}
        <ExecutiveHeader kpis={kpis} />

        {/* Top Stats Grid - Cards de métricas */}
        <TopStatsGrid kpis={kpis} />

        {/* Banner de Próximo pago semanal movido a TopStatsGrid */}

        {/* Banner: Aportes al Bank por Plan */}
        <BankPlanContributions />

        {/* Performance Overview – Debajo del banner con el mismo ancho */}
        <PerformanceOverview />

        {/* Señales Recomendadas Ahora */}
        <RecommendedSignalsNow signals={[
          { id: '1', sport: 'Fútbol', icon: '⚽', league: 'LaLiga', pick: 'Over 2.5 Goles', odds: 2.10, ev: 13.5, status: 'LIVE', match: 'Real Madrid vs Barcelona' },
          { id: '2', sport: 'Fútbol', icon: '⚽', league: 'Premier League', pick: 'BTTS - Sí', odds: 1.95, ev: 18.2, status: 'PRE', match: 'Manchester City vs Liverpool' },
          { id: '3', sport: 'Fútbol', icon: '⚽', league: 'Bundesliga', pick: 'Bayern -1 Handicap', odds: 2.05, ev: 20.6, status: 'EV+', match: 'Bayern vs Dortmund' },
        ]} />

        {/* Señales Recientes */}
        <RecentSignals signals={[
          { id: 'r1', agent: 'Agent-EPL-01', market: 'Over 2.5', odds: 2.10, ev: '+5.2%', stake: '$25.00', status: 'ACTIVA', result: '–' },
          { id: 'r2', agent: 'Tipster-PRO-05', market: 'BTTS Yes', odds: 1.85, ev: '+3.8%', stake: '$30.00', status: 'PENDIENTE', result: '–' },
          { id: 'r3', agent: 'Agent-LaLiga-03', market: '1X2 Home', odds: 2.45, ev: '+7.1%', stake: '$20.00', status: 'CERRADA', result: '+$29.00' },
        ]} />
        {/* Sección de contenido principal */}
        <section className={styles.afterSignalsSection}>
          <div className={styles.twoColumnWrap}>
<div className={styles.twoColumnWrap}>
              {/* Mis Tipsters Favoritos */}
              <SectionCard title="Mis Tipsters Favoritos" link={{ href: "/tipsters", text: "Explorar" }}>
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
              </SectionCard>
            </div>

            <div className={styles.column}>
              {/* Próximos Eventos */}
              <SectionCard title="Próximos Eventos">
                <div className={styles.eventList}>
                  {events.map((evt) => (
                    <div key={evt.id} className={styles.eventItem}>
                      <div className={styles.eventTime}>{evt.timeLabel}</div>
                      <div className={styles.eventMatch}>{evt.match}</div>
                      <div className={styles.eventSport}>{evt.icon} {evt.sport}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Progreso del Usuario */}
          <SectionCard title="Progreso del Usuario">
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
          </SectionCard>
        </section>
      </main>
    </div>
  );
}