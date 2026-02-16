import React from 'react';
import SectionContainer from './SectionContainer';

export default function HowItWorks() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Cómo funciona</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Tres pasos sencillos para empezar con control de riesgo profesional.</p>
      </div>
      <ol className="how-steps">
        <li className="how-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Elige tu licencia</h3>
            <p>Básico €29,99 · Pro €129,99 (+€25 créditos) · Premium €799,99 (+€250 créditos). Cambia o cancela cuando quieras.</p>
          </div>
        </li>
        <li className="how-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Sigue agentes IA o tipsters</h3>
            <p>Track record verificado con métricas EV+, CLV, Brier Score y calibración para decisiones consistentes.</p>
          </div>
        </li>
        <li className="how-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Opera con protección</h3>
            <p>Observación · Semi-auto · Auto con límites Kelly, gestión Pro Bank y alertas preventivas.</p>
          </div>
        </li>
      </ol>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a className="btn btn-primary" href="/login">Ver en acción</a> {/* redirige a dashboard tras login; /agents removido */}
      </div>
    </SectionContainer>
  );
}