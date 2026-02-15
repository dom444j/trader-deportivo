import React from 'react';
import Navbar from '../../components/marketing/Navbar';
import Hero from '../../components/marketing/Hero';
import ValueProps from '../../components/marketing/ValueProps';
import HowItWorks from '../../components/marketing/HowItWorks';
import Showcase from '../../components/marketing/Showcase';
import SocialProof from '../../components/marketing/SocialProof';
import Pricing from '../../components/marketing/Pricing';
import RiskResponsible from '../../components/marketing/RiskResponsible';
import FAQ from '../../components/marketing/FAQ';
import Referrals from '../../components/marketing/Referrals';
import Footer from '../../components/marketing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trader Deportivo · Profesionales en Deportivas',
  description: 'Trader Deportivo: plataforma profesional de trading deportivo. Profesionales en Deportivas: señales EV+, gestión de bankroll, copy-trade y protección de riesgo.',
  keywords: 'trader deportivo, trading deportivo, profesionales en deportivas, señales deportivas, apuestas inteligentes, IA deportes, bankroll management',
  openGraph: {
    type: 'website',
    url: 'https://traderdeportivo.com/',
    title: 'Trader Deportivo · Profesionales en Deportivas',
    description: 'Señales EV+ con IA + expertos humanos. Gestión profesional de bankroll y copy-trade con protección automática de riesgo.',
    images: ['/og-cover.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trader Deportivo · Profesionales en Deportivas',
    description: 'Trader Deportivo: plataforma profesional de trading deportivo con señales EV+, gestión de bankroll y copy-trade con protección de riesgo.',
  },
  icons: {
    icon: '/trading_deportivo_v2_horizontal.svg',
  },
  alternates: {
    canonical: 'https://traderdeportivo.com/',
  },
  robots: 'index,follow',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section id="how-it-works"><Hero /></section>
        <section id="uvps"><ValueProps /></section>
        <section id="how"><HowItWorks /></section>
        <section id="showcase"><Showcase /></section>
        <section id="social"><SocialProof /></section>
        <section id="pricing"><Pricing /></section>
        <section id="referrals"><Referrals /></section>
        <section id="risk"><RiskResponsible /></section>
        <section id="faq"><FAQ /></section>
      </main>
      <Footer />
    </>
  );
}