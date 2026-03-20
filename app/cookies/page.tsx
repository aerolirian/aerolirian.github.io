import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Cookies and Consent',
  description: `Cookie and consent information for ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/cookies`,
  },
}

const updatedAt = 'Last updated: March 20, 2026'

function Row({
  name,
  purpose,
  retention,
  basis,
}: {
  name: string
  purpose: string
  retention: string
  basis: string
}) {
  return (
    <tr className="border-t border-[#e5d7c2]">
      <td className="px-4 py-4 align-top font-medium text-[#201b16]">{name}</td>
      <td className="px-4 py-4 align-top">{purpose}</td>
      <td className="px-4 py-4 align-top">{retention}</td>
      <td className="px-4 py-4 align-top">{basis}</td>
    </tr>
  )
}

export default function CookiesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
        Cookies / Consent
      </p>
      <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.9] tracking-[-0.04em] text-[#201b16] sm:text-6xl">
        Cookie and consent notice
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4036]">
        This page describes the site-side cookie and the way analytics consent
        works on Heritage Canon.
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#8a7864]">
        {updatedAt}
      </p>

      <section className="mt-10 rounded-[1.5rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_12px_40px_rgba(61,45,25,0.06)]">
        <h2 className="font-serif text-2xl leading-tight text-[#201b16]">
          Cookies used by this site
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-[0.98rem] leading-relaxed text-[#3b322a]">
            <thead>
              <tr className="border-b border-[#d8c8ae] text-sm uppercase tracking-[0.16em] text-[#8a7864]">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Retention</th>
                <th className="px-4 py-3 font-semibold">Legal basis</th>
              </tr>
            </thead>
            <tbody>
              <Row
                name="cc_cookie"
                purpose="Stores your consent choice so analytics stays off until you opt in and so your preference does not need to be asked on every page load."
                retention="Up to 182 days, unless cleared earlier."
                basis="Art. 6(1)(f) GDPR"
              />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_12px_40px_rgba(61,45,25,0.06)]">
        <h2 className="font-serif text-2xl leading-tight text-[#201b16]">
          Analytics behavior
        </h2>
        <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-[#3b322a]">
          <p>
            Analytics is disabled by default. It is loaded only if you accept
            the analytics category in the consent interface.
          </p>
          <p>
            The site does not intentionally set advertising cookies or use the
            consent layer to enable ad targeting. The consent tool exists to
            control analytics and to remember your choice.
          </p>
          <p>
            If you decline analytics, the site remains usable and the catalog
            still works normally.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_12px_40px_rgba(61,45,25,0.06)]">
        <h2 className="font-serif text-2xl leading-tight text-[#201b16]">
          How to change your choice
        </h2>
        <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-[#3b322a]">
          <p>
            You can reopen the cookie preferences interface at any time through
            the cookie preferences control in the footer.
          </p>
          <p>
            You can also delete cookies in your browser settings. If you do,
            the site will ask again for your preference on a later visit.
          </p>
          <p>
            For the broader privacy notice, see{' '}
            <Link
              href="/privacy"
              className="text-[#8f6a2a] underline decoration-[#cdb796] underline-offset-4 transition hover:text-[#201b16]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_12px_40px_rgba(61,45,25,0.06)]">
        <h2 className="font-serif text-2xl leading-tight text-[#201b16]">
          External sites
        </h2>
        <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-[#3b322a]">
          <p>
            If you click through to Amazon or another external site, that site
            may set its own cookies or similar technologies. Those third-party
            cookies are not controlled by Heritage Canon and are governed by the
            third party&apos;s own notice.
          </p>
        </div>
      </section>
    </main>
  )
}
