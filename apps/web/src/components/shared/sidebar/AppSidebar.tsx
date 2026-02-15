'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/lib/config/navigation';
import styles from './AppSidebar.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Wordmark from '../../ui/Wordmark';

interface AppSidebarProps {
  navItems: NavItem[];
  role: 'USER' | 'TIPSTER' | 'ADMIN';
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
  isMobile?: boolean;
  isOpen?: boolean;
}

export default function AppSidebar({ 
  navItems, 
  role, 
  collapsed = false, 
  onToggle,
  currentPath,
  isMobile = false,
  isOpen = false
}: AppSidebarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  // Quick status state
  const [bankroll, setBankroll] = useState<number | null>(null);
  const [pnlMonth, setPnlMonth] = useState<number | null>(null);
  const [roiMonth, setRoiMonth] = useState<number | null>(null);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  // Estado de dropdowns
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [kpisRes, alertsRes] = await Promise.all([
          fetch('/api/user/dashboard/kpis'),
          fetch('/api/user/alerts')
        ]);
        if (!mounted) return;
        if (kpisRes.ok) {
          const k = await kpisRes.json();
          setBankroll(k.bankroll ?? null);
          setPnlMonth(k.pnlMonth ?? null);
          setRoiMonth(k.roiMonth ?? null);
        }
        if (alertsRes.ok) {
          const a = await alertsRes.json();
          setAlertsCount(Array.isArray(a) ? a.length : (a?.items?.length ?? 0));
        }
      } catch (e) {
        // silent fail – demo mode
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Inicializar estado de dropdowns según items activos o defaultOpen
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children && item.children.length > 0) {
        const key = item.href;
        const activeChild = item.children.some(ch => activePath.startsWith(ch.href));
        initial[key] = item.defaultOpen || activeChild || false;
      }
    });
    setOpen(prev => ({ ...initial, ...prev }));
  }, [navItems, activePath]);

  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const getRoleColor = () => {
    switch (role) {
      case 'ADMIN':
        return 'admin';
      case 'TIPSTER':
        return 'tipster';
      case 'USER':
        return 'user';
      default:
        return 'user';
    }
  };

  const isActive = (href: string) => {
    if (
      href === '/user/dashboard' ||
      href === '/dashboard' ||
      href === '/tipster/dashboard' ||
      href === '/admin'
    ) {
      return activePath === href;
    }
    return activePath.startsWith(href);
  };

  const groupedItems = navItems.reduce((acc, item) => {
    const group = item.group || 'default';
    if (!acc[group]) {
      acc[group] = [] as typeof navItems;
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, AppSidebarProps['navItems']>);

  const formatMoney = (v: number | null) => v === null ? '—' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  const formatPct = (v: number | null) => v === null ? '—' : `${(v * 100).toFixed(1)}%`;

  const getBadgeClass = (variant?: 'success' | 'danger' | 'gold' | 'default') => {
    switch (variant) {
      case 'success': return styles.badgeSuccess;
      case 'danger': return styles.badgeDanger;
      case 'gold': return styles.badgeGold;
      default: return '';
    }
  };

  return (
    <aside className={`${styles.appSidebar} ${styles[getRoleColor()]} ${collapsed ? styles.collapsed : ''} ${isMobile && isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <Image
            src="/brand/favicon_option1.svg"
            alt="Trader Deportivo"
            width={36}
            height={36}
            className={styles.logoImg}
            priority
          />
          {!isMobile && !collapsed && (
            <Wordmark role={role} height={31} />
          )}
        </div>
        {!isMobile && (
          <button 
            className={styles.sidebarToggle} 
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>
        )}
        {isMobile && (
          <button 
            className={styles.sidebarToggle} 
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Status */}
      {!collapsed && (
        <div className={styles.quickStatus}>
          <div className={styles.statusTitle}>Estado Rápido</div>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Bankroll</div>
              <div className={`${styles.statusValue} ${styles.positive}`}>{formatMoney(bankroll)}</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>ROI Mes</div>
              <div className={`${styles.statusValue} ${roiMonth && roiMonth >= 0 ? styles.positive : styles.danger}`}>{formatPct(roiMonth)}</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>PnL Mes</div>
              <div className={`${styles.statusValue} ${pnlMonth && pnlMonth >= 0 ? styles.positive : styles.danger}`}>{pnlMonth === null ? '—' : `${pnlMonth >= 0 ? '+' : ''}€${Math.abs(pnlMonth)}`}</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Alertas</div>
              <div className={`${styles.statusValue} ${alertsCount > 0 ? styles.warning : ''}`}>{alertsCount}</div>
            </div>
          </div>
        </div>
      )}

      <nav className={styles.sidebarNav}>
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className={styles.navGroup}>
            {!collapsed && group !== 'default' && (
              <div className={styles.navGroupLabel}>{group}</div>
            )}
            <ul className={styles.navList}>
              {items.map((item) => (
                <li key={item.href} className={styles.navItem}>
                  {/* Ítem con dropdown */}
                  {item.children && item.children.length > 0 ? (
                    <div className={styles.navDropdown}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                      >
                        {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                        {!collapsed && <span className={styles.navText}>{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className={`${styles.navBadge} ${getBadgeClass(item.badgeVariant)}`}>{item.badge}</span>
                        )}
                      </Link>
                      {!collapsed && (
                        <button
                          type="button"
                          className={`${styles.dropdownArrow} ${open[item.href] ? styles.open : ''}`}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item.href); }}
                          aria-label={`Toggle ${item.label}`}
                          aria-expanded={open[item.href] ? true : false}
                        >
                          ▼
                        </button>
                      )}
                      {!collapsed && open[item.href] && (
                        <ul className={styles.navSubList}>
                          {item.children.map((sub) => (
                            <li key={sub.href} className={styles.navSubItem}>
                              <Link
                                href={sub.href}
                                className={`${styles.navSubLink} ${isActive(sub.href) ? styles.active : ''}`}
                              >
                                {sub.icon && <span className={styles.navIcon}>{sub.icon}</span>}
                                {!collapsed && <span className={styles.navText}>{sub.label}</span>}
                                {!collapsed && sub.badge && (
                                  <span className={`${styles.navBadge} ${getBadgeClass(sub.badgeVariant)}`}>{sub.badge}</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                    >
                      {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                      {!collapsed && <span className={styles.navText}>{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className={`${styles.navBadge} ${getBadgeClass(item.badgeVariant)}`}>{item.badge}</span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Removed user footer to avoid duplicating user controls present in the Topbar */}
    </aside>
  );
}