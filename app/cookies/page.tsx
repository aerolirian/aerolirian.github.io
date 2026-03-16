import type { Metadata } from 'next'

import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Cookies',
  description: `Cookie information for ${SITE.name}.`,
}

export default function CookiesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-16 lg:px-8">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
        Cookies
      </p>
      <h1 className="mt-5 max-w-[12ch] font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white">
        Analytics cookies and consent.
      </h1>
      <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
        <p className="text-lg leading-relaxed">
          Necessary storage is used only to remember your consent settings.
          Analytics runs only if you opt in.
        </p>
        <p className="text-lg leading-relaxed">
          Any analytics active on the site is blocked until consent is granted.
        </p>
        <p className="text-lg leading-relaxed">
          You can review or change your choice at any time using the cookie
          preferences control in the footer.
        </p>
      </div>
    </main>
  )
}
