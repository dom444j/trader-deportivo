import React from 'react';
import SectionContainer from './SectionContainer';

export default function Footer() {
  return (
    <footer className="site-footer">
      <SectionContainer>
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>Trader Deportivo</strong>
            <span className="footer-copy">© 2026 · Todos los derechos reservados.</span>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#pricing">Precios</a>
            <a href="#risk">Juego responsable</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </SectionContainer>
    </footer>
  );
}