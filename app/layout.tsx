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
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
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
        <meta name="theme-color" content="#f5efe5" />
        {CONSENT_ENABLED ? (
          <>
            {/* eslint-disable-next-line @next/next/no-css-tags */}
            <link rel="stylesheet" href="/vendor/cookieconsent/cookieconsent.css" />
          </>
        ) : null}
      </head>
      <body
        className={`${sans.variable} ${serif.variable} theme-paper-light min-h-screen bg-[#f5efe5] font-sans text-[#201b16] antialiased`}
      >
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <ConsentAndAnalytics />
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(143,106,42,0.16),transparent_36%),radial-gradient(circle_at_82%_10%,rgba(87,109,138,0.14),transparent_24%)]" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
