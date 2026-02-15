export interface ActiveSignal {
  id: string;
  sport: string; // e.g., 'Fútbol', 'Baloncesto'
  icon: string; // e.g., '⚽', '🏀'
  league: string; // e.g., 'La Liga', 'NBA'
  pick: string; // e.g., 'Real Madrid vs Barcelona - Over 2.5 Goles'
  odds: number; // e.g., 1.85
  kickoffISO?: string; // optional ISO date for the event
}

export interface UpcomingEvent {
  id: string;
  timeLabel: string; // e.g., 'Hoy 20:00', 'Mañana 15:30'
  match: string; // e.g., 'Real Madrid vs Barcelona'
  sport: string; // e.g., 'Fútbol', 'NBA'
  icon: string; // e.g., '⚽', '🏀'
}

export interface ProgressSummary {
  monthPnlEur: number;
  totalPnlEur: number;
  monthly: Array<{ label: string; pnl: number }>; // For charts if needed
}

export type AlertSeverity = 'info' | 'warning' | 'danger';

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  createdAt: string; // ISO date
}