interface PageFrameProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

import styles from './PageFrame.module.css';

export default function PageFrame({ 
  title, 
  subtitle, 
  actions, 
  children 
}: PageFrameProps) {
  return (
    <div className={styles.pageFrame}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleSection}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.pageActions}>{actions}</div>}
      </div>
      <div className={styles.pageContent}>
        {children}
      </div>
    </div>
  );
}