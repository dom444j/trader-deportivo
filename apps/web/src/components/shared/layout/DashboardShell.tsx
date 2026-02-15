'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AppSidebar from '@/components/shared/sidebar/AppSidebar';
import DashboardTopbar from '@/components/shared/header/DashboardTopbar';
import { getNavigationByRole } from '@/lib/config/navigation';
import styles from './DashboardShell.module.css';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'USER' | 'TIPSTER' | 'ADMIN';
  title?: string;
}

export default function DashboardShell({ 
  children, 
  role, 
  title = 'Dashboard' 
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = getNavigationByRole(role);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseMobileSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div 
      className={`${styles.appShell} ${styles[role.toLowerCase()]}`}
      data-sidebar-collapsed={!isMobile && sidebarCollapsed ? 'true' : 'false'}
      data-sidebar-open={isMobile && sidebarOpen ? 'true' : 'false'}
    >
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={handleCloseMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <AppSidebar
        navItems={navItems}
        role={role}
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggle={handleToggleSidebar}
        currentPath={pathname}
        isMobile={isMobile}
        isOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <div className={styles.appMain}>
        {/* Topbar */}
        <DashboardTopbar
          role={role}
          title={title}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Content */}
        <main className={styles.appContent}>
          {children}
        </main>
      </div>
    </div>
  );
}