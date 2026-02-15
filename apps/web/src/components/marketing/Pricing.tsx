'use client';
import React from 'react';
import SectionContainer from './SectionContainer';

const plans = [
  { name: 'Básica', priceMonthly: 29.99, features: ['Señales IA calibradas', 'Panel básico', 'Copy-trade (observación)', 'Gestión Pro Bank', 'Referidos'] },
  { name: 'Pro', priceMonthly: 129.99, popular: true, features: ['Señales IA + Tipsters verificados', 'Gestión de riesgo avanzada', 'Copy-trade (semi-auto)', 'Incluye $25 en créditos'] },
  { name: 'Premium', priceMonthly: 799.99, features: ['Todo Pro', 'Latencia Edge <50ms', 'Copy-trade (auto)', 'Incluye $250 en créditos'] },
];

const formatUSD = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
const DISCOUNT_ANNUAL = 0.20;
const formatESNumber = (v: number) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
const formatMoneyParts = (v: number) => {
  const es = formatESNumber(v); // p.ej. "799,99"
  const [intRaw, dec] = es.split(',');
  const int = intRaw; // ya incluye separadores de miles en estilo es-ES
  return { symbol: '$', int, dec };
};

export default function Pricing() {
  const [annual, setAnnual] = React.useState(false);
  const minMonthly = Math.min(...plans.map((p) => p.priceMonthly));
  const minValue = annual ? +(minMonthly * (1 - DISCOUNT_ANNUAL)).toFixed(2) : minMonthly;
  return (
    <SectionContainer>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, margin: 0 }}>Precios</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Desde {formatUSD(minValue)} <span style={{ color: 'var(--text-secondary)' }}>/mes</span>. Prueba gratis y cancela cuando quieras.</p>
      </div>

      <div className="billing-toggle" role="tablist" aria-label="Periodo de facturación">
        <button className={`toggle-btn${!annual ? ' active' : ''}`} role="tab" aria-selected={!annual} onClick={() => setAnnual(false)}>Mensual</button>
        <button className={`toggle-btn${annual ? ' active' : ''}`} role="tab" aria-selected={annual} onClick={() => setAnnual(true)}>Anual -20%</button>
      </div>

      <div className="pricing-grid">
        {plans.map((p) => (
          <div className={`pricing-card${p.popular ? ' popular' : ''}`} key={p.name}>
            {p.popular && <div className="badge">Más popular</div>}
            <h3>{p.name}</h3>
            {(() => {
              const value = annual ? +(p.priceMonthly * (1 - DISCOUNT_ANNUAL)).toFixed(2) : p.priceMonthly;
              const parts = formatMoneyParts(value);
              return (
                <div className="price">
                  <span className="currency">{parts.symbol}</span>
                  <span className="amount">{parts.int}</span>
                  <span className="decimals">.{parts.dec}</span>
                  <span className="price-period">/mes</span>
                </div>
              );
            })()}
            {annual && (() => {
              const discountedMonthly = +(p.priceMonthly * (1 - DISCOUNT_ANNUAL)).toFixed(2);
              const annualTotal = +(discountedMonthly * 12).toFixed(2);
              const annualSavings = +(p.priceMonthly * 12 - annualTotal).toFixed(2);
              return (
                <div className="price-meta">
                  <span className="price-strike">${formatESNumber(p.priceMonthly)}</span>
                  <span className="save-chip">Ahorro ${formatESNumber(annualSavings)} al año</span>
                  <span className="price-sub">Facturado ${formatESNumber(annualTotal)} al año</span>
                  {p.name === 'Pro' && <span className="credit-chip">+ $25 en créditos</span>}
                  {p.name === 'Premium' && <span className="credit-chip">+ $250 en créditos</span>}
                </div>
              );
            })()}
            {!annual && (
              <div className="price-meta">
                {p.name === 'Pro' && <span className="credit-chip">+ $25 en créditos</span>}
                {p.name === 'Premium' && <span className="credit-chip">+ $250 en créditos</span>}
              </div>
            )}
            <ul className="features">
              {p.features.map((f) => (<li key={f}>{f}</li>))}
            </ul>
            <div className="pricing-actions">
              <a className="btn btn-primary" href="/signup">Empieza gratis 7 días</a>
              <a className="btn btn-outline" href="/pricing">Ver detalles</a>
            </div>
          </div>
        ))}
      </div>

      <div className="trust-row">
        <span className="trust-chip">Cancel anytime</span>
        <span className="trust-chip">Secure payments</span>
        <span className="trust-chip">Edge-ready</span>
        <span className="trust-chip">Sin tarjeta en prueba</span>
      </div>
    </SectionContainer>
  );
}