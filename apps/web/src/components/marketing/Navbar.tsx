'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isLoginPage) {
      // On login page, navigate to home first then scroll
      window.location.href = '/#' + id;
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: if section doesn't exist on this page, go to home with anchor
        window.location.href = '/#' + id;
      }
    }
  };
  const handlePush = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" aria-label="Inicio">
          <picture>
            <source srcSet="/brand/favicon_option1.svg" media="(max-width: 599px)" />
            <img className="brand-logo" src="/trading_deportivo_v2_horizontal.svg" alt="Trader Deportivo" />
          </picture>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <a className="nav-link" href="#showcase" onClick={handleScrollTo('showcase')}>Señales</a>
          <a className="nav-link" href="#social" onClick={handleScrollTo('social')}>Tipsters</a>
          <a className="nav-link" href="#pricing" onClick={handleScrollTo('pricing')}>Precios</a>
          <a className="nav-link" href="#referrals" onClick={handleScrollTo('referrals')}>Referidos</a>
        </nav>
        <div className="nav-cta">
          {!isLoginPage && (
            <a className="btn btn-outline" href="/login" onClick={handlePush('/login')}>Entrar</a>
          )}
          <a className="btn btn-primary" href="/signup" onClick={handlePush('/signup')}>Sign Up</a>
        </div>
      </div>
    </header>
  );
}