export const SEO = {
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || '',
}

export const ANALYTICS = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '',
  umamiWebsiteId:
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ||
    '3f07c367-deed-427d-87ff-0cdd27ffb1d4',
  umamiSrc:
    process.env.NEXT_PUBLIC_UMAMI_SRC?.trim() ||
    'https://cloud.umami.is/script.js',
  umamiHostUrl:
    process.env.NEXT_PUBLIC_UMAMI_HOST_URL?.trim() ||
    'https://cloud.umami.is',
  umamiDomains:
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS?.trim() ||
    'heritagecanon.com,www.heritagecanon.com',
}

export const CONSENT_ENABLED = true
