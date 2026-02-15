import React from 'react';
import SectionContainer from './SectionContainer';

type Card = {
  title: string;
  kpis: string[];
  status?: string;
};

const cards: Card[] = [
  { title: 'Agente IA · Poisson-XG', kpis: ['WR 58%', 'EV+ 3.2%', 'CLV +1.8%'], status: 'PRE' },
  { title: 'Tipster · Fútbol Europa', kpis: ['WR 61%', 'EV+ 2.9%', 'CLV +1.2%'], status: 'LIVE' },
  { title: 'Trader Master · Basket', kpis: ['WR 55%', 'EV+ 2.1%', 'CLV +0.9%'], status: 'PRE' },
];

export default function Showcase() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Showcase</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Agentes IA, Tipsters y Trader Master con métricas clave.</p>
      </div>
      <div className="showcase-grid">
        {cards.map((c) => (
          <div className="showcase-card" key={c.title}>
            <div className="showcase-card-header">
              <div className="badge small">{c.status}</div>
              <h3>{c.title}</h3>
            </div>
            <div className="showcase-kpis">
              {c.kpis.map((k) => (
                <div className="kpi" key={k}>{k}</div>
              ))}
            </div>
            <div className="showcase-actions">
              <a className="btn btn-outline" href="/login">Ver señales</a> {/* redirige a dashboard tras login; /agents removido */}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}