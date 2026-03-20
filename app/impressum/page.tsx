import type { Metadata } from 'next'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Impressum',
  description: `Imprint and legal contact information for ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/impressum`,
  },
}

const updatedAt = 'Last updated: March 20, 2026'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_12px_40px_rgba(61,45,25,0.06)]">
      <h2 className="font-serif text-2xl leading-tight text-[#201b16]">{title}</h2>
      <div className="mt-4 space-y-2 text-[1.02rem] leading-relaxed text-[#3b322a]">
        {children}
      </div>
    </section>
  )
}

export default function ImpressumPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
        Impressum
      </p>
      <h1 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.04em] text-[#201b16] sm:text-6xl">
        Imprint
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4036]">
        Formal publisher identification and legal contact information for
        Heritage Canon.
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#8a7864]">
        {updatedAt}
      </p>

      <div className="mt-10 space-y-6">
        <Section title="1. Information pursuant to section 5 DDG">
          <p>{SITE.imprint}</p>
          <p>{SITE.legalName}</p>
          <p>{SITE.address.street}</p>
          <p>
            {SITE.address.postalCode} {SITE.address.city}
          </p>
          <p>{SITE.address.country}</p>
        </Section>

        <Section title="2. Contact">
          <p>
            Email:{' '}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              {SITE.email}
            </a>
          </p>
        </Section>

        <Section title="3. Responsible for content under section 18(2) MStV">
          <p>{SITE.legalName}</p>
          <p>{SITE.address.street}</p>
          <p>
            {SITE.address.postalCode} {SITE.address.city}
          </p>
          <p>{SITE.address.country}</p>
        </Section>
      </div>
    </main>
  )
}
