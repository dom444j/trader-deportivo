import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="container hero-content">
        <div className="pre-headline">Trader Deportivo: plataforma profesional de trading deportivo</div>
        <h1 className="hero-title">Señales EV+ verificadas por IA + expertos humanos</h1>
        <p className="hero-sub">
          Gestión profesional de bankroll, señales calibradas y copy-trade con protección automática de riesgo.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/signup">Empieza gratis</Link>
          <Link className="btn btn-outline" href="/pricing">Ver planes</Link>
        </div>

        <div className="trust-badges" aria-label="Trust Badges">
          <div className="badge"><span className="dot" /> Regulado Latam</div>
          <div className="badge"><span className="dot" /> 1,200+ traders activos</div>
          <div className="badge"><span className="dot" /> Juego Responsable</div>
          <div className="badge"><span className="dot" /> Pagos USDT/BTC</div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <img src="/trading_deportivo_v2_horizontal.svg" alt="Logo Trader Deportivo" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>
    </section>
  );
}