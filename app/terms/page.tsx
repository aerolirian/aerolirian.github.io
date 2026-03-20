import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms of use for ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/terms`,
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
      <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-[#3b322a]">
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
        Terms
      </p>
      <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.9] tracking-[-0.04em] text-[#201b16] sm:text-6xl">
        Terms of use
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4036]">
        These terms govern your use of the Heritage Canon website. They do not
        govern purchases made on Amazon or other third-party retail platforms.
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#8a7864]">
        {updatedAt}
      </p>

      <div className="mt-10 space-y-6">
        <Section title="1. Scope">
          <p>
            Heritage Canon is an editorial and catalog site. It presents
            editions, essays, and related information about the series. The site
            itself does not currently process purchases, user accounts, or paid
            subscriptions.
          </p>
        </Section>

        <Section title="2. No direct sale through this site">
          <p>
            If you decide to buy a book, you will be sent to a third-party
            retailer. Any purchase, payment, shipping, return, or consumer
            contract is formed with that retailer, not with this site.
          </p>
          <p>
            Retailer pages are governed by the retailer&apos;s own terms, pricing,
            and availability rules.
          </p>
        </Section>

        <Section title="3. Intellectual property">
          <p>
            Unless otherwise stated, the site design, original editorial copy,
            introductions, branding, and Heritage Canon-specific materials are
            protected by intellectual property law.
          </p>
          <p>
            You may browse the site, link to it, and quote short portions for
            review, commentary, scholarship, or other lawful uses that are
            permitted under applicable law. That does not transfer ownership or
            broader reuse rights.
          </p>
        </Section>

        <Section title="4. Acceptable use">
          <p>You may not use the site in a way that:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>violates applicable law</li>
            <li>interferes with the security or availability of the site</li>
            <li>
              misrepresents Heritage Canon materials as your own or as official
              retailer materials
            </li>
            <li>
              uses the site for abusive scraping or automated activity that
              disrupts normal operation
            </li>
          </ul>
        </Section>

        <Section title="5. Accuracy and availability">
          <p>
            We try to keep the site accurate and up to date, but we do not
            guarantee that every page, link, price, or retailer listing will be
            complete, current, or continuously available at every moment.
          </p>
          <p>
            Book availability, storefront coverage, and retailer details can
            change independently of this site.
          </p>
        </Section>

        <Section title="6. External links">
          <p>
            The site links to Amazon and may later link to essays or other
            third-party resources. We are not responsible for the content,
            availability, or terms of those external sites.
          </p>
        </Section>

        <Section title="7. Liability">
          <p>
            Nothing on this site excludes liability where exclusion is not
            legally permitted. Subject to that, the site is provided as an
            informational publishing site, and ordinary availability or content
            errors may occur despite reasonable care.
          </p>
        </Section>

        <Section title="8. Governing law">
          <p>
            These terms are governed by the law of the Federal Republic of
            Germany, without prejudice to mandatory consumer protection rules
            that may apply under the law of your habitual residence.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Formal legal and contact details are available in the{' '}
            <Link
              href="/impressum"
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              Impressum / Imprint
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
