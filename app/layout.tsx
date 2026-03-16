import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'
import { Footer } from '@/app/footer'
import { Header } from '@/app/header'
import { ConsentAndAnalytics } from '@/components/consent-and-analytics'
import { JsonLd } from '@/components/json-ld'
import { SITE } from '@/lib/catalog'
import { CONSENT_ENABLED, SEO } from '@/lib/site-config'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Heritage Canon',
    template: '%s | Heritage Canon',
  },
  description: SITE.description,
  alternates: {
    canonical: SITE.url,
  },
  verification: {
    google: SEO.googleSiteVerification || undefined,
  },
  openGraph: {
    title: 'Heritage Canon',
    description: SITE.description,
    url: SITE.url,
    siteName: 'Heritage Canon',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heritage Canon',
    description: SITE.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/assets/heritage-canon-logo.png`,
    description: SITE.description,
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  }

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f0e4de" />
        {CONSENT_ENABLED ? (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.css"
          />
        ) : null}
      </head>
      <body
        className={`${sans.variable} ${serif.variable} theme-museum-red min-h-screen bg-[#f0e4de] font-sans text-[#241818] antialiased`}
      >
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <ConsentAndAnalytics />
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(125,46,45,0.18),transparent_36%),radial-gradient(circle_at_82%_10%,rgba(170,132,88,0.14),transparent_22%)]" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
