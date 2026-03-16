import type { BuyLink } from '@/lib/catalog'

type StorefrontKey =
  | 'US'
  | 'CA'
  | 'MX'
  | 'BR'
  | 'UK'
  | 'DE'
  | 'FR'
  | 'IT'
  | 'ES'
  | 'NL'
  | 'SE'
  | 'PL'
  | 'BE'
  | 'TR'
  | 'AE'
  | 'SA'
  | 'EG'
  | 'SG'
  | 'AU'
  | 'JP'
  | 'IN'

const STOREFRONTS: Record<StorefrontKey, string> = {
  US: 'www.amazon.com',
  CA: 'www.amazon.ca',
  MX: 'www.amazon.com.mx',
  BR: 'www.amazon.com.br',
  UK: 'www.amazon.co.uk',
  DE: 'www.amazon.de',
  FR: 'www.amazon.fr',
  IT: 'www.amazon.it',
  ES: 'www.amazon.es',
  NL: 'www.amazon.nl',
  SE: 'www.amazon.se',
  PL: 'www.amazon.pl',
  BE: 'www.amazon.com.be',
  TR: 'www.amazon.com.tr',
  AE: 'www.amazon.ae',
  SA: 'www.amazon.sa',
  EG: 'www.amazon.eg',
  SG: 'www.amazon.sg',
  AU: 'www.amazon.com.au',
  JP: 'www.amazon.co.jp',
  IN: 'www.amazon.in',
}

const REGION_MAP: Record<string, StorefrontKey> = {
  us: 'US',
  ca: 'CA',
  mx: 'MX',
  br: 'BR',
  gb: 'UK',
  uk: 'UK',
  ie: 'UK',
  de: 'DE',
  at: 'DE',
  ch: 'DE',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  nl: 'NL',
  se: 'SE',
  pl: 'PL',
  be: 'BE',
  tr: 'TR',
  ae: 'AE',
  sa: 'SA',
  eg: 'EG',
  sg: 'SG',
  au: 'AU',
  nz: 'AU',
  jp: 'JP',
  in: 'IN',
}

const LANGUAGE_MAP: Record<string, StorefrontKey> = {
  en: 'US',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  nl: 'NL',
  sv: 'SE',
  pl: 'PL',
  tr: 'TR',
  ar: 'AE',
  ja: 'JP',
  hi: 'IN',
  pt: 'BR',
}

export function getPreferredAmazonDomain(locales: readonly string[]) {
  for (const locale of locales) {
    const normalized = locale.toLowerCase()
    const [language, region] = normalized.split(/[-_]/)
    if (region && REGION_MAP[region]) {
      return STOREFRONTS[REGION_MAP[region]]
    }
    if (language && LANGUAGE_MAP[language]) {
      return STOREFRONTS[LANGUAGE_MAP[language]]
    }
  }
  return STOREFRONTS.US
}

export function buildLocalizedAmazonUrl(link: BuyLink, domain: string) {
  return `https://${domain}/dp/${link.asin}`
}
