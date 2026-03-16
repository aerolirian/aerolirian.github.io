import type { Metadata } from 'next'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Privacy',
  description: `Privacy information for ${SITE.name}.`,
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
        Privacy
      </p>
      <h1 className="mt-5 max-w-[12ch] font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white">
        Minimal data collection. Explicit consent for analytics.
      </h1>
      <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
        <p className="text-lg leading-relaxed">
          This is a static publishing site. We collect only what is needed to
          serve pages and, when you allow it, basic analytics to understand how
          the catalog is used.
        </p>
        <p className="text-lg leading-relaxed">
          Analytics is optional and controlled through the site’s consent
          manager. You can change that choice at any time from the footer link.
        </p>
        <p className="text-lg leading-relaxed">
          Book purchases are handled on Amazon. When you follow a buy link, you
          leave this site and are subject to Amazon’s terms and privacy
          practices.
        </p>
      </div>
    </main>
  )
}
