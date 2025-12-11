import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Roboto_Mono, Oswald } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import NavigationLayout from "./components/layout/NavigationLayout";
import Preloader from "./components/Preloader";
import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A1A1A" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${oswald.variable} font-sans antialiased bg-[#050302] text-[#FFF8F0] selection:bg-[#FF9800]/30`}
      >
        <Preloader />
        <LanguageProvider>
          <NavigationLayout>
            {children}
          </NavigationLayout>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
