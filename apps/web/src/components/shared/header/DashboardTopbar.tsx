'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './DashboardTopbar.module.css';
import { BellIcon, GearIcon, MenuIcon, ChevronDownIcon, ChevronUpIcon, ProfileIcon, LogoutIcon } from '../../ui/icons';

interface DashboardTopbarProps {
  role: 'USER' | 'TIPSTER' | 'ADMIN';
  title: string;
  onToggleSidebar: () => void;
}

export default function DashboardTopbar({ 
  role, 
  title = 'Dashboard', 
  onToggleSidebar 
}: DashboardTopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Detectar si es móvil para renderizar sólo una variante
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    // addEventListener es el moderno; fallback para Safari viejo
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      // @ts-ignore
      mq.addListener(update);
      return () => {
        // @ts-ignore
        mq.removeListener(update);
      };
    }
  }, []);

  // New state for bank KPI and alerts
  const [bankroll, setBankroll] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<number>(0);

  useEffect(() => {
    let m = true;
    const load = async () => {
      try {
        const [bankRes, alertsRes] = await Promise.all([
          fetch('/api/user/bankroll/current'),
          fetch('/api/user/alerts')
        ]);
        if (!m) return;
        if (bankRes.ok) {
          const b = await bankRes.json();
          setBankroll(b?.amount ?? b?.bankroll ?? null);
        }
        if (alertsRes.ok) {
          const data = await alertsRes.json();
          const count = Array.isArray(data) ? data.length : (data?.items?.length ?? 0);
          setAlerts(count);
        }
      } catch (e) { /* silent */ }
    };
    load();
    return () => { m = false; };
  }, []);

  // Cerrar menú con click fuera y con tecla Escape
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu]);

  const getRoleLabel = () => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'TIPSTER':
        return 'Tipster';
      default:
        return 'Usuario';
    }
  };

  const handleLogout = async () => {
    // Placeholder: integrate with auth later
    router.push('/auth/login');
  };

  return (
    <header className={`${styles.appTopbar} ${styles[role.toLowerCase()]}`}>
      <div className={styles.topbarLeft}>
        <button
          className={styles.sidebarToggleMobile}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className={styles.iconSvg} />
        </button>
        <div className={styles.breadcrumb}>
          {/* En móvil se ocultará el primer elemento por CSS */}
          <span className={styles.breadcrumbItem}>{getRoleLabel()}</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbItem}>{title}</span>
        </div>
      </div>

      <div className={styles.topbarCenter}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔎</span>
          <input className={styles.searchInput} placeholder="Buscar... (Cmd+/)" />
        </div>
        <div className={styles.kpiPill}>
          <span className={styles.kpiLabel}>Bank Total</span>
          <span className={styles.kpiValue}>{bankroll === null ? '—' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(bankroll)}</span>
        </div>
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.iconBtn} title="Notificaciones" aria-label="Notificaciones">
          <BellIcon className={styles.iconSvg} />
          {alerts > 0 && <span className={styles.badge}>{alerts}</span>}
        </button>
        <Link href="/dashboard/settings" className={styles.iconBtn} title="Ajustes" aria-label="Ajustes">
          <GearIcon className={styles.iconSvg} />
        </Link>

        <div className={styles.userMenuContainer} ref={menuRef}>
          <button
            className={styles.userMenuTrigger}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
          >
            <div className={styles.userAvatar}>
              {role === 'ADMIN' ? '👨‍💼' : role === 'TIPSTER' ? '⭐' : '👤'}
            </div>
            {/* Nombre y flecha se ocultan por CSS en móvil */}
            <span className={styles.userName}>{role}</span>
            <span className={styles.userArrow}>{showUserMenu ? <ChevronUpIcon className={styles.iconSvg} /> : <ChevronDownIcon className={styles.iconSvg} />}</span>
          </button>

          {showUserMenu && (
            <div className={styles.userMenuDropdown} role="menu" aria-label="Menú de usuario" id="user-menu">
              <div className={styles.menuHeader}>
                <div className={styles.menuAvatar}>{role === 'ADMIN' ? '👨‍💼' : role === 'TIPSTER' ? '⭐' : '👤'}</div>
                <div>
                  <div className={styles.menuName}>{getRoleLabel()}</div>
                  <div className={styles.menuRole}>Cuenta {getRoleLabel()}</div>
                </div>
              </div>
              <hr className={styles.menuDivider} />
              <Link href="/dashboard/profile" className={styles.menuItem} role="menuitem">
                {isMobile ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ProfileIcon className={styles.iconSvg} /> Perfil
                  </span>
                ) : (
                  <span>👤 Perfil</span>
                )}
              </Link>
              <Link href="/dashboard/settings" className={styles.menuItem} role="menuitem">
                {isMobile ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <GearIcon className={styles.iconSvg} /> Configuración
                  </span>
                ) : (
                  <span>⚙️ Configuración</span>
                )}
              </Link>
              <button className={`${styles.menuItem} ${styles.logout}`} role="menuitem" onClick={handleLogout}>
                {isMobile ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <LogoutIcon className={styles.iconSvg} /> Cerrar sesión
                  </span>
                ) : (
                  <span>🚪 Cerrar sesión</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}