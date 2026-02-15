import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de Administración · Trader Deportivo',
  description: 'Panel administrativo - Gestiona usuarios, tipsters, señales y configuración del sistema.',
};

export default function AdminDashboard() {
  return (
    <div className="app-role--admin">
      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="app-page-title">Panel de Administración</h1>
          <p className="dashboard-subtitle">Gestión completa de la plataforma Trader Deportivo</p>
        </header>

        <section className="dashboard-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3 className="stat-value">2,847</h3>
                <p className="stat-label">Usuarios Totales</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-value">156</h3>
                <p className="stat-label">Tipsters Activos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-value">12,543</h3>
                <p className="stat-label">Señales Enviadas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-value">€45,230</h3>
                <p className="stat-label">Ingresos Mensuales</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-alerts">
          <div className="alerts-grid">
            <div className="alert-card pending">
              <div className="alert-icon">⏳</div>
              <div className="alert-content">
                <h3 className="alert-title">Tipsters por Aprobar</h3>
                <p className="alert-value">12</p>
                <a href="/admin/tipsters/pending" className="alert-link">Revisar</a>
              </div>
            </div>
            <div className="alert-card review">
              <div className="alert-icon">🔍</div>
              <div className="alert-content">
                <h3 className="alert-title">Señales en Revisión</h3>
                <p className="alert-value">8</p>
                <a href="/admin/signals/review" className="alert-link">Ver</a>
              </div>
            </div>
            <div className="alert-card support">
              <div className="alert-icon">🎫</div>
              <div className="alert-content">
                <h3 className="alert-title">Tickets sin Asignar</h3>
                <p className="alert-value">24</p>
                <a href="/admin/support/tickets" className="alert-link">Asignar</a>
              </div>
            </div>
            <div className="alert-card payment">
              <div className="alert-icon">💳</div>
              <div className="alert-content">
                <h3 className="alert-title">Pagos por Verificar</h3>
                <p className="alert-value">6</p>
                <a href="/admin/payments/pending" className="alert-link">Procesar</a>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-content">
          <div className="content-grid">
            <div className="content-card">
              <div className="card-header">
                <h2>Actividad Reciente</h2>
                <a href="/admin/activity" className="card-link">Ver todo</a>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon user">👤</div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Nuevo usuario registrado:</strong> Juan García
                      </div>
                      <div className="activity-time">Hace 5 minutos</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon tipster">⭐</div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Nueva señal de tipster:</strong> Carlos Trading - Real Madrid vs Barcelona
                      </div>
                      <div className="activity-time">Hace 15 minutos</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon payment">💰</div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Pago procesado:</strong> Suscripción Premium - €29.99
                      </div>
                      <div className="activity-time">Hace 30 minutos</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon system">⚙️</div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Actualización del sistema:</strong> Nueva versión desplegada
                      </div>
                      <div className="activity-time">Hace 1 hora</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Top Tipsters</h2>
                <a href="/admin/tipsters" className="card-link">Ver todos</a>
              </div>
              <div className="card-body">
                <div className="tipsters-list">
                  <div className="tipster-item">
                    <div className="tipster-rank">#1</div>
                    <div className="tipster-info">
                      <h4>Carlos Trading</h4>
                      <p>ROI: +45.2% | 342 suscriptores</p>
                    </div>
                    <div className="tipster-status active">Activo</div>
                  </div>
                  <div className="tipster-item">
                    <div className="tipster-rank">#2</div>
                    <div className="tipster-info">
                      <h4>Ana Deportes</h4>
                      <p>ROI: +38.7% | 289 suscriptores</p>
                    </div>
                    <div className="tipster-status active">Activo</div>
                  </div>
                  <div className="tipster-item">
                    <div className="tipster-rank">#3</div>
                    <div className="tipster-info">
                      <h4>Luis Analytics</h4>
                      <p>ROI: +32.1% | 198 suscriptores</p>
                    </div>
                    <div className="tipster-status active">Activo</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Análisis de Rendimiento</h2>
              </div>
              <div className="card-body">
                <div className="performance-overview">
                  <div className="metric-row">
                    <div className="metric">
                      <div className="metric-label">Usuarios Nuevos (Mes)</div>
                      <div className="metric-value">+347</div>
                      <div className="metric-change positive">+12.3%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Tasa de Retención</div>
                      <div className="metric-value">78.5%</div>
                      <div className="metric-change positive">+2.1%</div>
                    </div>
                  </div>
                  <div className="metric-row">
                    <div className="metric">
                      <div className="metric-label">Ingresos (Mes)</div>
                      <div className="metric-value">€45,230</div>
                      <div className="metric-change positive">+8.7%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Señales/Día</div>
                      <div className="metric-value">156</div>
                      <div className="metric-change positive">+15.2%</div>
                    </div>
                  </div>
                </div>
                <div className="performance-chart">
                  <div className="chart-placeholder">
                    <p>Gráfico de tendencias mensuales</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Acciones Rápidas</h2>
              </div>
              <div className="card-body">
                <div className="quick-actions">
                  <a href="/admin/users" className="quick-action-btn">
                    <span className="btn-icon">👤</span>
                    <span className="btn-text">Gestionar Usuarios</span>
                  </a>
                  <button className="quick-action-btn">
                    <span className="btn-icon">⭐</span>
                    <span className="btn-text">Aprobar Tipster</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="btn-icon">📢</span>
                    <span className="btn-text">Enviar Notificación</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="btn-icon">📊</span>
                    <span className="btn-text">Generar Reporte</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="btn-icon">⚙️</span>
                    <span className="btn-text">Configuración</span>
                  </button>
                  <button className="quick-action-btn">
                    <span className="btn-icon">🎫</span>
                    <span className="btn-text">Ver Tickets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}