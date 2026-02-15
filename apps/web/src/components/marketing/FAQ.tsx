import React from 'react';
import SectionContainer from './SectionContainer';

const faqs = [
  { q: '¿Qué es Trader Deportivo?', a: 'Una plataforma que ofrece herramientas tecnológicas para apostadores deportivos; convertimos las apuestas en una profesión informada mediante análisis, gestión del riesgo y educación.' },
  { q: '¿Qué no es Trader Deportivo?', a: 'No somos casa de apuestas: no aceptamos depósitos ni tomamos apuestas. Somos tecnología y formación para decidir mejor.' },
  { q: '¿Cómo verifican a los tipsters?', a: 'Track record transparente, métricas (EV+, CLV, Brier) y verificación manual.' },
  { q: '¿Qué licencias ofrecen?', a: 'Básica, Pro y Premium, con upgrade/downgrade libre.' },
  { q: '¿Cómo se gestiona el riesgo?', a: 'Kelly Criterion, límites por perfil, alertas tempranas y opciones de autoexclusión.' },
  { q: '¿Cómo funcionan los créditos?', a: 'Compra de créditos para servicios premium; consulta términos en /credits.' },
  { q: '¿Cómo pagan y qué KYC requieren?', a: 'Pagos USDT/BTC por licencias/servicios; KYC según políticas de compliance.' },
];

export default function FAQ() {
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Preguntas frecuentes</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Qué somos (y qué no), y respuestas rápidas a dudas comunes.</p>
      </div>
      <div className="faq">
        {faqs.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </SectionContainer>
  );
}