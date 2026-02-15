export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  group?: string;
  badge?: string;
  badgeVariant?: 'success' | 'danger' | 'gold' | 'default';
  children?: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const userNav: NavItem[] = [
  // Sección: Inteligencia
  { label: 'Dashboard', href: '/user/dashboard', icon: '📊', group: 'Inteligencia', badge: '+$234', badgeVariant: 'success' },
  { label: 'Agents Hub', href: '/user/agents', icon: '🧠', group: 'Inteligencia', badge: '12' },
  {
    label: 'Señales', href: '/user/signals', icon: '🧾', group: 'Inteligencia', badge: '3', badgeVariant: 'danger', collapsible: true, defaultOpen: false,
    children: [
      { label: 'Señales PRE', href: '/user/signals/pre', icon: '🧾' },
      { label: 'Señales LIVE', href: '/user/signals/live', icon: '🧾' },
    ]
  },
  { label: 'Smart Portfolio', href: '/user/portfolio', icon: '🔥', group: 'Inteligencia', badge: '⭐', badgeVariant: 'gold' },
  { label: 'Trader Master', href: '/user/trader-master', icon: '📈', group: 'Inteligencia' },

  // Sección: Capital & Control
  { label: 'Bankroll', href: '/user/bankroll', icon: '💰', group: 'Capital & Control' },
  { label: 'Watchlist', href: '/user/watchlist', icon: '🎯', group: 'Capital & Control', badge: '5' },
  { label: 'Alertas de Riesgo', href: '/user/risk', icon: '🚨', group: 'Capital & Control', badge: '2', badgeVariant: 'danger' },

  // Sección: Tienda
  {
    label: 'Premium Hub', href: '/user/premium', icon: '🛒', group: 'Tienda', collapsible: true, defaultOpen: false,
    children: [
      { label: 'Planes', href: '/user/premium/plans', icon: '💎', badge: 'Upgrade!', badgeVariant: 'gold' },
      { label: 'Créditos', href: '/user/premium/credits', icon: '🪙', badge: '120' },
      { label: 'Promociones', href: '/user/premium/promotions', icon: '🎁' },
    ]
  },

  // Sección: Comunidad
  {
    label: 'Comunidad', href: '/user/community', icon: '👥', group: 'Comunidad', collapsible: true, defaultOpen: false,
    children: [
      { label: 'Leaderboard', href: '/user/community/leaderboard', icon: '🏆' },
      { label: 'Discusiones', href: '/user/community/discussions', icon: '💬' },
      { label: 'Siguiendo', href: '/user/community/following', icon: '👤', badge: '11' },
    ]
  },
  { label: 'Soporte', href: '/user/support', icon: '🎧', group: 'Comunidad' },

  // Sección: IA & Mejora
  { label: 'Tu Entrenador', href: '/user/coach', icon: '🤖', group: 'IA & Mejora', badge: 'NEW', badgeVariant: 'gold' },
  { label: 'Mis Estadísticas', href: '/user/stats', icon: '📈', group: 'IA & Mejora' },

  // Sección: Referidos
  {
    label: 'Referidos', href: '/user/referrals', icon: '🔗', group: 'Referidos', collapsible: true, defaultOpen: false,
    children: [
      { label: 'Resumen', href: '/user/referrals', icon: '🔗' },
      { label: 'Directos (10%)', href: '/user/referrals#directs', icon: '👤', badge: '$127', badgeVariant: 'success' },
      { label: 'Equipo Binario (A/B)', href: '/user/referrals#team-binary', icon: '🏦' },
      { label: 'Pagos', href: '/user/referrals#payments', icon: '💰' },
    ]
  },

  // Sección: Otros
  { label: 'Configuración', href: '/user/settings', icon: '⚙️', group: 'Otros' },
];

export const tipsterNav: NavItem[] = [
  { label: 'Dashboard', href: '/tipster/dashboard', icon: '📊' },
  { label: 'Mis Señales', href: '/tipster/signals', icon: '📈' },
  { label: 'Análisis', href: '/tipster/analysis', icon: '📋' },
  { label: 'Estadísticas', href: '/tipster/stats', icon: '📈' },
  { label: 'Perfil', href: '/tipster/profile', icon: '👤' },
  { label: 'Configuración', href: '/tipster/settings', icon: '⚙️' },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Usuarios', href: '/admin/users', icon: '👥' },
  { label: 'Tipsters', href: '/admin/tipsters', icon: '⭐' },
  { label: 'Señales', href: '/admin/signals', icon: '📈' },
  { label: 'Sistema', href: '/admin/system', icon: '⚙️' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📋' },
  { label: 'Soporte', href: '/admin/support', icon: '🆘' },
];

export const getNavigationByRole = (role: 'USER' | 'TIPSTER' | 'ADMIN'): NavItem[] => {
  switch (role) {
    case 'USER':
      return userNav;
    case 'TIPSTER':
      return tipsterNav;
    case 'ADMIN':
      return adminNav;
    default:
      return userNav;
  }
};