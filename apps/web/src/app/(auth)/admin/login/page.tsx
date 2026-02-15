'use client';
import React, { useState } from 'react';
import Navbar from '../../../../components/marketing/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Verificar si es admin
        if (data.user.role === 'ADMIN') {
          router.push('/dashboard');
        } else {
          setError('No tienes permisos de administrador');
        }
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
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
            <Link href="/" className="auth-brand" aria-label="Ir a la página principal">
              <svg className="brand-logo" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="url(#brandGradient)"/>
                <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white" fillOpacity="0.9"/>
                <path d="M20 16L24 20L20 24L16 20L20 16Z" fill="white" fillOpacity="0.6"/>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#f59e0b"/>
                    <stop offset="1" stopColor="#d97706"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="brand-text">
                <div className="brand-name">Trader Deportivo</div>
                <div className="brand-tagline">Panel Administrativo</div>
              </div>
            </Link>
            
            <div className="auth-content">
              <header className="modern-auth-header">
                <h1 className="auth-welcome">¡Bienvenido Administrador!</h1>
                <p className="auth-description">
                  <span className="only-desktop">Accede al panel de administración de Trader Deportivo</span>
                  <span className="only-mobile">Panel de Admin</span>
                </p>
              </header>

              <form className="modern-auth-form" onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="only-desktop">Correo electrónico</span>
                    <span className="only-mobile">Email</span>
                  </label>
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
                      placeholder="admin@traderdeportivo.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <div className="input-error">Por favor, introduce un email válido</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <span className="only-desktop">Contraseña</span>
                    <span className="only-mobile">Clave</span>
                  </label>
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

                {error && (
                  <div className="auth-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="login-btn admin-login-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                      <span className="only-desktop">Iniciando sesión...</span>
                      <span className="only-mobile">Iniciando...</span>
                    </>
                  ) : (
                    <>
                      <span className="only-desktop">Iniciar sesión</span>
                      <span className="only-mobile">Entrar</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-divider">
                <span className="divider-text">
                  <span className="only-desktop">¿Problemas para acceder?</span>
                  <span className="only-mobile">¿Problemas?</span>
                </span>
              </div>
              
              <a href="/" className="signup-link">
                <span className="only-desktop">Volver al inicio</span>
                <span className="only-mobile">Inicio</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <aside className="auth-aside">
            <div className="aside-content">
              <header className="aside-header">
                <div className="aside-kicker">Panel de Control</div>
                <h3 className="aside-title">Gestión Integral del Sistema</h3>
                <p className="aside-sub">Administra usuarios, tipsters, señales y el funcionamiento general de la plataforma desde un solo lugar.</p>
              </header>
              <div className="aside-points">
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Gestión de Usuarios</div>
                    <p className="point-desc">Administra perfiles, suscripciones y permisos de todos los usuarios del sistema.</p>
                  </div>
                </div>
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2a10 10 0 1 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Control de Tipsters</div>
                    <p className="point-desc">Revisa, aprueba y gestiona a los tipsters y sus señales de trading.</p>
                  </div>
                </div>
                <div className="point">
                  <span className="point-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <div className="point-title">Seguridad Total</div>
                    <p className="point-desc">Acceso seguro con autenticación robusta y auditoría completa de acciones.</p>
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