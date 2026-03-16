import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'
import { Footer } from '@/app/footer'
import { Header } from '@/app/header'
import { SITE } from '@/lib/catalog'

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
  openGraph: {
    title: 'Heritage Canon',
    description: SITE.description,
    url: SITE.url,
    siteName: 'Heritage Canon',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen bg-[#07090d] font-sans text-zinc-100 antialiased`}
      >
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(208,168,92,0.18),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(97,144,255,0.14),transparent_26%)]" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
