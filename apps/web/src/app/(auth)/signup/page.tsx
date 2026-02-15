'use client';
import React, { useState } from 'react';
import Navbar from '../../../components/marketing/Navbar';
import Link from 'next/link';

export default function Signup() {
  const [team, setTeam] = useState<'A' | 'B'>('A');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referral, setReferral] = useState('');
  const [telegram, setTelegram] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Integrar con API de registro
    console.log({ team, name, email, referral, telegram, placement: team === 'A' ? 'left' : 'right' });
    setTimeout(() => {
      setIsLoading(false);
      alert(`Registro enviado (Equipo ${team})`);
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <main className="modern-auth-shell">
        {/* Background elements */}
        <div className="grid-background"></div>
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>

        <div className="auth-container">
          <div className="auth-main">
            {/* Marca */}
            <Link href="/" className="auth-brand" aria-label="Ir a la página principal">
              <svg className="brand-logo" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="url(#brandGradient)"/>
                <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white" fillOpacity="0.9"/>
                <path d="M20 16L24 20L20 24L16 20L20 16Z" fill="white" fillOpacity="0.6"/>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#1D4ED8"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="brand-text">
                <div className="brand-name">Trader Deportivo</div>
                <div className="brand-tagline">Profesionales en Deportivas</div>
              </div>
            </Link>

            <div className="auth-content">
              <header className="modern-auth-header">
                <h1 className="auth-welcome">Crear cuenta</h1>
                <p className="auth-description only-desktop">Completa tus datos y elige tu ubicación en el árbol.</p>
                <p className="auth-description only-mobile">Completa tus datos para crear tu cuenta.</p>
              </header>

              {/* Selector de equipo con el mismo estilo que el selector de rol */}
              <div className="role-selector">
                <div className="role-label only-desktop">Elige tu equipo</div>
                <div className="role-label only-mobile">Tu equipo</div>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-btn ${team === 'A' ? 'active' : ''}`}
                    onClick={() => setTeam('A')}
                  >
                    <div className="role-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l4 4 12-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="role-info">
                      <div className="role-title only-desktop">Equipo A</div>
                      <div className="role-title only-mobile">A</div>
                      <div className="role-desc only-desktop">Configuración estándar</div>
                      <div className="role-desc only-mobile">Estándar</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${team === 'B' ? 'active' : ''}`}
                    onClick={() => setTeam('B')}
                  >
                    <div className="role-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div className="role-info">
                      <div className="role-title only-desktop">Equipo B</div>
                      <div className="role-title only-mobile">B</div>
                      <div className="role-desc only-desktop">Experiencia alternativa</div>
                      <div className="role-desc only-mobile">Alternativa</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Formulario moderno */}
              <form className="modern-auth-form" onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <div className="input-wrapper">
                    <div className="input-prefix">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <input 
                      id="name"
                      type="text"
                      className="modern-input"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <div className="input-prefix">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <input 
                      id="email"
                      type="email"
                      className="modern-input"
                      placeholder="tucorreo@dominio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="input-wrapper">
                    <div className="input-prefix">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <input 
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="modern-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-suffix" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="referral" className="form-label only-desktop">Código de referido (opcional)</label>
                  <label htmlFor="referral" className="form-label only-mobile">Código referido (opc.)</label>
                  <div className="input-wrapper">
                    <div className="input-prefix">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 12a5 5 0 005 5h2M20 12a5 5 0 00-5-5h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      id="referral"
                      type="text"
                      className="modern-input"
                      placeholder="Ej: TRADER-1234"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="telegram" className="form-label only-desktop">Telegram (opcional)</label>
                  <label htmlFor="telegram" className="form-label only-mobile">Telegram (opc.)</label>
                  <div className="input-wrapper">
                    <div className="input-prefix">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2l-6 20-5-9-9-5 20-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      id="telegram"
                      type="text"
                      className="modern-input"
                      placeholder="@tu_usuario"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                    />
                  </div>
                </div>

                <button className="login-btn" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="only-desktop">Creando cuenta...</span>
                      <span className="only-mobile">Creando...</span>
                    </>
                  ) : (
                    <>
                      <span className="only-desktop">Crear cuenta</span>
                      <span className="only-mobile">Crear</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-divider">
                <span className="divider-text">
                  <span className="only-desktop">¿Ya tienes cuenta?</span>
                  <span className="only-mobile">¿Cuenta?</span>
                </span>
              </div>
              <a href="/login" className="signup-link">
                <span className="only-desktop">Entrar</span>
                <span className="only-mobile">Entrar</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Aside con el mismo estilo que login */}
          <aside className="auth-aside">
            <div className="aside-content">
              <header className="aside-header">
                <div className="aside-kicker">Crecimiento guiado</div>
                <h3 className="aside-title">Configura tus límites y objetivos</h3>
                <p className="aside-sub">Aprende con guías de bankroll y juega responsable. Tu cuenta incluye recomendaciones basadas en IA.</p>
              </header>
              <div className="aside-points">
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12l4 4 12-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Prueba gratis 7 días</div>
                    <p className="point-desc">Empieza sin fricción y explora todas las funciones.</p>
                  </div>
                </div>
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Listo en 1 minuto</div>
                    <p className="point-desc">Registro simple y seguro para que empieces de inmediato.</p>
                  </div>
                </div>
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Experiencia personalizada</div>
                    <p className="point-desc">Recomendaciones inteligentes basadas en tus objetivos.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}