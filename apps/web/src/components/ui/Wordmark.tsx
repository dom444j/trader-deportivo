'use client';

import * as React from 'react';

interface WordmarkProps extends React.SVGProps<SVGSVGElement> {
  role: 'USER' | 'TIPSTER' | 'ADMIN';
  height?: number; // px
}

const gradients = {
  USER: { start: '#00F5FF', end: '#0066FF' },
  TIPSTER: { start: '#7c3aed', end: '#5b21b6' },
  ADMIN: { start: '#f6c90e', end: '#d97706' },
};

export default function Wordmark({ role, height = 20, className, ...props }: WordmarkProps) {
  const id = React.useMemo(() => `wm-${role.toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`,[role]);
  const g = gradients[role];
  return (
    <svg
      viewBox="0 0 720 40"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Trader Deportivo"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={g.start} />
          <stop offset="100%" stopColor={g.end} />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Glow layer */}
      <text x="0" y="28" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontWeight="800" fontSize="24" fill={`url(#${id}-grad)`} opacity="0.6" filter={`url(#${id}-glow)`}>
        Trader Deportivo
      </text>
      {/* Main text */}
      <text x="0" y="28" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontWeight="800" fontSize="24" fill="#ffffff" stroke={`url(#${id}-grad)`} strokeWidth="0.6" paintOrder="stroke">
        Trader Deportivo
      </text>
    </svg>
  );
}