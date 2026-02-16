import React from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, icon, children, className }: MetricCardProps) {
  return (
    <div className={`${styles.statCard} ${className || ''}`}>
      <div className={styles.statHeader}>
        <div style={{ flex: 1 }}>
          <div className={styles.statLabel}>{title}</div>
        </div>
        {icon && <div className={styles.statIcon}>{icon}</div>}
      </div>
      <div className={styles.statContent}>
        {children}
      </div>
    </div>
  );
}