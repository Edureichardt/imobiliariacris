

import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Rodape from './components/Rodape'
import Preloader from './components/Preloader'


const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Imobiliaria CA Imóveis | Imobiliária em Rio Negro e Mafra',
  description:
    'Imobiliária em Rio Negro e Mafra. Casas, apartamentos, terrenos e imóveis comerciais à venda e para alugar com a CA Imóveis.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        <meta
          name="google-site-verification"
          content="LRBP7xDyhJN7nIQ5s0JWo3R1rmDJW5u2A3An8KASHII"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "CA Imóveis",
              "image": "https://caimoveis.dev.br/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Rio Negro",
                "addressRegion": "PR",
                "addressCountry": "BR"
              },
              "url": "https://caimoveis.dev.br",
              "telephone": "+554799164-8594",
              "areaServed": ["Rio Negro", "Mafra"]
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Preloader />
        <Header />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
