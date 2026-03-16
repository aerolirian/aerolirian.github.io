export const SEO = {
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || '',
}

export const ANALYTICS = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '',
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || '',
  umamiSrc: process.env.NEXT_PUBLIC_UMAMI_SRC?.trim() || '',
  umamiHostUrl: process.env.NEXT_PUBLIC_UMAMI_HOST_URL?.trim() || '',
  umamiDomains: process.env.NEXT_PUBLIC_UMAMI_DOMAINS?.trim() || '',
}

export const CONSENT_ENABLED = Boolean(
  ANALYTICS.gaMeasurementId ||
    (ANALYTICS.umamiWebsiteId && ANALYTICS.umamiSrc),
)
