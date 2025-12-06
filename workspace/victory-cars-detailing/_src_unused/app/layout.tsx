import './globals.css';
import { Inter, Orbitron, Style_Script } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const styleScript = Style_Script({ subsets: ['latin'], weight: ['400'], variable: '--font-style-script' });

export const metadata = {
  title: 'Victory Cars Detailing',
  description: 'Servicios premium de detallado automotriz.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable} ${styleScript.variable}`}>
      <body>{children}</body>
    </html>
  );
}
