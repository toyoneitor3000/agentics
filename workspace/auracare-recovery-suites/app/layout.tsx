import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beauty & Comfort Recovery House | Recuperación Post-Operatoria en Bogotá',
  description: 'Casa de recuperación post-operatoria de lujo en Bogotá. Cuidados profesionales, hospedaje, alimentación y acompañamiento en todo tu proceso de recuperación.',
  keywords: ['recuperación post-operatoria', 'casa de recuperación Bogotá', 'cuidados post-quirúrgicos', 'hospedaje médico', 'recovery house Colombia'],
  authors: [{ name: 'Beauty & Comfort Recovery House' }],
  openGraph: {
    title: 'Beauty & Comfort Recovery House',
    description: 'Recuperación post-operatoria de lujo en Bogotá',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beauty & Comfort Recovery House',
    description: 'Recuperación post-operatoria de lujo en Bogotá',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}