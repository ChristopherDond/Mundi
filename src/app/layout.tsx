import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Mundi — Globo 3D de Dados Mundiais',
  description: 'Explore PIB, saúde, educação, demografia, meio ambiente e mais em um globo 3D interativo e bonito. Dados do World Bank, UN, WHO, UNESCO.',
  keywords: ['dados mundiais', 'globo 3D', 'PIB', 'saúde', 'educação', 'demografia', 'visualização de dados', 'World Bank', 'UN', 'WHO'],
  authors: [{ name: 'Christopher Dondici' }],
  creator: 'Christopher Dondici',
  publisher: 'Mundi',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://mundi.dev',
    title: 'Mundi — Globo 3D de Dados Mundiais',
    description: 'Explore dados de 195+ países em um globo 3D interativo. PIB, saúde, educação, meio ambiente e mais.',
    siteName: 'Mundi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundi — Globo 3D de Dados Mundiais',
    description: 'Explore dados de 195+ países em um globo 3D interativo.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.cesium.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-screen min-w-screen">
        {children}
      </body>
    </html>
  );
}