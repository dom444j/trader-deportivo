import { Metadata } from 'next';
import '../../styles/marketing.css';
import '../../styles/auth.css';

export const metadata: Metadata = {
  title: 'Iniciar Sesión · Trader Deportivo',
  description: 'Accede a tu cuenta. Profesionales en Deportivas: señales EV+ verificadas, gestión de bankroll y copy-trade con protección de riesgo.',
  keywords: 'iniciar sesión, login, trader deportivo, profesionales en deportivas, señales EV+, copy-trade',
  openGraph: {
    type: 'website',
    url: 'https://traderdeportivo.com/login',
    title: 'Iniciar Sesión · Trader Deportivo',
    description: 'Accede a tu cuenta en Trader Deportivo y continúa tu estrategia de trading deportivo con señales EV+ y protección automática de riesgo.',
    images: ['/trading_deportivo_v2_horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iniciar Sesión · Trader Deportivo',
    description: 'Profesionales en Deportivas: señales EV+, gestión de bankroll, copy-trade con protección de riesgo.',
  },
  alternates: {
    canonical: 'https://traderdeportivo.com/login',
  },
  robots: 'index,follow',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}