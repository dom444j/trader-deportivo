import React from 'react';
import SectionContainer from './SectionContainer';

export default function RiskResponsible() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Riesgo & Juego Responsable</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Compromiso claro: límites configurables, autoexclusión y educación para un uso responsable.</p>
      </div>
      <div className="risk-grid">
        <div className="risk-card">
          <div className="risk-card-header">
            <span className="risk-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </span>
            <h3>Límites automáticos</h3>
          </div>
          <p>Configura límites diarios/semanales/mensuales con Kelly y activa stops automáticos ante señales de riesgo.</p>
        </div>
        <div className="risk-card">
          <div className="risk-card-header">
            <span className="risk-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <h3>Autoexclusión</h3>
          </div>
          <p>Herramientas para pausas y autoexclusión (24h/7d/30d) con periodo de reflexión para reactivación.</p>
        </div>
        <div className="risk-card">
          <div className="risk-card-header">
            <span className="risk-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12l7-7m0 0v4m0-4H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 12l-7 7m0 0v-4m0 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <h3>Alertas tempranas</h3>
          </div>
          <p>Detección de tilt y patrones de riesgo por IA con recomendaciones de pausa y protección del bankroll.</p>
        </div>
        <div className="risk-card">
          <div className="risk-card-header">
            <span className="risk-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <h3>Educación y soporte</h3>
          </div>
          <p>Guías de bankroll y juego responsable, centro educativo y soporte cuando lo necesites.</p>
        </div>
      </div>

      <div className="policy-row" aria-label="Responsible Gaming Policies">
        <span className="trust-chip">Mayores de 18 años</span>
        <span className="trust-chip">Autoexclusión disponible</span>
        <span className="trust-chip">Límites configurables</span>
        <span className="trust-chip">Detección de tilt por IA</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a className="btn btn-outline" href="/responsible-gaming">Ver políticas</a>
      </div>
    </SectionContainer>
  );
}