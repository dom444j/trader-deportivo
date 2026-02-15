import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Tipster · Trader Deportivo',
  description: 'Panel de tipster - Gestiona tus picks, analiza tu rendimiento y conecta con tus seguidores.',
};

export default function TipsterDashboard() {
  return (
    <div className="app-role--tipster">
      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="app-page-title">Panel de Tipster</h1>
          <p className="dashboard-subtitle">Gestiona tus señales y conecta con tu audiencia</p>
        </header>

        <section className="dashboard-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3 className="stat-value">156</h3>
                <p className="stat-label">Picks Enviados</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-value">342</h3>
                <p className="stat-label">Suscriptores</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-value">+35.2%</h3>
                <p className="stat-label">ROI Total</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-value">72%</h3>
                <p className="stat-label">Win Rate</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-actions">
          <div className="actions-grid">
            <button className="action-btn primary">
              <span className="btn-icon">➕</span>
              Crear Nuevo Pick
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📊</span>
              Ver Estadísticas
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">💬</span>
              Chat con Seguidores
            </button>
          </div>
        </section>

        <section className="dashboard-content">
          <div className="content-grid">
            <div className="content-card">
              <div className="card-header">
                <h2>Mis Picks Recientes</h2>
                <a href="/picks" className="card-link">Ver todos</a>
              </div>
              <div className="card-body">
                <div className="picks-list">
                  <div className="pick-item win">
                    <div className="pick-status">✅</div>
                    <div className="pick-details">
                      <div className="pick-event">Real Madrid vs Barcelona</div>
                      <div className="pick-selection">Over 2.5 Goles @ 1.85</div>
                      <div className="pick-date">Hace 2 horas</div>
                    </div>
                    <div className="pick-result">+0.85</div>
                  </div>
                  <div className="pick-item loss">
                    <div className="pick-status">❌</div>
                    <div className="pick-details">
                      <div className="pick-event">Lakers vs Warriors</div>
                      <div className="pick-selection">Lakers -5.5 @ 1.90</div>
                      <div className="pick-date">Ayer</div>
                    </div>
                    <div className="pick-result">-1.00</div>
                  </div>
                  <div className="pick-item win">
                    <div className="pick-status">✅</div>
                    <div className="pick-details">
                      <div className="pick-event">Manchester City vs Liverpool</div>
                      <div className="pick-selection">BTTS @ 1.70</div>
                      <div className="pick-date">Hace 2 días</div>
                    </div>
                    <div className="pick-result">+0.70</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Mis Suscriptores</h2>
                <a href="/subscribers" className="card-link">Gestionar</a>
              </div>
              <div className="card-body">
                <div className="subscribers-stats">
                  <div className="stat-row">
                    <span className="stat-label">Plan Gratis:</span>
                    <span className="stat-value">245 usuarios</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Plan Premium:</span>
                    <span className="stat-value">97 usuarios</span>
                  </div>
                  <div className="stat-row total">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">342 suscriptores</span>
                  </div>
                </div>
                <div className="recent-subscribers">
                  <h4>Nuevos esta semana</h4>
                  <div className="subscriber-list">
                    <div className="subscriber-item">
                      <div className="subscriber-avatar">👤</div>
                      <div className="subscriber-info">
                        <span className="subscriber-name">Juan Pérez</span>
                        <span className="subscriber-plan">Plan Premium</span>
                      </div>
                    </div>
                    <div className="subscriber-item">
                      <div className="subscriber-avatar">👤</div>
                      <div className="subscriber-info">
                        <span className="subscriber-name">María García</span>
                        <span className="subscriber-plan">Plan Gratis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Análisis de Rendimiento</h2>
              </div>
              <div className="card-body">
                <div className="performance-metrics">
                  <div className="metric">
                    <div className="metric-label">Este Mes</div>
                    <div className="metric-value positive">+45.2 unidades</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Últimos 3 Meses</div>
                    <div className="metric-value positive">+128.7 unidades</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Total 2024</div>
                    <div className="metric-value positive">+312.4 unidades</div>
                  </div>
                </div>
                <div className="performance-chart">
                  <div className="chart-placeholder">
                    <p>Gráfico de rendimiento mensual</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Próximos Eventos</h2>
              </div>
              <div className="card-body">
                <div className="upcoming-events">
                  <div className="event-item">
                    <div className="event-time">Hoy 20:00</div>
                    <div className="event-league">La Liga</div>
                    <div className="event-match">Real Madrid vs Barcelona</div>
                    <div className="event-analysis-status">
                      <span className="status-badge pending">Análisis pendiente</span>
                    </div>
                  </div>
                  <div className="event-item">
                    <div className="event-time">Mañana 15:30</div>
                    <div className="event-league">Premier League</div>
                    <div className="event-match">Manchester City vs Liverpool</div>
                    <div className="event-analysis-status">
                      <span className="status-badge analyzing">En análisis</span>
                    </div>
                  </div>
                  <div className="event-item">
                    <div className="event-time">Mañana 18:00</div>
                    <div className="event-league">NBA</div>
                    <div className="event-match">Lakers vs Warriors</div>
                    <div className="event-analysis-status">
                      <span className="status-badge ready">Listo para pick</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}