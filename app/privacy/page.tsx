import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/privacy`,
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

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
        Privacy Policy
      </p>
      <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.9] tracking-[-0.04em] text-[#201b16] sm:text-6xl">
        Privacy notice for Heritage Canon
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4036]">
        This notice explains what personal data is processed when you visit this
        site, click retailer links, use the consent controls, or contact us by
        email. It is intended to satisfy the information duties that apply when
        personal data is collected from you.
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#8a7864]">
        {updatedAt}
      </p>

      <div className="mt-10 space-y-6">
        <Section title="1. Controller">
          <div className="space-y-1">
            <p>{SITE.imprint}</p>
            <p>{SITE.legalName}</p>
            <p>{SITE.address.street}</p>
            <p>
              {SITE.address.postalCode} {SITE.address.city}
            </p>
            <p>{SITE.address.country}</p>
            <p>
              Email:{' '}
              <a
                href={`mailto:${SITE.email}`}
                className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
              >
                {SITE.email}
              </a>
            </p>
          </div>
        </Section>

        <Section title="2. What we process and on what basis">
          <p>
            We process only the data needed to deliver the site, remember your
            consent choice, measure usage if you opt in, and respond if you
            contact us.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Site delivery, technical stability, abuse prevention, and basic
              operational logging: Article 6(1)(f) GDPR (legitimate interests).
            </li>
            <li>
              Analytics: Article 6(1)(a) GDPR (consent).
            </li>
            <li>
              Handling direct email inquiries and keeping legally required
              records where necessary: Article 6(1)(f) GDPR and, where
              applicable, Article 6(1)(c) GDPR.
            </li>
          </ul>
        </Section>

        <Section title="3. Hosting and server-side delivery">
          <p>
            The site is hosted through GitHub Pages. When you visit the site,
            the hosting layer may process technical request data such as your IP
            address, requested URL, time of access, referrer, browser and device
            metadata, and transferred data volume.
          </p>
          <p>
            We use this processing to deliver the website, maintain technical
            security, and defend against misuse. We do not use those hosting
            logs for reader profiling.
          </p>
        </Section>

        <Section title="4. Consent management">
          <p>
            The site uses a consent tool so analytics stays off until you opt
            in. The consent tool stores your choice in a necessary cookie named{' '}
            <code className="rounded bg-[#efe5d3] px-1.5 py-0.5 text-sm text-[#201b16]">
              cc_cookie
            </code>
            .
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Purpose: remember and document your consent choice</li>
            <li>Retention: up to 182 days, unless cleared earlier</li>
            <li>Legal basis: Article 6(1)(f) GDPR</li>
          </ul>
          <p>
            You can change your choice at any time through the cookie
            preferences control in the footer.
          </p>
        </Section>

        <Section title="5. Analytics">
          <p>
            If you consent, the site loads Umami Cloud to measure how the
            catalog is used. We use this only to understand which pages and
            books readers visit, which referrals bring traffic, and how the site
            performs.
          </p>
          <p>
            No analytics runs before consent. We do not use advertising
            trackers, cross-site profiling, or behavioral ad targeting on this
            site.
          </p>
          <p>
            The site does not intentionally set separate advertising cookies for
            analytics. The necessary consent cookie described above is separate
            from analytics itself.
          </p>
        </Section>

        <Section title="6. External retailer links">
          <p>
            Book purchases do not take place on this site. If you click a buy
            link, your browser is sent to the relevant Amazon storefront. From
            that point onward, Amazon processes data under its own terms and
            privacy notice.
          </p>
          <p>
            We do not receive your payment details or Amazon account data from
            those purchases.
          </p>
        </Section>

        <Section title="7. Email contact">
          <p>
            If you contact us by email, we process the information contained in
            your message in order to respond and handle the request. That will
            usually include your email address, the content of the message, and
            any information you choose to provide.
          </p>
          <p>
            We keep correspondence only for as long as needed to handle the
            inquiry and any follow-up, unless a longer retention period is
            legally required.
          </p>
        </Section>

        <Section title="8. Recipients and third-country transfers">
          <p>Personal data may be processed by these categories of recipients:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>hosting and site-delivery providers, in particular GitHub Pages</li>
            <li>analytics provider Umami Cloud, but only after consent</li>
            <li>email infrastructure involved in sending and receiving messages</li>
            <li>Amazon, if you choose to follow an external retailer link</li>
          </ul>
          <p>
            Some of these providers may process data outside the EU or EEA,
            especially in the United States. Where that happens, transfers rely
            on the provider&apos;s current legal transfer mechanism, such as an
            adequacy decision or contractual safeguards where applicable.
          </p>
        </Section>

        <Section title="9. Retention">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Consent preferences: up to 182 days or until you clear them
            </li>
            <li>
              Analytics data: only as long as needed for aggregated traffic
              analysis within the analytics account
            </li>
            <li>
              Email correspondence: as long as needed to process the matter and
              comply with any legal retention duties
            </li>
            <li>
              Hosting and technical logs: according to the operational retention
              rules of the hosting provider
            </li>
          </ul>
        </Section>

        <Section title="10. Your rights">
          <p>
            Under the GDPR, you may have rights of access, rectification,
            erasure, restriction, objection, and data portability, depending on
            the circumstances of the processing.
          </p>
          <p>
            If processing is based on consent, you can withdraw that consent at
            any time for the future. Withdrawal does not affect processing that
            took place before the withdrawal.
          </p>
          <p>
            You also have the right to lodge a complaint with a supervisory
            authority. In Berlin, that is the Berlin Commissioner for Data
            Protection and Freedom of Information.
          </p>
          <p>
            The current complaint path is available here:{' '}
            <a
              href="https://www.datenschutz-berlin.de/buergerinnen-und-buerger/beschwerde/einreichen-einer-beschwerde"
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              datenschutz-berlin.de
            </a>
          </p>
        </Section>

        <Section title="11. No automated decision-making">
          <p>
            We do not use the site to make automated decisions about you that
            produce legal or similarly significant effects.
          </p>
        </Section>

        <Section title="12. Related pages">
          <p>
            For the site&apos;s formal identification details, see the{' '}
            <Link
              href="/impressum"
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              Impressum / Imprint
            </Link>
            . For cookie-specific details, see{' '}
            <Link
              href="/cookies"
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              Cookies / Consent
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
