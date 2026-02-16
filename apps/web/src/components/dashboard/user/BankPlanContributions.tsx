import React from 'react';
import styles from '@/app/(dashboard)/user/UserDashboard.module.css';

export default function BankPlanContributions() {
  return (
    <div className={styles.planContributionBanner}>
      <div className={styles.contributionIcon}>💎</div>
      <div style={{ flex: 1 }}>
        <div className={styles.contributionTitle}>Aportes al Bank por Plan</div>
        <div className={styles.contributionMeta}>
          Cada compra aporta al Bank Total histórico que determina tu rango base
        </div>
        <div className={styles.contributionGrid}>
          <div className={styles.contributionItem}>
            <div className={styles.contributionLabel}>BÁSICA €29.99</div>
            <div className={styles.contributionValue}>+€20</div>
          </div>
          <div className={styles.contributionItem}>
            <div className={styles.contributionLabel}>PRO €129.99</div>
            <div className={`${styles.contributionValue} ${styles.valueCyan}`}>+€80</div>
          </div>
          <div className={styles.contributionItem}>
            <div className={styles.contributionLabel}>PREMIUM €799.99</div>
            <div className={`${styles.contributionValue} ${styles.valueGold}`}>+€500</div>
          </div>
        </div>
      </div>
    </div>
  );
}