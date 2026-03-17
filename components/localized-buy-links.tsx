'use client'

import { useEffect, useMemo, useState } from 'react'

import type { BuyLink } from '@/lib/catalog'
import { buildLocalizedAmazonUrl, getPreferredAmazonDomain } from '@/lib/amazon'

type LocalizedBuyLinksProps = {
  links: BuyLink[]
}

export function LocalizedBuyLinks({ links }: LocalizedBuyLinksProps) {
  const [domain, setDomain] = useState<string | null>(null)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    const locales = navigator.languages?.length
      ? navigator.languages
      : [navigator.language]
    const timeZone =
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : undefined
    setDomain(getPreferredAmazonDomain(locales, timeZone))
  }, [])

  const localizedLinks = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        url: buildLocalizedAmazonUrl(link, domain ?? 'www.amazon.com'),
      })),
    [domain, links],
  )

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        {localizedLinks
          .filter((link) => Boolean(link.url))
          .map((link) => (
            <a
              key={link.format}
              href={link.url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#111318] transition hover:bg-[#d0a85c] sm:w-auto"
            >
              {link.label}
            </a>
          ))}
      </div>
    </div>
  )
}
