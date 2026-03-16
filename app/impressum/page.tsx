import type { Metadata } from 'next'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Impressum',
  description: `Imprint and legal contact information for ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/impressum`,
  },
}

export default function ImpressumPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
        Impressum
      </p>
      <h1 className="mt-5 font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white">
        Imprint
      </h1>
      <div className="mt-10 space-y-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl leading-tight text-white">
            Information pursuant to § 5 TMG
          </h2>
          <div className="space-y-1 text-lg leading-relaxed">
            <p>{SITE.imprint}</p>
            <p>{SITE.legalName}</p>
            <p>{SITE.address.street}</p>
            <p>
              {SITE.address.postalCode} {SITE.address.city}
            </p>
            <p>{SITE.address.country}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl leading-tight text-white">
            Contact
          </h2>
          <p className="text-lg leading-relaxed">
            Email:{' '}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[#d0a85c] underline decoration-white/10 underline-offset-4 transition hover:text-white"
            >
              {SITE.email}
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl leading-tight text-white">
            Responsible for content under § 18 Abs. 2 MStV
          </h2>
          <div className="space-y-1 text-lg leading-relaxed">
            <p>{SITE.legalName}</p>
            <p>{SITE.address.street}</p>
            <p>
              {SITE.address.postalCode} {SITE.address.city}
            </p>
            <p>{SITE.address.country}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
