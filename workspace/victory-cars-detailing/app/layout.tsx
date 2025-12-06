import type { Metadata } from 'next';
import { Inter, Orbitron, Style_Script } from 'next/font/google';
import './globals.css';
import React from 'react';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import ScrollReveal from './components/ScrollReveal';
import VisualEffects from './components/VisualEffects';
import Header from './components/Header';
import Preloader from './components/Preloader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-orbitron' });
const styleScript = Style_Script({ subsets: ['latin'], weight: ['400'], variable: '--font-style-script' });

export const metadata: Metadata = {
  title: 'Victory Cars S.A.S. | Detailing & Paint Protection',
  description: 'El Aliado Profesional que Lleva tu Vehículo a su Máxima Expresión de Brillo y Detalle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} ${styleScript.variable} font-sans bg-brand-dark-blue text-brand-slate selection:bg-brand-cyan selection:text-brand-dark-blue custom-cursor`}>
        <Preloader />
        <Header />

        {children}

        <ScrollReveal />
        <VisualEffects />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
