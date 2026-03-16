import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'About',
  description: SITE.description,
  alternates: {
    canonical: `${SITE.url}/about`,
  },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Heritage Canon',
    url: `${SITE.url}/about`,
    description: SITE.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: `${SITE.url}/about`,
        },
      ],
    },
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <JsonLd data={jsonLd} />
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
        About
      </p>
      <h1 className="mt-5 max-w-[12ch] font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white">
        These are not neutral editions.
      </h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            Most editions of classic literature present the text as though it
            speaks for itself. Heritage Canon does not. Each edition includes a
            philosophical introduction that argues a specific case: what the
            work was doing, what pressures produced it, and why that matters
            now.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[#0c1016] p-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            The original title stands. Beneath it, a subtitle states the
            argument the introduction will make. The introduction reconstructs
            the debates, historical pressures, and ways of reading that shaped
            the work&apos;s first reception — and that later editions often
            flatten or obscure.
          </p>
        </div>
      </div>
    </main>
  )
}
