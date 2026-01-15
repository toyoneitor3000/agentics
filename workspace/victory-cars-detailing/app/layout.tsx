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
  title: {
    default: 'Victory Cars S.A.S. | Detailing & Paint Protection',
    template: '%s | Victory Cars Detailing',
  },
  description: 'El Aliado Profesional que Lleva tu Vehículo a su Máxima Expresión de Brillo y Detalle. Protección Cerámica, PPF, y Detailing de Alta Gama.',
  keywords: ['Detailing', 'Bogotá', 'Carros', 'Cerámico', 'PPF', 'Restauración', 'Limpieza', 'Victory Cars'],
  authors: [{ name: 'Victory Cars Detailing' }],
  creator: 'Victory Cars S.A.S.',
  publisher: 'Victory Cars S.A.S.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://victorycarsdetailing.com'),
  openGraph: {
    title: 'Victory Cars S.A.S. | Detailing & Paint Protection',
    description: 'Transformamos tu vehículo con la mejor tecnología en protección y estética automotriz.',
    url: 'https://victorycarsdetailing.com',
    siteName: 'Victory Cars Detailing',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/logo.png', // Fallback image (better to replace with a large generated one later)
        width: 800,
        height: 600,
        alt: 'Victory Cars Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victory Cars S.A.S.',
    description: 'Expertos en Detailing y Protección Automotriz en Bogotá.',
    images: ['/logo.png'], // Fallback
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
