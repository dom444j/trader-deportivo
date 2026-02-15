import React from 'react';
import SectionContainer from './SectionContainer';

export default function ValueProps() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 36, margin: 0 }}>¿Por qué Trader Deportivo?</h2>
        <p style={{ color: 'var(--text-secondary)' }}>IA calibrada, gestión de riesgo profesional y copy-trade inteligente.</p>
      </div>
      <div className="uvps">
        <div className="uvp-card">
          <div className="uvp-icon" aria-hidden>
            {/* Icon Pro: target (SVG) */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#2A2A4A" strokeWidth="2"/>
              <circle cx="12" cy="12" r="6" stroke="#00F5FF" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="#00FF94"/>
            </svg>
          </div>
          <div className="uvp-title">IA Calibrada + Expertos Verificados</div>
          <div className="uvp-desc">Señales con EV positivo validadas por modelos Poisson, Elo y XGBoost. Track record transparente con Brier y CLV.</div>
        </div>
        <div className="uvp-card">
          <div className="uvp-icon" aria-hidden>
            {/* Icon Pro: shield (SVG) */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" fill="rgba(0,245,255,0.15)" stroke="#00F5FF" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="uvp-title">Protección Automática de Bankroll</div>
          <div className="uvp-desc">Kelly Criterion, límites configurables, alertas de disciplina y prevención de tilt con IA.</div>
        </div>
        <div className="uvp-card">
          <div className="uvp-icon" aria-hidden>
            {/* Icon Pro: chart (SVG) */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="10" width="3" height="8" fill="#00F5FF"/>
              <rect x="10" y="6" width="3" height="12" fill="#00FF94"/>
              <rect x="16" y="12" width="3" height="6" fill="#FFD700"/>
            </svg>
          </div>
          <div className="uvp-title">Copy-Trade con Control Total</div>
          <div className="uvp-desc">Sigue a los mejores agentes con ajuste automático de stake y detección de correlaciones.</div>
        </div>
      </div>
    </SectionContainer>
  );
}