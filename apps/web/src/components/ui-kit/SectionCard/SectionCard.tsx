import React from 'react';
import styles from './SectionCard.module.css';

interface SectionCardProps {
  title: string;
  link?: {
    href: string;
    text: string;
  };
  children: React.ReactNode;
}

export function SectionCard({ title, link, children }: SectionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        {link && <a href={link.href} className={styles.cardLink}>{link.text}</a>}
      </div>
      <div className={styles.cardBody}>
        {children}
      </div>
    </div>
  );
}