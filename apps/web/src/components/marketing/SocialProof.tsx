import React from 'react';
import SectionContainer from './SectionContainer';

export default function SocialProof() {
  return (
    <SectionContainer>
      <div className="social-grid">
        <div className="social-left">
          <h2 style={{ fontSize: 32, marginTop: 0 }}>Testimonios</h2>
          <div className="testimonial">
            <p>“Me ayudó a tener disciplina y mejorar el EV de mis apuestas. El copy-trade con límites me da tranquilidad.”</p>
            <div className="author">— Luis R., Trader</div>
          </div>
          <div className="testimonial">
            <p>“Como tipster, tener métricas transparentes y latencia baja me permite escalar con confianza.”</p>
            <div className="author">— Ana V., Tipster</div>
          </div>
        </div>
        <div className="social-right">
          <div className="metrics">
            <div className="metric"><div className="metric-number">1,200+</div><div className="metric-label">traders activos</div></div>
            <div className="metric"><div className="metric-number">90%+</div><div className="metric-label">Lighthouse</div></div>
            <div className="metric"><div className="metric-number">&lt;50ms</div><div className="metric-label">latencia (Edge)</div></div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}