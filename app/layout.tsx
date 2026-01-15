import type { Metadata } from "next";

import { Unbounded, Space_Grotesk, Chakra_Petch } from "next/font/google"; // AESTHETIC OVERHAUL
import { Toaster } from "sonner";

import "./globals.css";

// 1. TITULOS / DISPLAY -> REEMPLAZA A OSWALD
// "Unbounded": Ancha, agresiva, cultural, muy "street car scene".
const fontDisplay = Unbounded({
  variable: "--font-oswald", // Mantener variable para no romper CSS existente
  subsets: ["latin"],
  display: "swap",
});

// 2. CUERPO / TEXTO -> REEMPLAZA A INTER
// "Space Grotesk": Geométrica pero con "quirks" extraños. Técnica y moderna.
const fontBody = Space_Grotesk({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 3. TECNICO / MONO -> REEMPLAZA A ROBOTO MONO
// "Chakra Petch": Cuadrada, futurista, parece un display de un GTR.
const fontTech = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Speedlight Culture - El garaje digital para la cultura automotriz",
  description: "Marketplace, foro, galería de alta resolución, mapa de talleres y comunidad automotriz. Un homenaje a la cultura automotriz por parte de Colombia para el mundo.",
  keywords: ["automotriz", "cultura", "marketplace", "foro", "galería", "talleres", "Colombia", "comunidad"],
  authors: [{ name: "Speedlight Culture" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://speedlightculture.com",
    title: "Speedlight Culture",
    description: "El garaje digital para la cultura automotriz",
    siteName: "Speedlight Culture",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Speedlight Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speedlight Culture",
    description: "El garaje digital para la cultura automotriz",
    images: ["/twitter-image.png"],
    creator: "@speedlightculture",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "Speedlight",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import NavigationLayout from "./components/layout/NavigationLayout";
import Preloader from "./components/Preloader";
import { BackgroundProvider } from "./context/BackgroundContext";
import GlobalBackground from "./components/layout/GlobalBackground";
import { LanguageProvider } from "./context/LanguageContext";
import OneSignalInit from "./components/pwa/OneSignalInit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>

      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D0805" />
      </head>
      <body
        className={`${fontBody.variable} ${fontTech.variable} ${fontDisplay.variable} font-sans antialiased text-[#FFF8F0] selection:bg-[#FF9800]/30 min-h-screen relative`}
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <BackgroundProvider>
          <GlobalBackground />
          <Preloader />
          <LanguageProvider>
            <NavigationLayout>
              {children}
            </NavigationLayout>
          </LanguageProvider>

          <OneSignalInit />
          <Toaster position="top-center" richColors theme="dark" />
        </BackgroundProvider>
      </body>
    </html>
  );
}
