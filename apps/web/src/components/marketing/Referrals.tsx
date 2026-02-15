import React from 'react';
import SectionContainer from './SectionContainer';

export default function Referrals() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Invita a tus amigos</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Comparte tu enlace con novatos o expertos en apuestas deportivas para que se unan. Genera beneficios por cada amigo que se suscribe.
        </p>
      </div>
      <div className="referrals-grid">
        <div className="referrals-left">
          <ul className="referrals-list">
            <li>
              <strong>Enlace único de referidos:</strong> genera tu link personal y compártelo por redes o mensajería, sin límite de invitaciones.
            </li>
            <li>
              <strong>Beneficios acumulables:</strong> suma descuentos o comisiones según el plan de cada referido.
            </li>
            <li>
              <strong>Transparencia total:</strong> consulta altas, estado y beneficios generados en tiempo real.
            </li>
            <li>
              <strong>Crecimiento guiado:</strong> soporte y métricas para optimizar tus invitaciones.
            </li>
          </ul>
          <p className="referrals-note">Consejo: comparte tu enlace en WhatsApp, Instagram y Telegram; añade una breve nota personal para mejorar la tasa de suscripción.</p>
          <div className="referrals-actions">
            <a className="btn btn-primary" href="/signup">Obtén tu enlace</a>
            <a className="btn btn-outline" href="/pricing">Ver planes</a>
          </div>
        </div>
        <div className="referrals-visual">
          <img src="/brand/referral_binary_final.svg" alt="Programa de referidos" className="referrals-image" />
        </div>
      </div>
    </SectionContainer>
  );
}