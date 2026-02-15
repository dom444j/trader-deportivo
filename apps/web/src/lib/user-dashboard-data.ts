import { ActiveSignal, UpcomingEvent, ProgressSummary, AlertItem } from '@/types/user-dashboard-extra';

// Datos demo deterministas para desarrollo/preview del dashboard
export async function getActiveSignals(): Promise<ActiveSignal[]> {
  return [
    {
      id: 'sig-1',
      sport: 'Fútbol',
      icon: '⚽',
      league: 'La Liga',
      pick: 'Real Madrid vs Barcelona - Over 2.5 Goles',
      odds: 1.85,
      kickoffISO: new Date().toISOString(),
    },
    {
      id: 'sig-2',
      sport: 'Baloncesto',
      icon: '🏀',
      league: 'NBA',
      pick: 'Lakers -5.5 Handicap',
      odds: 1.9,
      kickoffISO: new Date(Date.now() + 3600_000).toISOString(),
    },
    {
      id: 'sig-3',
      sport: 'Tenis',
      icon: '🎾',
      league: 'ATP 500',
      pick: 'Alcaraz gana 2-0',
      odds: 2.1,
      kickoffISO: new Date(Date.now() + 2 * 3600_000).toISOString(),
    },
  ];
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  return [
    { id: 'evt-1', timeLabel: 'Hoy 20:00', match: 'Real Madrid vs Barcelona', sport: 'Fútbol', icon: '⚽' },
    { id: 'evt-2', timeLabel: 'Mañana 15:30', match: 'Lakers vs Warriors', sport: 'NBA', icon: '🏀' },
    { id: 'evt-3', timeLabel: 'Sábado 12:00', match: 'Djokovic vs Alcaraz', sport: 'Tenis', icon: '🎾' },
  ];
}

export async function getProgressSummary(): Promise<ProgressSummary> {
  return {
    monthPnlEur: 245,
    totalPnlEur: 1240,
    monthly: [
      { label: 'Ene', pnl: 120 },
      { label: 'Feb', pnl: 80 },
      { label: 'Mar', pnl: 210 },
      { label: 'Abr', pnl: -45 },
      { label: 'May', pnl: 90 },
      { label: 'Jun', pnl: 240 },
    ],
  };
}

export async function getUserAlerts(): Promise<AlertItem[]> {
  return [
    { id: 'al-1', title: 'Nueva señal de tipster seguido', severity: 'info', createdAt: new Date().toISOString() },
    { id: 'al-2', title: 'Alerta de gestión de banca: drawdown > 10%', severity: 'warning', createdAt: new Date().toISOString() },
  ];
}