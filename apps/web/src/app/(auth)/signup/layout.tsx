import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro · Trader Deportivo',
  description: 'Crea tu cuenta en Trader Deportivo. Profesionales en Deportivas: estrategias, picks y gestión responsable con IA + expertise.',
  keywords: 'trader deportivo, trading deportivo, registro, apuestas, tipster, estrategias, profesionales en deportivas',
  openGraph: {
    type: 'website',
    url: '/signup',
    title: 'Registro · Trader Deportivo',
    description: 'Únete a Trader Deportivo. Profesionales en Deportivas: estrategias y picks guiados con IA.',
    images: ['/trading_deportivo_v2_horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Registro · Trader Deportivo',
    description: 'Profesionales en Deportivas: crea tu cuenta y empieza con estrategias guiadas.',
    images: ['/trading_deportivo_v2_horizontal.svg'],
  },
  alternates: {
    canonical: '/signup',
  },
  robots: 'index,follow',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; 
}